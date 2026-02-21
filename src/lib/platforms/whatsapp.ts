import { supabaseAdmin, PlatformName } from '../supabase'
import { PlatformAdapter, PublishResult, WhatsAppConfig } from './types'

/**
 * WhatsApp Cloud API Adapter (Meta Business)
 *
 * Sends messages via POST /{phone_number_id}/messages.
 * Uses pre-approved message templates for broadcast messages.
 *
 * For interactive / template messages:
 *   - Text: template with text body component
 *   - Image: template with header image component
 *   - Video: template with header video component
 *
 * Note: WhatsApp Business API does NOT support free-form broadcast messages.
 * All outbound messages (outside the 24-hour window) must use approved templates.
 *
 * API docs: https://developers.facebook.com/docs/whatsapp/cloud-api/messages
 */

const GRAPH_API_BASE = 'https://graph.facebook.com/v22.0'

export class WhatsAppAdapter implements PlatformAdapter {
  readonly name: PlatformName = 'whatsapp'

  private async getCredentials(): Promise<{
    accessToken: string
    config: WhatsAppConfig
  }> {
    const { data, error } = await supabaseAdmin
      .from('platform_credentials')
      .select('access_token, extra_config, status')
      .eq('platform', 'whatsapp')
      .single()

    if (error || !data) {
      throw new Error(`WhatsApp credentials not found: ${error?.message}`)
    }
    if (data.status !== 'connected') {
      throw new Error(`WhatsApp is not connected (status: ${data.status})`)
    }

    const config = data.extra_config as unknown as WhatsAppConfig
    if (!config.phone_number_id) {
      throw new Error('WhatsApp config missing phone_number_id')
    }

    return { accessToken: data.access_token, config }
  }

