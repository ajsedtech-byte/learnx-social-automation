import { supabaseAdmin, PlatformName } from '../supabase'
import { PlatformAdapter, PublishResult, TwitterConfig } from './types'

/**
 * Twitter / X API v2 Adapter (Free Tier)
 *
 * Free tier supports text-only tweets (POST /2/tweets), 1,500/month.
 * Authentication: OAuth 1.0a with HMAC-SHA1 signature.
 *
 * API docs: https://developer.x.com/en/docs/twitter-api/tweets/manage-tweets/api-reference/post-tweets
 */
export class TwitterAdapter implements PlatformAdapter {
  readonly name: PlatformName = 'twitter'

  private async getCredentials(): Promise<{
    accessToken: string
    config: TwitterConfig
  }> {
    const { data, error } = await supabaseAdmin
      .from('platform_credentials')
      .select('access_token, extra_config, status')
      .eq('platform', 'twitter')
      .single()

    if (error || !data) {
      throw new Error(`Twitter credentials not found: ${error?.message}`)
    }
    if (data.status !== 'connected') {
      throw new Error(`Twitter is not connected (status: ${data.status})`)
    }

    const config = data.extra_config as unknown as TwitterConfig
    if (!config.api_key || !config.api_secret || !config.access_token || !config.access_token_secret) {
      throw new Error('Twitter config missing required OAuth 1.0a credentials')
    }

    return { accessToken: data.access_token, config }
  }

  /**
   * Percent-encode a string per RFC 3986 (required by OAuth 1.0a).
   */
  private percentEncode(str: string): string {
    return encodeURIComponent(str)
      .replace(/!/g, '%21')
      .replace(/\*/g, '%2A')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
  }

  /**
   * Generate an OAuth 1.0a HMAC-SHA1 authorization header.
   */
  private async generateOAuthHeader(
    method: string,
    url: string,
    config: TwitterConfig,
    additionalParams: Record<string, string> = {}
  ): Promise<string> {
    const timestamp = Math.floor(Date.now() / 1000).toString()
    const nonce = this.generateNonce()

    // OAuth params (sorted alphabetically later)
    const oauthParams: Record<string, string> = {
      oauth_consumer_key: config.api_key,
      oauth_nonce: nonce,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: timestamp,
      oauth_token: config.access_token,
      oauth_version: '1.0',
    }

    // Combine all params for signature base string
    const allParams = { ...oauthParams, ...additionalParams }
    const sortedKeys = Object.keys(allParams).sort()
    const paramString = sortedKeys
      .map((k) => `${this.percentEncode(k)}=${this.percentEncode(allParams[k])}`)
      .join('&')

    // Signature base string
    const baseString = [
      method.toUpperCase(),
      this.percentEncode(url),
      this.percentEncode(paramString),
    ].join('&')

    // Signing key
    const signingKey = `${this.percentEncode(config.api_secret)}&${this.percentEncode(config.access_token_secret)}`

    // HMAC-SHA1 signature using Web Crypto API (available in Node 18+ / Next.js)
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(signingKey),
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['sign']
    )
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(baseString))
    const signature = Buffer.from(signatureBuffer).toString('base64')

    oauthParams['oauth_signature'] = signature

    // Build the Authorization header
    const headerParts = Object.keys(oauthParams)
      .sort()
      .map((k) => `${this.percentEncode(k)}="${this.percentEncode(oauthParams[k])}"`)
      .join(', ')

    return `OAuth ${headerParts}`
  }

  private generateNonce(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('')
  }

  async publishText(text: string): Promise<PublishResult> {
    try {
      const { config } = await this.getCredentials()
      const url = 'https://api.twitter.com/2/tweets'

      const authHeader = await this.generateOAuthHeader('POST', url, config)

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!res.ok) {
        const errBody = await res.text()
        return { success: false, error: `Twitter API error (${res.status}): ${errBody}` }
      }

      const data = await res.json()
      return { success: true, postId: data.data?.id }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) }
    }
  }

  async publishImage(caption: string, _imageUrl: string): Promise<PublishResult> {
    // Twitter API Free tier does not support media uploads.
    // The v1.1 media/upload endpoint requires Basic or Pro tier.
    // Post the text with the image URL appended so it renders as a Twitter Card.
    return this.publishText(`${caption}\n\n${_imageUrl}`)
  }

  async publishVideo(caption: string, _videoUrl: string): Promise<PublishResult> {
    // Twitter API Free tier does not support video uploads.
    // Post the text with the video URL so it renders inline if supported.
    return this.publishText(`${caption}\n\n${_videoUrl}`)
  }

  async isConnected(): Promise<boolean> {
    try {
      const { config } = await this.getCredentials()
      const url = 'https://api.twitter.com/2/users/me'
      const authHeader = await this.generateOAuthHeader('GET', url, config)

      const res = await fetch(url, {
        method: 'GET',
        headers: { Authorization: authHeader },
      })

      return res.ok
    } catch {
      return false
    }
  }

  async refreshToken(): Promise<void> {
    // OAuth 1.0a tokens don't expire unless revoked — no-op
  }
}
