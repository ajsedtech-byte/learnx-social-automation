import { PlatformName } from '../supabase'

// ── Common interface all 10 platform adapters implement ──

export interface PublishResult {
  success: boolean
  postId?: string
  error?: string
}

export interface PlatformAdapter {
  name: PlatformName

  /** Publish a text-only post */
  publishText(text: string): Promise<PublishResult>

  /** Publish an image with caption */
  publishImage(caption: string, imageUrl: string): Promise<PublishResult>

  /** Publish a video (Reels, Shorts, etc.) */
  publishVideo(caption: string, videoUrl: string): Promise<PublishResult>

  /** Check if the platform is connected and token is valid */
  isConnected(): Promise<boolean>

  /** Refresh an expired token (no-op for platforms that don't need it) */
  refreshToken(): Promise<void>
}

// ── Platform config stored in extra_config JSONB ──

export interface InstagramConfig {
  instagram_business_id: string
  facebook_page_id: string
}

export interface FacebookConfig {
  page_id: string
  page_access_token: string
}

export interface TwitterConfig {
  api_key: string
  api_secret: string
  access_token: string
  access_token_secret: string
}

export interface LinkedInConfig {
  person_urn: string  // "urn:li:person:XXXX" or "urn:li:organization:XXXX"
}

export interface ThreadsConfig {
  threads_user_id: string
}

export interface TelegramConfig {
  bot_token: string
  channel_id: string  // "@channelname" or "-100XXXX"
}

export interface YouTubeConfig {
  channel_id: string
}

export interface PinterestConfig {
  board_id: string
}

export interface WhatsAppConfig {
  phone_number_id: string
  waba_id: string // WhatsApp Business Account ID
}

export interface RedditConfig {
  subreddit: string
  client_id: string
  client_secret: string
  username: string
  password: string
}