  /**
   * Send a WhatsApp message using the Cloud API.
   */
  private async sendMessage(
    phoneNumberId: string,
    accessToken: string,
    messageBody: Record<string, unknown>
  ): Promise<{ messages: Array<{ id: string }> }> {
    const url = `${GRAPH_API_BASE}/${phoneNumberId}/messages`

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageBody),
    })

    if (!res.ok) {
      const errBody = await res.text()
      throw new Error(`WhatsApp send failed (${res.status}): ${errBody}`)
    }

    return res.json()
  }

  /**
   * Upload media to WhatsApp Cloud API and get a media ID.
   */
  private async uploadMedia(
    phoneNumberId: string,
    accessToken: string,
    mediaUrl: string,
    mediaType: 'image' | 'video'
  ): Promise<string> {
    // Download the media first
    const downloadRes = await fetch(mediaUrl)
    if (!downloadRes.ok) {
      throw new Error(`Failed to download media from ${mediaUrl}: ${downloadRes.status}`)
    }

    const mediaBlob = await downloadRes.blob()
    const mimeType = mediaBlob.type || (mediaType === 'image' ? 'image/jpeg' : 'video/mp4')

    const formData = new FormData()
    formData.append('messaging_product', 'whatsapp')
    formData.append('type', mimeType)
    formData.append('file', mediaBlob, `upload.${mediaType === 'image' ? 'jpg' : 'mp4'}`)

    const url = `${GRAPH_API_BASE}/${phoneNumberId}/media`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    })

    if (!res.ok) {
      const errBody = await res.text()
      throw new Error(`WhatsApp media upload failed (${res.status}): ${errBody}`)
    }

    const data = await res.json()
    return data.id
  }

  /**
   * Send a text-based template message to a broadcast list.
   *
   * NOTE: WhatsApp requires pre-approved templates. The "text_broadcast" template
   * must be created and approved in the WhatsApp Business Manager before use.
   * Adjust the template name and language to match your approved template.
   */
  async publishText(text: string): Promise<PublishResult> {
    try {
      const { accessToken, config } = await this.getCredentials()

      // Retrieve the broadcast list (stored recipients) from extra_config or a separate table
      // For now, we send a template message. In production, you'd iterate over recipients.
      // This demonstrates sending a single message — in practice you'd batch these.

      const messageBody = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        // Placeholder: in production, iterate over your broadcast list
        to: config.phone_number_id, // Replace with actual recipient number
        type: 'template',
        template: {
          name: 'text_broadcast', // Must be pre-approved in WhatsApp Business Manager
          language: { code: 'en' },
          components: [
            {
              type: 'body',
              parameters: [
                {
                  type: 'text',
                  text: text.substring(0, 1024), // WhatsApp template param limit
                },
              ],
            },
          ],
        },
      }

      const result = await this.sendMessage(config.phone_number_id, accessToken, messageBody)

      if (result.messages && result.messages.length > 0) {
        return { success: true, postId: result.messages[0].id }
      }

      return { success: false, error: 'WhatsApp returned no message ID' }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) }
    }
  }

  async publishImage(caption: string, imageUrl: string): Promise<PublishResult> {
    try {
      const { accessToken, config } = await this.getCredentials()

      // Upload image to WhatsApp to get a media ID
      const mediaId = await this.uploadMedia(
        config.phone_number_id,
        accessToken,
        imageUrl,
        'image'
      )

      // Send image message using the uploaded media ID
      const messageBody = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: config.phone_number_id,
        type: 'image',
        image: {
          id: mediaId,
          caption: caption.substring(0, 1024),
        },
      }

      const result = await this.sendMessage(config.phone_number_id, accessToken, messageBody)

      if (result.messages && result.messages.length > 0) {
        return { success: true, postId: result.messages[0].id }
      }

      return { success: false, error: 'WhatsApp returned no message ID' }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) }
    }
  }

  async publishVideo(caption: string, videoUrl: string): Promise<PublishResult> {
    try {
      const { accessToken, config } = await this.getCredentials()

      // Upload video to WhatsApp
      const mediaId = await this.uploadMedia(
        config.phone_number_id,
        accessToken,
        videoUrl,
        'video'
      )

      // Send video message
      const messageBody = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: config.phone_number_id,
        type: 'video',
        video: {
          id: mediaId,
          caption: caption.substring(0, 1024),
        },
      }

      const result = await this.sendMessage(config.phone_number_id, accessToken, messageBody)

      if (result.messages && result.messages.length > 0) {
        return { success: true, postId: result.messages[0].id }
      }

      return { success: false, error: 'WhatsApp returned no message ID' }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) }
    }
  }

  async isConnected(): Promise<boolean> {
    try {
      const { accessToken, config } = await this.getCredentials()

      // Verify the phone number ID is valid by fetching its details
      const url = `${GRAPH_API_BASE}/${config.phone_number_id}?access_token=${accessToken}`
      const res = await fetch(url)

      return res.ok
    } catch {
      return false
    }
  }

  async refreshToken(): Promise<void> {
    // WhatsApp Cloud API uses the same Meta/Facebook token system.
    // System user tokens (permanent tokens) don't need refreshing.
    // If using a short-lived user token, refresh via Meta's token exchange.
    try {
      const { data, error } = await supabaseAdmin
        .from('platform_credentials')
        .select('access_token, token_expires')
        .eq('platform', 'whatsapp')
        .single()

      if (error || !data) {
        throw new Error(`Cannot refresh WhatsApp token: ${error?.message}`)
      }

      // Check if this is a permanent system token (no expiry)
      if (!data.token_expires) {
        return // System user tokens don't expire
      }

      const expiresAt = new Date(data.token_expires)
      if (expiresAt > new Date()) {
        return // Still valid
      }

      // Exchange for a new long-lived token via Meta Graph API
      const url = `${GRAPH_API_BASE}/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.META_APP_ID}&client_secret=${process.env.META_APP_SECRET}&fb_exchange_token=${data.access_token}`

      const res = await fetch(url)
      if (!res.ok) {
        const errBody = await res.text()
        throw new Error(`WhatsApp token refresh failed (${res.status}): ${errBody}`)
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
        .eq('platform', 'whatsapp')
    } catch (err) {
      await supabaseAdmin
        .from('platform_credentials')
        .update({ status: 'expired', updated_at: new Date().toISOString() })
        .eq('platform', 'whatsapp')

      throw err
    }
  }
}
