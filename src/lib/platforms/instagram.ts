import { supabaseAdmin, PlatformName } from '../supabase'
import { PlatformAdapter, PublishResult, InstagramConfig } from './types'

/**
 * Instagram Graph API Adapter (Meta Business)
 *
 * Two-step process:
 *   1. Create a media container (POST /{ig_user_id}/media)
 *   2. Publish the container (POST /{ig_user_id}/media_publish)
 *
 * For images: pass image_url + caption to container creation
 * For Reels: pass video_url + media_type=REELS to container creation,
 *            then poll container status until FINISHED before publishing.
 *
 * Instagram does NOT support text-only posts through the API.
 *
 * API docs: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/content-publishing
 */

const GRAPH_API_BASE = 'https://graph.facebook.com/v22.0'
const CONTAINER_POLL_INTERVAL_MS = 5_000
const CONTAINER_POLL_MAX_ATTEMPTS = 60 // 5 min max

export class InstagramAdapter implements PlatformAdapter {
  readonly name: PlatformName = 'instagram'

  private async getCredentials(): Promise<{
    accessToken: string
    config: InstagramConfig
  }> {
    const { data, error } = await supabaseAdmin
      .from('platform_credentials')
      .select('access_token, refresh_token, token_expires, extra_config, status')
      .eq('platform', 'instagram')
      .single()

    if (error || !data) {
      throw new Error(`Instagram credentials not found: ${error?.message}`)
    }
    if (data.status !== 'connected') {
      throw new Error(`Instagram is not connected (status: ${data.status})`)
    }

    const config = data.extra_config as unknown as InstagramConfig
    if (!config.instagram_business_id) {
      throw new Error('Instagram config missing instagram_business_id')
    }

    return { accessToken: data.access_token, config }
  }

  /**
   * Create a media container on Instagram.
   */
  private async createContainer(
    igUserId: string,
    accessToken: string,
    params: Record<string, string>
  ): Promise<string> {
    const url = `${GRAPH_API_BASE}/${igUserId}/media`

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
      throw new Error(`Instagram container creation failed (${res.status}): ${errBody}`)
    }

    const data = await res.json()
    if (!data.id) {
      throw new Error('Instagram container creation returned no ID')
    }

    return data.id as string
  }

  /**
   * Poll a container's status until it's FINISHED (needed for video/Reels).
   */
  private async waitForContainer(containerId: string, accessToken: string): Promise<void> {
    for (let attempt = 0; attempt < CONTAINER_POLL_MAX_ATTEMPTS; attempt++) {
      const url = `${GRAPH_API_BASE}/${containerId}?fields=status_code,status&access_token=${accessToken}`
      const res = await fetch(url)

      if (!res.ok) {
        const errBody = await res.text()
        throw new Error(`Instagram container poll failed (${res.status}): ${errBody}`)
      }

      const data = await res.json()
      const statusCode: string = data.status_code

      if (statusCode === 'FINISHED') {
        return
      }
      if (statusCode === 'ERROR') {
        throw new Error(`Instagram container processing error: ${data.status || 'unknown'}`)
      }

      // Still IN_PROGRESS — wait and retry
      await new Promise((resolve) => setTimeout(resolve, CONTAINER_POLL_INTERVAL_MS))
    }

    throw new Error('Instagram container processing timed out')
  }

  /**
   * Publish a previously created container.
   */
  private async publishContainer(
    igUserId: string,
    containerId: string,
    accessToken: string
  ): Promise<string> {
    const url = `${GRAPH_API_BASE}/${igUserId}/media_publish`

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
      throw new Error(`Instagram publish failed (${res.status}): ${errBody}`)
    }

    const data = await res.json()
    return data.id as string
  }

  async publishText(_text: string): Promise<PublishResult> {
    // Instagram does not support text-only posts via API
    return {
      success: false,
      error: 'Instagram does not support text-only posts. Use publishImage or publishVideo instead.',
    }
  }

  async publishImage(caption: string, imageUrl: string): Promise<PublishResult> {
    try {
      const { accessToken, config } = await this.getCredentials()
      const igUserId = config.instagram_business_id

      // Step 1: Create image container
      const containerId = await this.createContainer(igUserId, accessToken, {
        image_url: imageUrl,
        caption,
      })

      // Step 2: Publish the container (images are processed instantly)
      const postId = await this.publishContainer(igUserId, containerId, accessToken)

      return { success: true, postId }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) }
    }
  }

  async publishVideo(caption: string, videoUrl: string): Promise<PublishResult> {
    try {
      const { accessToken, config } = await this.getCredentials()
      const igUserId = config.instagram_business_id

      // Step 1: Create Reels container
      const containerId = await this.createContainer(igUserId, accessToken, {
        video_url: videoUrl,
        caption,
        media_type: 'REELS',
      })

      // Step 2: Wait for video processing to complete
      await this.waitForContainer(containerId, accessToken)

      // Step 3: Publish the container
      const postId = await this.publishContainer(igUserId, containerId, accessToken)

      return { success: true, postId }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) }
    }
  }

  async isConnected(): Promise<boolean> {
    try {
      const { accessToken, config } = await this.getCredentials()
      const igUserId = config.instagram_business_id

      const url = `${GRAPH_API_BASE}/${igUserId}?fields=id,username&access_token=${accessToken}`
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
        .eq('platform', 'instagram')
        .single()

      if (error || !data) {
        throw new Error(`Cannot refresh Instagram token: ${error?.message}`)
      }

      // Check if token is still valid (Meta long-lived tokens last 60 days)
      if (data.token_expires) {
        const expiresAt = new Date(data.token_expires)
        if (expiresAt > new Date()) {
          return // Token not yet expired
        }
      }

      // Exchange for a new long-lived token
      const url = `${GRAPH_API_BASE}/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.META_APP_ID}&client_secret=${process.env.META_APP_SECRET}&fb_exchange_token=${data.access_token}`

      const res = await fetch(url)
      if (!res.ok) {
        const errBody = await res.text()
        throw new Error(`Instagram token refresh failed (${res.status}): ${errBody}`)
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
        .eq('platform', 'instagram')
    } catch (err) {
      // Mark as expired so dashboard shows the issue
      await supabaseAdmin
        .from('platform_credentials')
        .update({ status: 'expired', updated_at: new Date().toISOString() })
        .eq('platform', 'instagram')

      throw err
    }
  }
}
