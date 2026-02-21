import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, PlatformName } from '@/lib/supabase'

/**
 * All 10 platform names in the system
 */
const ALL_PLATFORMS: PlatformName[] = [
  'instagram', 'facebook', 'twitter', 'linkedin', 'threads',
  'telegram', 'youtube', 'pinterest', 'whatsapp', 'reddit',
]

/**
 * Mask a token string — only show last 4 characters
 * Returns '****XXXX' or '(not set)' if empty
 */
function maskToken(token: string | null): string {
  if (!token || token.length === 0) return '(not set)'
  if (token.length <= 4) return '****'
  return '****' + token.slice(-4)
}

/**
 * GET /api/platforms — Return all 10 platform credentials with masked tokens
 *
 * Returns a list of all platforms with their connection status.
 * Tokens are masked for security — only the last 4 characters are shown.
 */
export async function GET(_request: NextRequest) {
  try {
    // Fetch all stored credentials
    const { data: credentials, error } = await supabaseAdmin
      .from('platform_credentials')
      .select('*')
      .order('platform', { ascending: true })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch platform credentials', details: error.message },
        { status: 500 }
      )
    }

    // Build a map of stored credentials by platform
    const credMap = new Map<string, typeof credentials[0]>()
    if (credentials) {
      for (const cred of credentials) {
        credMap.set(cred.platform, cred)
      }
    }

    // Build the full list of all 10 platforms, including unconfigured ones
    const platforms = ALL_PLATFORMS.map((platform) => {
      const cred = credMap.get(platform)

      if (!cred) {
        return {
          platform,
          status: 'disconnected' as const,
          access_token: '(not set)',
          refresh_token: '(not set)',
          token_expires: null,
          extra_config: {},
          updated_at: null,
        }
      }

      // Mask tokens in extra_config too (anything containing 'token', 'secret', 'password')
      const maskedConfig: Record<string, string> = {}
      if (cred.extra_config && typeof cred.extra_config === 'object') {
        for (const [key, value] of Object.entries(cred.extra_config as Record<string, string>)) {
          const isSensitive = /token|secret|password|key/i.test(key)
          maskedConfig[key] = isSensitive ? maskToken(value) : value
        }
      }

      return {
        platform,
        status: cred.status,
        access_token: maskToken(cred.access_token),
        refresh_token: maskToken(cred.refresh_token),
        token_expires: cred.token_expires,
        extra_config: maskedConfig,
        updated_at: cred.updated_at,
      }
    })

    return NextResponse.json({ platforms })
  } catch (err) {
    console.error('GET /api/platforms error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
