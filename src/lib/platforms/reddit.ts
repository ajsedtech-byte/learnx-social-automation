import { supabaseAdmin, PlatformName } from '../supabase'
import { PlatformAdapter, PublishResult, RedditConfig } from './types'

/**
 * Reddit API Adapter
 *
 * Submits posts via POST /api/submit to oauth.reddit.com.
 * Uses OAuth 2.0 with the "script" app type (client credentials + user password).
 *
 * Post types:
 *   - kind=self for text posts (with selftext body)
 *   - kind=link for link posts (with url pointing to image/video)
 *
 * Reddit does not have a direct image/video upload via the public API for
 * automated posts — instead, link posts with direct image/video URLs are used,
 * or the new media upload endpoint for Reddit-hosted images.
 *
 * API docs: https://www.reddit.com/dev/api/#POST_api_submit
 */

const REDDIT_AUTH_URL = 'https://www.reddit.com/api/v1/access_token'
const REDDIT_API_BASE = 'https://oauth.reddit.com'

export class RedditAdapter implements PlatformAdapter {
  readonly name: PlatformName = 'reddit'

  private async getCredentials(): Promise<{
    accessToken: string
    config: RedditConfig
  }> {
    const { data, error } = await supabaseAdmin
      .from('platform_credentials')
      .select('access_token, extra_config, status')
      .eq('platform', 'reddit')
      .single()

    if (error || !data) {
      throw new Error(`Reddit credentials not found: ${error?.message}`)
    }
    if (data.status !== 'connected') {
      throw new Error(`Reddit is not connected (status: ${data.status})`)
    }

    const config = data.extra_config as unknown as RedditConfig
    if (!config.subreddit || !config.client_id || !config.client_secret) {
      throw new Error('Reddit config missing required fields (subreddit, client_id, client_secret)')
    }

    return { accessToken: data.access_token, config }
  }

  /**
   * Obtain a new OAuth token using Reddit's "script" app flow (password grant).
   * This is required because Reddit tokens expire after 1 hour.
   */
  private async obtainAccessToken(config: RedditConfig): Promise<string> {
    const basicAuth = Buffer.from(`${config.client_id}:${config.client_secret}`).toString('base64')

    const body = new URLSearchParams({
      grant_type: 'password',
      username: config.username,
      password: config.password,
    })

    const res = await fetch(REDDIT_AUTH_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'learnx2-social-publisher/1.0',
      },
      body: body.toString(),
    })

    if (!res.ok) {
      const errBody = await res.text()
      throw new Error(`Reddit auth failed (${res.status}): ${errBody}`)
    }

    const tokenData = await res.json()

    if (tokenData.error) {
      throw new Error(`Reddit auth error: ${tokenData.error}`)
    }

    // Store the new token and expiry
    const newExpiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString()

    await supabaseAdmin
      .from('platform_credentials')
      .update({
        access_token: tokenData.access_token,
        token_expires: newExpiresAt,
        status: 'connected',
        updated_at: new Date().toISOString(),
      })
      .eq('platform', 'reddit')

    return tokenData.access_token
  }

  /**
   * Get a valid access token, refreshing if necessary.
   */
  private async getValidToken(): Promise<{ token: string; config: RedditConfig }> {
    const { data, error } = await supabaseAdmin
      .from('platform_credentials')
      .select('access_token, token_expires, extra_config, status')
      .eq('platform', 'reddit')
      .single()

    if (error || !data) {
      throw new Error(`Reddit credentials not found: ${error?.message}`)
    }

    const config = data.extra_config as unknown as RedditConfig

    // Check if token is expired or about to expire (within 5 min)
    const needsRefresh =
      !data.access_token ||
      !data.token_expires ||
      new Date(data.token_expires) < new Date(Date.now() + 5 * 60 * 1000)

    if (needsRefresh) {
      const newToken = await this.obtainAccessToken(config)
      return { token: newToken, config }
    }

    return { token: data.access_token, config }
  }

  /**
   * Submit a post to a subreddit.
   */
  private async submitPost(
    token: string,
    subreddit: string,
    params: Record<string, string>
  ): Promise<PublishResult> {
    const body = new URLSearchParams({
      sr: subreddit,
      api_type: 'json',
      resubmit: 'true',
      ...params,
    })

    const res = await fetch(`${REDDIT_API_BASE}/api/submit`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'learnx2-social-publisher/1.0',
      },
      body: body.toString(),
    })

    if (!res.ok) {
      const errBody = await res.text()
      return { success: false, error: `Reddit submit failed (${res.status}): ${errBody}` }
    }

    const data = await res.json()

    // Reddit returns errors in json.errors array
    if (data.json?.errors && data.json.errors.length > 0) {
      const errors = data.json.errors
        .map((e: string[]) => e.join(': '))
        .join('; ')
      return { success: false, error: `Reddit submit errors: ${errors}` }
    }

    const postId = data.json?.data?.id || data.json?.data?.name
    const postUrl = data.json?.data?.url

    return { success: true, postId: postId || postUrl }
  }

  async publishText(text: string): Promise<PublishResult> {
    try {
      const { token, config } = await this.getValidToken()

      // Parse title from first line, rest is body
      const lines = text.split('\n')
      const title = (lines[0] || 'Post').substring(0, 300) // Reddit title max ~300 chars
      const selftext = lines.slice(1).join('\n').trim()

      return this.submitPost(token, config.subreddit, {
        kind: 'self',
        title,
        text: selftext,
      })
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) }
    }
  }

  async publishImage(caption: string, imageUrl: string): Promise<PublishResult> {
    try {
      const { token, config } = await this.getValidToken()

      // For images, submit as a link post with the image URL
      const lines = caption.split('\n')
      const title = (lines[0] || 'Image Post').substring(0, 300)

      return this.submitPost(token, config.subreddit, {
        kind: 'link',
        title,
        url: imageUrl,
      })
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) }
    }
  }

  async publishVideo(caption: string, videoUrl: string): Promise<PublishResult> {
    try {
      const { token, config } = await this.getValidToken()

      // For videos, submit as a link post with the video URL
      // Reddit will embed supported video URLs (YouTube, v.redd.it, etc.)
      const lines = caption.split('\n')
      const title = (lines[0] || 'Video Post').substring(0, 300)

      return this.submitPost(token, config.subreddit, {
        kind: 'link',
        title,
        url: videoUrl,
      })
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) }
    }
  }

  async isConnected(): Promise<boolean> {
    try {
      const { token } = await this.getValidToken()

      const res = await fetch(`${REDDIT_API_BASE}/api/v1/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'User-Agent': 'learnx2-social-publisher/1.0',
        },
      })

      return res.ok
    } catch {
      return false
    }
  }

  async refreshToken(): Promise<void> {
    try {
      const { config } = await this.getCredentials()
      await this.obtainAccessToken(config)
    } catch (err) {
      await supabaseAdmin
        .from('platform_credentials')
        .update({ status: 'expired', updated_at: new Date().toISOString() })
        .eq('platform', 'reddit')

      throw err
    }
  }
}
