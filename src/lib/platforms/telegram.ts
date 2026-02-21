import { supabaseAdmin, PlatformName } from '../supabase'
import { PlatformAdapter, PublishResult, TelegramConfig } from './types'

/**
 * Telegram Bot API Adapter
 *
 * Uses the Telegram Bot API to send messages to a channel or group.
 * No OAuth needed — just a bot token and channel ID.
 *
 * API docs: https://core.telegram.org/bots/api
 */
export class TelegramAdapter implements PlatformAdapter {
  readonly name: PlatformName = 'telegram'

  private async getCredentials(): Promise<{
    accessToken: string
    config: TelegramConfig
  }> {
    const { data, error } = await supabaseAdmin
      .from('platform_credentials')
      .select('access_token, extra_config, status')
      .eq('platform', 'telegram')
      .single()

    if (error || !data) {
      throw new Error(`Telegram credentials not found: ${error?.message}`)
    }
    if (data.status !== 'connected') {
      throw new Error(`Telegram is not connected (status: ${data.status})`)
    }

    const config = data.extra_config as unknown as TelegramConfig
    if (!config.bot_token || !config.channel_id) {
      throw new Error('Telegram config missing bot_token or channel_id')
    }

    return { accessToken: data.access_token, config }
  }

  private async callTelegramApi(
    botToken: string,
    method: string,
    body: Record<string, unknown>
  ): Promise<{ ok: boolean; result?: Record<string, unknown>; description?: string }> {
    const url = `https://api.telegram.org/bot${botToken}/${method}`

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Telegram API ${method} failed (${res.status}): ${text}`)
    }

    return res.json()
  }

  async publishText(text: string): Promise<PublishResult> {
    try {
      const { config } = await this.getCredentials()

      const result = await this.callTelegramApi(config.bot_token, 'sendMessage', {
        chat_id: config.channel_id,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
      })

      if (!result.ok) {
        return { success: false, error: result.description || 'sendMessage failed' }
      }

      const messageId = (result.result as Record<string, unknown>)?.message_id
      return { success: true, postId: String(messageId) }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) }
    }
  }

  async publishImage(caption: string, imageUrl: string): Promise<PublishResult> {
    try {
      const { config } = await this.getCredentials()

      const result = await this.callTelegramApi(config.bot_token, 'sendPhoto', {
        chat_id: config.channel_id,
        photo: imageUrl,
        caption,
        parse_mode: 'HTML',
      })

      if (!result.ok) {
        return { success: false, error: result.description || 'sendPhoto failed' }
      }

      const messageId = (result.result as Record<string, unknown>)?.message_id
      return { success: true, postId: String(messageId) }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) }
    }
  }

  async publishVideo(caption: string, videoUrl: string): Promise<PublishResult> {
    try {
      const { config } = await this.getCredentials()

      const result = await this.callTelegramApi(config.bot_token, 'sendVideo', {
        chat_id: config.channel_id,
        video: videoUrl,
        caption,
        parse_mode: 'HTML',
        supports_streaming: true,
      })

      if (!result.ok) {
        return { success: false, error: result.description || 'sendVideo failed' }
      }

      const messageId = (result.result as Record<string, unknown>)?.message_id
      return { success: true, postId: String(messageId) }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) }
    }
  }

  async isConnected(): Promise<boolean> {
    try {
      const { config } = await this.getCredentials()
      // Verify the bot token is valid by calling getMe
      const result = await this.callTelegramApi(config.bot_token, 'getMe', {})
      return result.ok === true
    } catch {
      return false
    }
  }

  async refreshToken(): Promise<void> {
    // Telegram bot tokens don't expire — no-op
  }
}
