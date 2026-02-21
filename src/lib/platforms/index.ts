import { PlatformName, Post } from '../supabase'
import { PlatformAdapter, PublishResult } from './types'

import { TelegramAdapter } from './telegram'
import { TwitterAdapter } from './twitter'
import { InstagramAdapter } from './instagram'
import { FacebookAdapter } from './facebook'
import { ThreadsAdapter } from './threads'
import { LinkedInAdapter } from './linkedin'
import { YouTubeAdapter } from './youtube'
import { PinterestAdapter } from './pinterest'
import { WhatsAppAdapter } from './whatsapp'
import { RedditAdapter } from './reddit'

// ── Adapter Registry ──────────────────────────────────

/**
 * Singleton map of platform name -> adapter instance.
 * Adapters are stateless (credentials fetched per-call from Supabase),
 * so a single instance per platform is safe.
 */
const adapterMap: Record<PlatformName, PlatformAdapter> = {
  telegram: new TelegramAdapter(),
  twitter: new TwitterAdapter(),
  instagram: new InstagramAdapter(),
  facebook: new FacebookAdapter(),
  threads: new ThreadsAdapter(),
  linkedin: new LinkedInAdapter(),
  youtube: new YouTubeAdapter(),
  pinterest: new PinterestAdapter(),
  whatsapp: new WhatsAppAdapter(),
  reddit: new RedditAdapter(),
}

/**
 * Get the adapter for a specific platform.
 *
 * @throws Error if the platform name is not recognized.
 */
export function getAdapter(platform: PlatformName): PlatformAdapter {
  const adapter = adapterMap[platform]
  if (!adapter) {
    throw new Error(`No adapter registered for platform: ${platform}`)
  }
  return adapter
}

/**
 * Get all registered adapters.
 */
export function getAllAdapters(): PlatformAdapter[] {
  return Object.values(adapterMap)
}

// ── Publish Helpers ───────────────────────────────────

export type PublishType = 'text' | 'image' | 'video'

interface PublishOptions {
  /** The text content / caption */
  text: string
  /** Media URL (for image or video posts) */
  mediaUrl?: string
  /** The type of content to publish */
  type: PublishType
}

/**
 * Publish to a single platform.
 *
 * Routes to the correct publish method based on the content type.
 * Automatically attempts token refresh on first failure, then retries once.
 */
export async function publishToPlatform(
  platform: PlatformName,
  options: PublishOptions
): Promise<PublishResult> {
  const adapter = getAdapter(platform)

  let result: PublishResult

  switch (options.type) {
    case 'text':
      result = await adapter.publishText(options.text)
      break
    case 'image':
      if (!options.mediaUrl) {
        return { success: false, error: 'mediaUrl is required for image posts' }
      }
      result = await adapter.publishImage(options.text, options.mediaUrl)
      break
    case 'video':
      if (!options.mediaUrl) {
        return { success: false, error: 'mediaUrl is required for video posts' }
      }
      result = await adapter.publishVideo(options.text, options.mediaUrl)
      break
    default:
      return { success: false, error: `Unknown publish type: ${options.type}` }
  }

  // If the first attempt failed, try refreshing the token and retry once
  if (!result.success && result.error?.includes('401')) {
    try {
      await adapter.refreshToken()

      // Retry after token refresh
      switch (options.type) {
        case 'text':
          result = await adapter.publishText(options.text)
          break
        case 'image':
          result = await adapter.publishImage(options.text, options.mediaUrl!)
          break
        case 'video':
          result = await adapter.publishVideo(options.text, options.mediaUrl!)
          break
      }
    } catch {
      // Token refresh itself failed — return the original error
    }
  }

  return result
}

/**
 * Publish content to ALL specified platforms in parallel.
 *
 * Returns a record mapping each platform name to its publish result.
 * Never throws — all errors are captured in individual PublishResult objects.
 */
export async function publishToAll(
  post: Pick<Post, 'content' | 'media_urls' | 'platforms'>,
  platforms?: PlatformName[]
): Promise<Record<string, PublishResult>> {
  const targetPlatforms = platforms || post.platforms

  // Determine the publish type based on available media
  const hasMedia = post.media_urls && post.media_urls.length > 0
  const mediaUrl = hasMedia ? post.media_urls[0] : undefined

  // Detect if it's a video by file extension or common patterns
  const isVideo = mediaUrl
    ? /\.(mp4|mov|avi|webm|mkv)(\?|$)/i.test(mediaUrl) ||
      mediaUrl.includes('/video/') ||
      mediaUrl.includes('video_url')
    : false

  const publishType: PublishType = hasMedia ? (isVideo ? 'video' : 'image') : 'text'

  // Run all platform publishes in parallel
  const results = await Promise.allSettled(
    targetPlatforms.map(async (platform) => {
      // Use platform-specific content if available, fallback to first available
      const text =
        post.content[platform] ||
        Object.values(post.content).find((v) => v) ||
        ''

      const result = await publishToPlatform(platform, {
        text,
        mediaUrl,
        type: publishType,
      })

      return { platform, result }
    })
  )

  // Collect results into a record
  const resultMap: Record<string, PublishResult> = {}

  for (const settledResult of results) {
    if (settledResult.status === 'fulfilled') {
      const { platform, result } = settledResult.value
      resultMap[platform] = result
    } else {
      // This shouldn't happen since publishToPlatform catches all errors,
      // but handle it just in case
      const error = settledResult.reason instanceof Error
        ? settledResult.reason.message
        : String(settledResult.reason)
      // We can't easily get the platform name from a rejected promise,
      // so this is a safety net
      resultMap['unknown'] = { success: false, error }
    }
  }

  return resultMap
}

// ── Re-exports ────────────────────────────────────────

export type { PlatformAdapter, PublishResult } from './types'
export { TelegramAdapter } from './telegram'
export { TwitterAdapter } from './twitter'
export { InstagramAdapter } from './instagram'
export { FacebookAdapter } from './facebook'
export { ThreadsAdapter } from './threads'
export { LinkedInAdapter } from './linkedin'
export { YouTubeAdapter } from './youtube'
export { PinterestAdapter } from './pinterest'
export { WhatsAppAdapter } from './whatsapp'
export { RedditAdapter } from './reddit'
