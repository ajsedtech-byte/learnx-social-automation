import { supabaseAdmin, PlatformName } from '../supabase'
import { PlatformAdapter, PublishResult, PinterestConfig } from './types'

/**
 * Pinterest API v5 Adapter
 *
 * Creates Pins via POST /v5/pins.
 * OAuth 2.0 with Bearer token.
 *
 * Pinterest is image-first — text-only posts are not supported.
 * Video pins are created the same way but with media_source.source_type = "video_id"
 * after uploading via the media endpoint.
 *
 * API docs: https://developers.pinterest.com/docs/api/v5/
 */

const PINTEREST_API_BASE = 'https://api.pinterest.com/v5'

export class PinterestAdapter implements PlatformAdapter {
  readonly name: PlatformName = 'pinterest'

  private async getCredentials(): Promise<{
    accessToken: string
    refreshToken: string | null
    config: PinterestConfig
  }> {
    const { data, error } = await supabaseAdmin
      .from('platform_credentials')
      .select('access_token, refresh_token, token_expires, extra_config, status')
      .eq('platform', 'pinterest')
      .single()

    if (error || !data) {
      throw new Error(`Pinterest credentials not found: ${error?.message}`)
    }
    if (data.status !== 'connected') {
      throw new Error(`Pinterest is not connected (status: ${data.status})`)
    }

    const config = data.extra_config as unknown as PinterestConfig
    if (!config.board_id) {
      throw new Error('Pinterest config missing board_id')
    }

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      config,
    }
  }

  async publishText(_text: string): Promise<PublishResult> {
    // Pinterest requires an image or video — text-only is not supported.
    // However, we can still create a pin with just a note/description if the API allows it.
    // In practice, Pinterest API requires a media_source, so this gracefully fails.
    return {
      success: false,
      error: 'Pinterest does not support text-only posts. A pin requires an image or video.',
    }
  }

  async publishImage(caption: string, imageUrl: string): Promise<PublishResult> {
    try {
      const { accessToken, config } = await this.getCredentials()

      // Parse title from caption (first line) and use rest as description
      const lines = caption.split('\n')
      const title = (lines[0] || '').substring(0, 100)
      const description = caption

      const pinBody = {
        board_id: config.board_id,
        title,
        description,
        media_source: {
          source_type: 'image_url',
          url: imageUrl,
        },
      }

      const res = await fetch(`${PINTEREST_API_BASE}/pins`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pinBody),
      })

      if (!res.ok) {
        const errBody = await res.text()
        return { success: false, error: `Pinterest pin creation failed (${res.status}): ${errBody}` }
      }

      const data = await res.json()
      return { success: true, postId: data.id }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) }
    }
  }

  async publishVideo(caption: string, videoUrl: string): Promise<PublishResult> {
    try {
      const { accessToken, config } = await this.getCredentials()

      // Step 1: Register media upload
      const registerRes = await fetch(`${PINTEREST_API_BASE}/media`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ media_type: 'video' }),
      })

      if (!registerRes.ok) {
        const errBody = await registerRes.text()
        throw new Error(`Pinterest media registration failed (${registerRes.status}): ${errBody}`)
      }

      const registerData = await registerRes.json()
      const mediaId = registerData.media_id
      const uploadUrl = registerData.upload_url
      const uploadParams = registerData.upload_parameters || []

      // Step 2: Upload video to Pinterest's S3 bucket via multipart form
      // Pinterest uses a presigned S3 upload with form fields
      const downloadRes = await fetch(videoUrl)
      if (!downloadRes.ok) {
        throw new Error(`Failed to download video from ${videoUrl}: ${downloadRes.status}`)
      }

      const videoBlob = await downloadRes.blob()

      // Build a multipart form with the upload parameters + file
      const formData = new FormData()
      for (const param of uploadParams) {
        formData.append(param.name, param.value)
      }
      formData.append('file', videoBlob)

      const uploadRes = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok && uploadRes.status !== 204) {
        const errBody = await uploadRes.text()
        throw new Error(`Pinterest video upload failed (${uploadRes.status}): ${errBody}`)
      }

      // Step 3: Poll media status until ready
      await this.waitForMediaReady(accessToken, mediaId)

      // Step 4: Create pin with the uploaded video
      const lines = caption.split('\n')
      const title = (lines[0] || '').substring(0, 100)
      const description = caption

      const pinBody = {
        board_id: config.board_id,
        title,
        description,
        media_source: {
          source_type: 'video_id',
          media_id: mediaId,
        },
      }

      const pinRes = await fetch(`${PINTEREST_API_BASE}/pins`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pinBody),
      })

      if (!pinRes.ok) {
        const errBody = await pinRes.text()
        return { success: false, error: `Pinterest video pin creation failed (${pinRes.status}): ${errBody}` }
      }

      const pinData = await pinRes.json()
      return { success: true, postId: pinData.id }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) }
    }
  }

  /**
   * Poll Pinterest media status until it's "succeeded".
   */
  private async waitForMediaReady(accessToken: string, mediaId: string): Promise<void> {
    const maxAttempts = 60
    const pollInterval = 5_000

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const res = await fetch(`${PINTEREST_API_BASE}/media/${mediaId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      if (!res.ok) {
        const errBody = await res.text()
        throw new Error(`Pinterest media status check failed (${res.status}): ${errBody}`)
      }

      const data = await res.json()

      if (data.status === 'succeeded') {
        return
      }
      if (data.status === 'failed') {
        throw new Error(`Pinterest media processing failed: ${JSON.stringify(data.failure_reason)}`)
      }

      await new Promise((resolve) => setTimeout(resolve, pollInterval))
    }

    throw new Error('Pinterest media processing timed out')
  }

  async isConnected(): Promise<boolean> {
    try {
      const { accessToken } = await this.getCredentials()

      const res = await fetch(`${PINTEREST_API_BASE}/user_account`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      return res.ok
    } catch {
      return false
    }
  }

  async refreshToken(): Promise<void> {
    try {
      const { data, error } = await supabaseAdmin
        .from('platform_credentials')
        .select('access_token, refresh_token, token_expires')
        .eq('platform', 'pinterest')
        .single()

      if (error || !data) {
        throw new Error(`Cannot refresh Pinterest token: ${error?.message}`)
      }

      if (!data.refresh_token) {
        throw new Error('Pinterest refresh_token is not available')
      }

      if (data.token_expires) {
        const expiresAt = new Date(data.token_expires)
        if (expiresAt > new Date()) {
          return
        }
      }

      // Pinterest OAuth 2.0 token refresh uses Basic auth with client_id:client_secret
      const clientId = process.env.PINTEREST_CLIENT_ID || ''
      const clientSecret = process.env.PINTEREST_CLIENT_SECRET || ''
      const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

      const body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: data.refresh_token,
      })

      const res = await fetch(`${PINTEREST_API_BASE}/oauth/token`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      })

      if (!res.ok) {
        const errBody = await res.text()
        throw new Error(`Pinterest token refresh failed (${res.status}): ${errBody}`)
      }

      const tokenData = await res.json()
      const newExpiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString()

      await supabaseAdmin
        .from('platform_credentials')
        .update({
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token || data.refresh_token,
          token_expires: newExpiresAt,
          status: 'connected',
          updated_at: new Date().toISOString(),
        })
        .eq('platform', 'pinterest')
    } catch (err) {
      await supabaseAdmin
        .from('platform_credentials')
        .update({ status: 'expired', updated_at: new Date().toISOString() })
        .eq('platform', 'pinterest')

      throw err
    }
  }
}
