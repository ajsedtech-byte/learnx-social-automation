import { supabaseAdmin, PlatformName } from '../supabase'
import { PlatformAdapter, PublishResult, YouTubeConfig } from './types'

/**
 * YouTube Data API v3 Adapter
 *
 * Uploads videos via the resumable upload protocol:
 *   1. POST /upload/youtube/v3/videos?uploadType=resumable to initiate
 *   2. PUT the video binary to the returned upload URI
 *
 * For Shorts: title includes #Shorts, video is <60s, 9:16 aspect ratio.
 * YouTube does not support text-only or image-only posts via the Data API.
 *
 * API docs: https://developers.google.com/youtube/v3/docs/videos/insert
 */

const YOUTUBE_API_BASE = 'https://www.googleapis.com'

export class YouTubeAdapter implements PlatformAdapter {
  readonly name: PlatformName = 'youtube'

  private async getCredentials(): Promise<{
    accessToken: string
    refreshToken: string | null
    config: YouTubeConfig
  }> {
    const { data, error } = await supabaseAdmin
      .from('platform_credentials')
      .select('access_token, refresh_token, token_expires, extra_config, status')
      .eq('platform', 'youtube')
      .single()

    if (error || !data) {
      throw new Error(`YouTube credentials not found: ${error?.message}`)
    }
    if (data.status !== 'connected') {
      throw new Error(`YouTube is not connected (status: ${data.status})`)
    }

    const config = data.extra_config as unknown as YouTubeConfig

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      config,
    }
  }

  async publishText(_text: string): Promise<PublishResult> {
    // YouTube does not support text-only posts via the Data API.
    // Community posts require different permissions and are not available in the standard API.
    return {
      success: false,
      error: 'YouTube does not support text-only posts via the Data API. Use publishVideo instead.',
    }
  }

  async publishImage(_caption: string, _imageUrl: string): Promise<PublishResult> {
    // YouTube does not have a standalone image post type via the Data API.
    return {
      success: false,
      error: 'YouTube does not support image-only posts via the Data API. Use publishVideo instead.',
    }
  }

  async publishVideo(caption: string, videoUrl: string): Promise<PublishResult> {
    try {
      const { accessToken } = await this.getCredentials()

      // Step 1: Download the video from the source URL
      const downloadRes = await fetch(videoUrl)
      if (!downloadRes.ok) {
        throw new Error(`Failed to download video from ${videoUrl}: ${downloadRes.status}`)
      }

      const videoBlob = await downloadRes.blob()
      const videoBuffer = await downloadRes.arrayBuffer()
      const contentType = videoBlob.type || 'video/mp4'
      const contentLength = videoBuffer.byteLength

      // Parse title from caption (first line or first 100 chars)
      const lines = caption.split('\n')
      const title = (lines[0] || caption).substring(0, 100)
      const description = caption

      // Video metadata
      const metadata = {
        snippet: {
          title,
          description,
          categoryId: '22', // "People & Blogs" — most generic
        },
        status: {
          privacyStatus: 'public',
          selfDeclaredMadeForKids: false,
        },
      }

      // Step 2: Initiate resumable upload
      const initiateUrl = `${YOUTUBE_API_BASE}/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status`

      const initiateRes = await fetch(initiateUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json; charset=UTF-8',
          'X-Upload-Content-Length': contentLength.toString(),
          'X-Upload-Content-Type': contentType,
        },
        body: JSON.stringify(metadata),
      })

      if (!initiateRes.ok) {
        const errBody = await initiateRes.text()
        throw new Error(`YouTube upload initiation failed (${initiateRes.status}): ${errBody}`)
      }

      const uploadUri = initiateRes.headers.get('location')
      if (!uploadUri) {
        throw new Error('YouTube did not return a resumable upload URI')
      }

      // Step 3: Upload the video binary to the resumable URI
      const uploadRes = await fetch(uploadUri, {
        method: 'PUT',
        headers: {
          'Content-Type': contentType,
          'Content-Length': contentLength.toString(),
        },
        body: videoBuffer,
      })

      if (!uploadRes.ok) {
        const errBody = await uploadRes.text()
        throw new Error(`YouTube video upload failed (${uploadRes.status}): ${errBody}`)
      }

      const uploadData = await uploadRes.json()
      return { success: true, postId: uploadData.id }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) }
    }
  }

  async isConnected(): Promise<boolean> {
    try {
      const { accessToken } = await this.getCredentials()

      const url = `${YOUTUBE_API_BASE}/youtube/v3/channels?part=id&mine=true`
      const res = await fetch(url, {
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
        .eq('platform', 'youtube')
        .single()

      if (error || !data) {
        throw new Error(`Cannot refresh YouTube token: ${error?.message}`)
      }

      if (!data.refresh_token) {
        throw new Error('YouTube refresh_token is not available')
      }

      // Check if token actually needs refreshing
      if (data.token_expires) {
        const expiresAt = new Date(data.token_expires)
        // Refresh if within 5 minutes of expiry
        const refreshThreshold = new Date(Date.now() + 5 * 60 * 1000)
        if (expiresAt > refreshThreshold) {
          return // Token still valid
        }
      }

      // Google OAuth 2.0 token refresh
      const body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: data.refresh_token,
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
      })

      const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      })

      if (!res.ok) {
        const errBody = await res.text()
        throw new Error(`YouTube token refresh failed (${res.status}): ${errBody}`)
      }

      const tokenData = await res.json()
      const newExpiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString()

      await supabaseAdmin
        .from('platform_credentials')
        .update({
          access_token: tokenData.access_token,
          // Google doesn't always return a new refresh_token
          token_expires: newExpiresAt,
          status: 'connected',
          updated_at: new Date().toISOString(),
        })
        .eq('platform', 'youtube')
    } catch (err) {
      await supabaseAdmin
        .from('platform_credentials')
        .update({ status: 'expired', updated_at: new Date().toISOString() })
        .eq('platform', 'youtube')

      throw err
    }
  }
}
