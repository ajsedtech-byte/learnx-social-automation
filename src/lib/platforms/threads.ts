import { supabaseAdmin, PlatformName } from '../supabase'
import { PlatformAdapter, PublishResult, ThreadsConfig } from './types'

/**
 * Threads API Adapter (Meta)
 *
 * Two-step publishing (similar to Instagram):
 *   1. Create container: POST /{user_id}/threads
 *   2. Publish container: POST /{user_id}/threads_publish
 *
 * Supports text, images, and video posts.
 *
 * API docs: https://developers.facebook.com/docs/threads/posts
 */

const THREADS_API_BASE = 'https://graph.threads.net/v1.0'
const CONTAINER_POLL_INTERVAL_MS = 5_000
const CONTAINER_POLL_MAX_ATTEMPTS = 60

export class ThreadsAdapter implements PlatformAdapter {
  readonly name: PlatformName = 'threads'

  private async getCredentials(): Promise<{
    accessToken: string
    config: ThreadsConfig
  }> {
    const { data, error } = await supabaseAdmin
      .from('platform_credentials')
      .select('access_token, extra_config, status')
      .eq('platform', 'threads')
      .single()

    if (error || !data) {
      throw new Error(`Threads credentials not found: ${error?.message}`)
    }
    if (data.status !== 'connected') {
      throw new Error(`Threads is not connected (status: ${data.status})`)
    }

    const config = data.extra_config as unknown as ThreadsConfig
    if (!config.threads_user_id) {
      throw new Error('Threads config missing threads_user_id')
    }

    return { accessToken: data.access_token, config }
  }

  /**
   * Create a Threads media container.
   */
  private async createContainer(
    userId: string,
    accessToken: string,
    params: Record<string, string>
  ): Promise<string> {
    const url = `${THREADS_API_BASE}/${userId}/threads`

    const body = new URLSearchParams({
      access_token: accessToken,
      ...params,
    })

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })

    if (!res.ok) {
      const errBody = await res.text()
      throw new Error(`Threads container creation failed (${res.status}): ${errBody}`)
    }

    const data = await res.json()
    if (!data.id) {
      throw new Error('Threads container creation returned no ID')
    }

    return data.id as string
  }

  /**
   * Poll container status until FINISHED (required for video containers).
   */
  private async waitForContainer(containerId: string, accessToken: string): Promise<void> {
    for (let attempt = 0; attempt < CONTAINER_POLL_MAX_ATTEMPTS; attempt++) {
      const url = `${THREADS_API_BASE}/${containerId}?fields=status&access_token=${accessToken}`
      const res = await fetch(url)

      if (!res.ok) {
        const errBody = await res.text()
        throw new Error(`Threads container poll failed (${res.status}): ${errBody}`)
      }

      const data = await res.json()

      if (data.status === 'FINISHED') {
        return
      }
      if (data.status === 'ERROR') {
        throw new Error(`Threads container processing failed: ${JSON.stringify(data)}`)
      }

      await new Promise((resolve) => setTimeout(resolve, CONTAINER_POLL_INTERVAL_MS))
    }

    throw new Error('Threads container processing timed out')
  }

  /**
   * Publish a previously created container.
   */
  private async publishContainer(
    userId: string,
    containerId: string,
    accessToken: string
  ): Promise<string> {
    const url = `${THREADS_API_BASE}/${userId}/threads_publish`

    const body = new URLSearchParams({
      creation_id: containerId,
      access_token: accessToken,
    })

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })

    if (!res.ok) {
      const errBody = await res.text()
      throw new Error(`Threads publish failed (${res.status}): ${errBody}`)
    }

    const data = await res.json()
    return data.id as string
  }

  async publishText(text: string): Promise<PublishResult> {
    try {
      const { accessToken, config } = await this.getCredentials()
      const userId = config.threads_user_id

      // Step 1: Create text container
      const containerId = await this.createContainer(userId, accessToken, {
        media_type: 'TEXT',
        text,
      })

      // Step 2: Publish
      const postId = await this.publishContainer(userId, containerId, accessToken)

      return { success: true, postId }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) }
    }
  }

  async publishImage(caption: string, imageUrl: string): Promise<PublishResult> {
    try {
      const { accessToken, config } = await this.getCredentials()
      const userId = config.threads_user_id

      // Step 1: Create image container
      const containerId = await this.createContainer(userId, accessToken, {
        media_type: 'IMAGE',
        image_url: imageUrl,
        text: caption,
      })

      // Step 2: Publish
      const postId = await this.publishContainer(userId, containerId, accessToken)

      return { success: true, postId }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) }
    }
  }

  async publishVideo(caption: string, videoUrl: string): Promise<PublishResult> {
    try {
      const { accessToken, config } = await this.getCredentials()
      const userId = config.threads_user_id

      // Step 1: Create video container
      const containerId = await this.createContainer(userId, accessToken, {
        media_type: 'VIDEO',
        video_url: videoUrl,
        text: caption,
      })

      // Step 2: Wait for video processing
      await this.waitForContainer(containerId, accessToken)

      // Step 3: Publish
      const postId = await this.publishContainer(userId, containerId, accessToken)

      return { success: true, postId }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) }
    }
  }

  async isConnected(): Promise<boolean> {
    try {
      const { accessToken, config } = await this.getCredentials()
      const url = `${THREADS_API_BASE}/${config.threads_user_id}?fields=id,username&access_token=${accessToken}`
      const res = await fetch(url)
      return res.ok
    } catch {
      return false
    }
  }

  async refreshToken(): Promise<void> {
    try {
      const { data, error } = await supabaseAdmin
        .from('platform_credentials')
        .select('access_token, token_expires')
        .eq('platform', 'threads')
        .single()

      if (error || !data) {
        throw new Error(`Cannot refresh Threads token: ${error?.message}`)
      }

      if (data.token_expires) {
        const expiresAt = new Date(data.token_expires)
        if (expiresAt > new Date()) {
          return
        }
      }

      // Threads uses the same long-lived token refresh as Instagram
      const url = `${THREADS_API_BASE}/refresh_access_token?grant_type=th_refresh_token&access_token=${data.access_token}`

      const res = await fetch(url)
      if (!res.ok) {
        const errBody = await res.text()
        throw new Error(`Threads token refresh failed (${res.status}): ${errBody}`)
      }

      const tokenData = await res.json()
      const newExpiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString()

      await supabaseAdmin
        .from('platform_credentials')
        .update({
          access_token: tokenData.access_token,
          token_expires: newExpiresAt,
          status: 'connected',
          updated_at: new Date().toISOString(),
        })
        .eq('platform', 'threads')
    } catch (err) {
      await supabaseAdmin
        .from('platform_credentials')
        .update({ status: 'expired', updated_at: new Date().toISOString() })
        .eq('platform', 'threads')

      throw err
    }
  }
}
