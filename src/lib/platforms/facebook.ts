import { supabaseAdmin, PlatformName } from '../supabase'
import { PlatformAdapter, PublishResult, FacebookConfig } from './types'

/**
 * Facebook Graph API Adapter (Page Posts)
 *
 * Publishes to a Facebook Page using the Page Access Token.
 *   - Text:  POST /{page_id}/feed
 *   - Image: POST /{page_id}/photos
 *   - Video: POST /{page_id}/videos
 *
 * API docs: https://developers.facebook.com/docs/pages-api/posts
 */

const GRAPH_API_BASE = 'https://graph.facebook.com/v22.0'

export class FacebookAdapter implements PlatformAdapter {
  readonly name: PlatformName = 'facebook'

  private async getCredentials(): Promise<{
    accessToken: string
    config: FacebookConfig
  }> {
    const { data, error } = await supabaseAdmin
      .from('platform_credentials')
      .select('access_token, extra_config, status')
      .eq('platform', 'facebook')
      .single()

    if (error || !data) {
      throw new Error(`Facebook credentials not found: ${error?.message}`)
    }
    if (data.status !== 'connected') {
      throw new Error(`Facebook is not connected (status: ${data.status})`)
    }

    const config = data.extra_config as unknown as FacebookConfig
    if (!config.page_id) {
      throw new Error('Facebook config missing page_id')
    }

    return { accessToken: data.access_token, config }
  }

  /**
   * Get the effective page access token. If a specific page_access_token is
   * stored in extra_config, use that; otherwise fall back to the main access_token.
   */
  private getPageToken(accessToken: string, config: FacebookConfig): string {
    return config.page_access_token || accessToken
  }

  async publishText(text: string): Promise<PublishResult> {
    try {
      const { accessToken, config } = await this.getCredentials()
      const pageToken = this.getPageToken(accessToken, config)

      const url = `${GRAPH_API_BASE}/${config.page_id}/feed`

      const body = new URLSearchParams({
        message: text,
        access_token: pageToken,
      })

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      })

      if (!res.ok) {
        const errBody = await res.text()
        return { success: false, error: `Facebook text post failed (${res.status}): ${errBody}` }
      }

      const data = await res.json()
      return { success: true, postId: data.id }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) }
    }
  }

  async publishImage(caption: string, imageUrl: string): Promise<PublishResult> {
    try {
      const { accessToken, config } = await this.getCredentials()
      const pageToken = this.getPageToken(accessToken, config)

      const url = `${GRAPH_API_BASE}/${config.page_id}/photos`

      const body = new URLSearchParams({
        url: imageUrl,
        message: caption,
        access_token: pageToken,
      })

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      })

      if (!res.ok) {
        const errBody = await res.text()
        return { success: false, error: `Facebook photo post failed (${res.status}): ${errBody}` }
      }

      const data = await res.json()
      // Facebook returns { id, post_id } for photos
      return { success: true, postId: data.post_id || data.id }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) }
    }
  }

  async publishVideo(caption: string, videoUrl: string): Promise<PublishResult> {
    try {
      const { accessToken, config } = await this.getCredentials()
      const pageToken = this.getPageToken(accessToken, config)

      const url = `${GRAPH_API_BASE}/${config.page_id}/videos`

      const body = new URLSearchParams({
        file_url: videoUrl,
        description: caption,
        access_token: pageToken,
      })

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      })

      if (!res.ok) {
        const errBody = await res.text()
        return { success: false, error: `Facebook video post failed (${res.status}): ${errBody}` }
      }

      const data = await res.json()
      return { success: true, postId: data.id }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) }
    }
  }

  async isConnected(): Promise<boolean> {
    try {
      const { accessToken, config } = await this.getCredentials()
      const pageToken = this.getPageToken(accessToken, config)

      const url = `${GRAPH_API_BASE}/${config.page_id}?fields=id,name&access_token=${pageToken}`
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
        .select('access_token, extra_config, token_expires')
        .eq('platform', 'facebook')
        .single()

      if (error || !data) {
        throw new Error(`Cannot refresh Facebook token: ${error?.message}`)
      }

      // Check if token needs refreshing
      if (data.token_expires) {
        const expiresAt = new Date(data.token_expires)
        if (expiresAt > new Date()) {
          return // Still valid
        }
      }

      // Exchange for a new long-lived token
      const url = `${GRAPH_API_BASE}/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.META_APP_ID}&client_secret=${process.env.META_APP_SECRET}&fb_exchange_token=${data.access_token}`

      const res = await fetch(url)
      if (!res.ok) {
        const errBody = await res.text()
        throw new Error(`Facebook token refresh failed (${res.status}): ${errBody}`)
      }

      const tokenData = await res.json()
      const newExpiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString()

      // Update user-level token
      await supabaseAdmin
        .from('platform_credentials')
        .update({
          access_token: tokenData.access_token,
          token_expires: newExpiresAt,
          status: 'connected',
          updated_at: new Date().toISOString(),
        })
        .eq('platform', 'facebook')

      // Also refresh the page access token if stored in extra_config
      const config = data.extra_config as unknown as FacebookConfig
      if (config.page_id) {
        const pageTokenUrl = `${GRAPH_API_BASE}/${config.page_id}?fields=access_token&access_token=${tokenData.access_token}`
        const pageRes = await fetch(pageTokenUrl)
        if (pageRes.ok) {
          const pageData = await pageRes.json()
          if (pageData.access_token) {
            const updatedConfig = { ...config, page_access_token: pageData.access_token }
            await supabaseAdmin
              .from('platform_credentials')
              .update({
                extra_config: updatedConfig as unknown as Record<string, string>,
                updated_at: new Date().toISOString(),
              })
              .eq('platform', 'facebook')
          }
        }
      }
    } catch (err) {
      await supabaseAdmin
        .from('platform_credentials')
        .update({ status: 'expired', updated_at: new Date().toISOString() })
        .eq('platform', 'facebook')

      throw err
    }
  }
}
