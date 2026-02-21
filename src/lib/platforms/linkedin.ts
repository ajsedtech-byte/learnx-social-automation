import { supabaseAdmin, PlatformName } from '../supabase'
import { PlatformAdapter, PublishResult, LinkedInConfig } from './types'

/**
 * LinkedIn API Adapter (Community Management API)
 *
 * Publishes posts via POST /v2/posts (using the new Posts API).
 * OAuth 2.0 with Bearer token. Tokens expire in 60 days.
 *
 * For images/videos, uses the Vector Assets API:
 *   1. Register upload -> get upload URL + asset URN
 *   2. Upload binary to the pre-signed URL
 *   3. Create post referencing the asset URN
 *
 * API docs: https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api
 */

const LINKEDIN_API_BASE = 'https://api.linkedin.com'

export class LinkedInAdapter implements PlatformAdapter {
  readonly name: PlatformName = 'linkedin'

  private async getCredentials(): Promise<{
    accessToken: string
    refreshToken: string | null
    config: LinkedInConfig
  }> {
    const { data, error } = await supabaseAdmin
      .from('platform_credentials')
      .select('access_token, refresh_token, token_expires, extra_config, status')
      .eq('platform', 'linkedin')
      .single()

    if (error || !data) {
      throw new Error(`LinkedIn credentials not found: ${error?.message}`)
    }
    if (data.status !== 'connected') {
      throw new Error(`LinkedIn is not connected (status: ${data.status})`)
    }

    const config = data.extra_config as unknown as LinkedInConfig
    if (!config.person_urn) {
      throw new Error('LinkedIn config missing person_urn')
    }

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      config,
    }
  }

  /**
   * Register an image upload with LinkedIn and get an upload URL + image URN.
   */
  private async registerImageUpload(
    accessToken: string,
    ownerUrn: string
  ): Promise<{ uploadUrl: string; imageUrn: string }> {
    const url = `${LINKEDIN_API_BASE}/rest/images?action=initializeUpload`

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'LinkedIn-Version': '202401',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify({
        initializeUploadRequest: {
          owner: ownerUrn,
        },
      }),
    })

    if (!res.ok) {
      const errBody = await res.text()
      throw new Error(`LinkedIn image upload registration failed (${res.status}): ${errBody}`)
    }

    const data = await res.json()
    return {
      uploadUrl: data.value.uploadUrl,
      imageUrn: data.value.image,
    }
  }

  /**
   * Download an image from a URL and upload it to LinkedIn's pre-signed URL.
   */
  private async uploadBinaryToLinkedIn(
    uploadUrl: string,
    sourceUrl: string,
    accessToken: string
  ): Promise<void> {
    // Download the image/video from the source URL
    const downloadRes = await fetch(sourceUrl)
    if (!downloadRes.ok) {
      throw new Error(`Failed to download media from ${sourceUrl}: ${downloadRes.status}`)
    }

    const blob = await downloadRes.blob()
    const arrayBuffer = await blob.arrayBuffer()

    // Upload to LinkedIn's pre-signed URL
    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': blob.type || 'application/octet-stream',
      },
      body: arrayBuffer,
    })

    if (!uploadRes.ok) {
      const errBody = await uploadRes.text()
      throw new Error(`LinkedIn binary upload failed (${uploadRes.status}): ${errBody}`)
    }
  }

  /**
   * Register a video upload with LinkedIn.
   */
  private async registerVideoUpload(
    accessToken: string,
    ownerUrn: string,
    fileSizeBytes: number
  ): Promise<{ uploadUrl: string; videoUrn: string }> {
    const url = `${LINKEDIN_API_BASE}/rest/videos?action=initializeUpload`

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'LinkedIn-Version': '202401',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify({
        initializeUploadRequest: {
          owner: ownerUrn,
          fileSizeBytes,
          uploadCaptions: false,
          uploadThumbnail: false,
        },
      }),
    })

    if (!res.ok) {
      const errBody = await res.text()
      throw new Error(`LinkedIn video upload registration failed (${res.status}): ${errBody}`)
    }

    const data = await res.json()
    return {
      uploadUrl: data.value.uploadInstructions[0].uploadUrl,
      videoUrn: data.value.video,
    }
  }

  /**
   * Create a post on LinkedIn using the Posts API.
   */
  private async createPost(
    accessToken: string,
    authorUrn: string,
    commentary: string,
    mediaContent?: { id: string; type: 'IMAGE' | 'VIDEO'; title?: string }
  ): Promise<string> {
    const url = `${LINKEDIN_API_BASE}/rest/posts`

    const postBody: Record<string, unknown> = {
      author: authorUrn,
      commentary,
      visibility: 'PUBLIC',
      distribution: {
        feedDistribution: 'MAIN_FEED',
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: 'PUBLISHED',
    }

    if (mediaContent) {
      if (mediaContent.type === 'IMAGE') {
        postBody.content = {
          media: {
            title: mediaContent.title || '',
            id: mediaContent.id,
          },
        }
      } else if (mediaContent.type === 'VIDEO') {
        postBody.content = {
          media: {
            title: mediaContent.title || '',
            id: mediaContent.id,
          },
        }
      }
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'LinkedIn-Version': '202401',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(postBody),
    })

    if (!res.ok) {
      const errBody = await res.text()
      throw new Error(`LinkedIn post creation failed (${res.status}): ${errBody}`)
    }

    // LinkedIn returns the post URN in the x-restli-id header
    const postUrn = res.headers.get('x-restli-id') || res.headers.get('x-linkedin-id') || ''
    return postUrn
  }

  async publishText(text: string): Promise<PublishResult> {
    try {
      const { accessToken, config } = await this.getCredentials()
      const postId = await this.createPost(accessToken, config.person_urn, text)
      return { success: true, postId }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) }
    }
  }

  async publishImage(caption: string, imageUrl: string): Promise<PublishResult> {
    try {
      const { accessToken, config } = await this.getCredentials()

      // Step 1: Register image upload
      const { uploadUrl, imageUrn } = await this.registerImageUpload(
        accessToken,
        config.person_urn
      )

      // Step 2: Download source image and upload to LinkedIn
      await this.uploadBinaryToLinkedIn(uploadUrl, imageUrl, accessToken)

      // Step 3: Create post with image
      const postId = await this.createPost(accessToken, config.person_urn, caption, {
        id: imageUrn,
        type: 'IMAGE',
      })

      return { success: true, postId }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) }
    }
  }

  async publishVideo(caption: string, videoUrl: string): Promise<PublishResult> {
    try {
      const { accessToken, config } = await this.getCredentials()

      // Step 1: Download video to get its size
      const downloadRes = await fetch(videoUrl)
      if (!downloadRes.ok) {
        throw new Error(`Failed to download video from ${videoUrl}: ${downloadRes.status}`)
      }

      const videoBlob = await downloadRes.blob()
      const videoBuffer = await videoBlob.arrayBuffer()
      const fileSizeBytes = videoBuffer.byteLength

      // Step 2: Register video upload
      const { uploadUrl, videoUrn } = await this.registerVideoUpload(
        accessToken,
        config.person_urn,
        fileSizeBytes
      )

      // Step 3: Upload video binary
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': videoBlob.type || 'video/mp4',
        },
        body: videoBuffer,
      })

      if (!uploadRes.ok) {
        const errBody = await uploadRes.text()
        throw new Error(`LinkedIn video upload failed (${uploadRes.status}): ${errBody}`)
      }

      // Step 4: Create post with video
      const postId = await this.createPost(accessToken, config.person_urn, caption, {
        id: videoUrn,
        type: 'VIDEO',
      })

      return { success: true, postId }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) }
    }
  }

  async isConnected(): Promise<boolean> {
    try {
      const { accessToken } = await this.getCredentials()

      const url = `${LINKEDIN_API_BASE}/v2/userinfo`
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
        .eq('platform', 'linkedin')
        .single()

      if (error || !data) {
        throw new Error(`Cannot refresh LinkedIn token: ${error?.message}`)
      }

      if (!data.refresh_token) {
        throw new Error('LinkedIn refresh_token is not available')
      }

      // Check if token actually needs refreshing
      if (data.token_expires) {
        const expiresAt = new Date(data.token_expires)
        // Refresh if within 7 days of expiry
        const refreshThreshold = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        if (expiresAt > refreshThreshold) {
          return // Token still has >7 days left
        }
      }

      // LinkedIn OAuth 2.0 token refresh
      const body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: data.refresh_token,
        client_id: process.env.LINKEDIN_CLIENT_ID || '',
        client_secret: process.env.LINKEDIN_CLIENT_SECRET || '',
      })

      const res = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      })

      if (!res.ok) {
        const errBody = await res.text()
        throw new Error(`LinkedIn token refresh failed (${res.status}): ${errBody}`)
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
        .eq('platform', 'linkedin')
    } catch (err) {
      await supabaseAdmin
        .from('platform_credentials')
        .update({ status: 'expired', updated_at: new Date().toISOString() })
        .eq('platform', 'linkedin')

      throw err
    }
  }
}
