import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _supabase: SupabaseClient | null = null
let _supabaseAdmin: SupabaseClient | null = null

function getSupabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
  return url
}

function getSupabaseAnonKey() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set')
  return key
}

// Client-side Supabase (for dashboard reads) — lazy initialized
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    if (!_supabase) _supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey())
    return (_supabase as unknown as Record<string, unknown>)[prop as string]
  },
})

// Server-side Supabase with service role (for cron jobs, writes) — lazy initialized
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    if (!_supabaseAdmin) {
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
      _supabaseAdmin = createClient(
        getSupabaseUrl(),
        serviceKey || getSupabaseAnonKey(),
        { auth: { autoRefreshToken: false, persistSession: false } }
      )
    }
    return (_supabaseAdmin as unknown as Record<string, unknown>)[prop as string]
  },
})

// ── Types ──────────────────────────────────────────

export type PostStatus = 'draft' | 'scheduled' | 'publishing' | 'posted' | 'failed'

export type PlatformName =
  | 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'threads'
  | 'telegram' | 'youtube' | 'pinterest' | 'whatsapp' | 'reddit'

export type SeriesName =
  | 'data-drop' | 'confession' | 'overheard' | 'engagement'
  | 'wrapped' | 'moment-marketing' | 'tweet' | 'reel'
  | 'linkedin' | 'launch' | 'whatsapp-card'

export interface Post {
  id: string
  series: SeriesName
  title: string
  content: Record<PlatformName, string>  // platform-specific content
  media_urls: string[]
  hashtags: string[]
  scheduled_date: string   // YYYY-MM-DD
  scheduled_time: string   // HH:MM (IST)
  platforms: PlatformName[]
  status: PostStatus
  platform_post_ids: Record<string, string>
  error_log: Record<string, string> | null
  retry_count: number
  created_at: string
  updated_at: string
}

export interface PlatformCredential {
  id: string
  platform: PlatformName
  access_token: string
  refresh_token: string | null
  token_expires: string | null
  extra_config: Record<string, string>  // page_id, channel_id, etc.
  status: 'connected' | 'disconnected' | 'expired'
  updated_at: string
}

export interface PublishLog {
  id: string
  post_id: string
  platform: PlatformName
  status: 'success' | 'failed'
  platform_post_id: string | null
  error_message: string | null
  published_at: string
}
