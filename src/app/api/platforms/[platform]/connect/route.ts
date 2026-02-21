import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, PlatformName } from '@/lib/supabase'

/**
 * Valid platform names for validation
 */
const VALID_PLATFORMS: PlatformName[] = [
  'instagram', 'facebook', 'twitter', 'linkedin', 'threads',
  'telegram', 'youtube', 'pinterest', 'whatsapp', 'reddit',
]

interface RouteContext {
  params: { platform: string }
}

/**
 * POST /api/platforms/[platform]/connect — Store credentials for a platform
 *
 * Body varies by platform:
 *   Telegram:   { bot_token, channel_id }
 *   Twitter:    { api_key, api_secret, access_token, access_token_secret }
 *   Meta:       { access_token, ...extra_config } (Instagram, Facebook, Threads, WhatsApp)
 *   LinkedIn:   { access_token, refresh_token, person_urn }
 *   YouTube:    { access_token, refresh_token, channel_id }
 *   Pinterest:  { access_token, refresh_token, board_id }
 *   Reddit:     { client_id, client_secret, username, password, subreddit }
 */
export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { platform } = params

    // Validate platform name
    if (!VALID_PLATFORMS.includes(platform as PlatformName)) {
      return NextResponse.json(
        { error: `Invalid platform: ${platform}. Valid platforms: ${VALID_PLATFORMS.join(', ')}` },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Build credential record based on platform type
    let accessToken: string = ''
    let refreshToken: string | null = null
    let tokenExpires: string | null = null
    let extraConfig: Record<string, string> = {}

    switch (platform as PlatformName) {
      case 'telegram': {
        const { bot_token, channel_id } = body
        if (!bot_token || !channel_id) {
          return NextResponse.json(
            { error: 'Telegram requires: bot_token, channel_id' },
            { status: 400 }
          )
        }
        // For Telegram, the access_token is a placeholder since auth is via bot_token
        accessToken = bot_token
        extraConfig = { bot_token, channel_id }
        break
      }

      case 'twitter': {
        const { api_key, api_secret, access_token: at, access_token_secret } = body
        if (!api_key || !api_secret || !at || !access_token_secret) {
          return NextResponse.json(
            { error: 'Twitter requires: api_key, api_secret, access_token, access_token_secret' },
            { status: 400 }
          )
        }
        accessToken = at
        extraConfig = { api_key, api_secret, access_token: at, access_token_secret }
        break
      }

      case 'instagram': {
        const { access_token: at, instagram_business_id, facebook_page_id, token_expires: te } = body
        if (!at) {
          return NextResponse.json(
            { error: 'Instagram requires: access_token. Optional: instagram_business_id, facebook_page_id' },
            { status: 400 }
          )
        }
        accessToken = at
        if (te) tokenExpires = te
        extraConfig = {}
        if (instagram_business_id) extraConfig.instagram_business_id = instagram_business_id
        if (facebook_page_id) extraConfig.facebook_page_id = facebook_page_id
        break
      }

      case 'facebook': {
        const { access_token: at, page_id, page_access_token, token_expires: te } = body
        if (!at) {
          return NextResponse.json(
            { error: 'Facebook requires: access_token. Optional: page_id, page_access_token' },
            { status: 400 }
          )
        }
        accessToken = at
        if (te) tokenExpires = te
        extraConfig = {}
        if (page_id) extraConfig.page_id = page_id
        if (page_access_token) extraConfig.page_access_token = page_access_token
        break
      }

      case 'threads': {
        const { access_token: at, threads_user_id, token_expires: te } = body
        if (!at) {
          return NextResponse.json(
            { error: 'Threads requires: access_token. Optional: threads_user_id' },
            { status: 400 }
          )
        }
        accessToken = at
        if (te) tokenExpires = te
        extraConfig = {}
        if (threads_user_id) extraConfig.threads_user_id = threads_user_id
        break
      }

      case 'linkedin': {
        const { access_token: at, refresh_token: rt, person_urn, token_expires: te } = body
        if (!at) {
          return NextResponse.json(
            { error: 'LinkedIn requires: access_token. Optional: refresh_token, person_urn' },
            { status: 400 }
          )
        }
        accessToken = at
        refreshToken = rt || null
        if (te) tokenExpires = te
        extraConfig = {}
        if (person_urn) extraConfig.person_urn = person_urn
        break
      }

      case 'youtube': {
        const { access_token: at, refresh_token: rt, channel_id, token_expires: te } = body
        if (!at) {
          return NextResponse.json(
            { error: 'YouTube requires: access_token. Optional: refresh_token, channel_id' },
            { status: 400 }
          )
        }
        accessToken = at
        refreshToken = rt || null
        if (te) tokenExpires = te
        extraConfig = {}
        if (channel_id) extraConfig.channel_id = channel_id
        break
      }

      case 'pinterest': {
        const { access_token: at, refresh_token: rt, board_id, token_expires: te } = body
        if (!at) {
          return NextResponse.json(
            { error: 'Pinterest requires: access_token. Optional: refresh_token, board_id' },
            { status: 400 }
          )
        }
        accessToken = at
        refreshToken = rt || null
        if (te) tokenExpires = te
        extraConfig = {}
        if (board_id) extraConfig.board_id = board_id
        break
      }

      case 'whatsapp': {
        const { access_token: at, phone_number_id, waba_id, token_expires: te } = body
        if (!at) {
          return NextResponse.json(
            { error: 'WhatsApp requires: access_token. Optional: phone_number_id, waba_id' },
            { status: 400 }
          )
        }
        accessToken = at
        if (te) tokenExpires = te
        extraConfig = {}
        if (phone_number_id) extraConfig.phone_number_id = phone_number_id
        if (waba_id) extraConfig.waba_id = waba_id
        break
      }

      case 'reddit': {
        const { client_id, client_secret, username, password, subreddit } = body
        if (!client_id || !client_secret || !username || !password || !subreddit) {
          return NextResponse.json(
            { error: 'Reddit requires: client_id, client_secret, username, password, subreddit' },
            { status: 400 }
          )
        }
        // For Reddit, we use a placeholder access_token since auth uses client credentials
        accessToken = `${client_id}:${client_secret}`
        extraConfig = { client_id, client_secret, username, password, subreddit }
        break
      }
    }

    // Upsert into platform_credentials table
    // First check if a record already exists for this platform
    const { data: existing } = await supabaseAdmin
      .from('platform_credentials')
      .select('id')
      .eq('platform', platform)
      .single()

    const credentialData = {
      platform,
      access_token: accessToken,
      refresh_token: refreshToken,
      token_expires: tokenExpires,
      extra_config: extraConfig,
      status: 'connected' as const,
      updated_at: new Date().toISOString(),
    }

    let result
    if (existing) {
      // Update existing record
      const { data, error } = await supabaseAdmin
        .from('platform_credentials')
        .update(credentialData)
        .eq('platform', platform)
        .select()
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Failed to update credentials', details: error.message },
          { status: 500 }
        )
      }
      result = data
    } else {
      // Insert new record
      const { data, error } = await supabaseAdmin
        .from('platform_credentials')
        .insert(credentialData)
        .select()
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Failed to store credentials', details: error.message },
          { status: 500 }
        )
      }
      result = data
    }

    return NextResponse.json({
      message: `${platform} connected successfully`,
      platform: result.platform,
      status: result.status,
      updated_at: result.updated_at,
    })
  } catch (err) {
    console.error('POST /api/platforms/[platform]/connect error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
