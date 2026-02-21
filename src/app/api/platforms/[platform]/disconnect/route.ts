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
 * POST /api/platforms/[platform]/disconnect — Clear credentials and disconnect a platform
 *
 * Clears the stored credentials for the given platform and sets its status to 'disconnected'.
 * This does NOT revoke any OAuth tokens on the platform side — it just removes them from our database.
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

    // Check if the platform has stored credentials
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('platform_credentials')
      .select('id, status')
      .eq('platform', platform)
      .single()

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: `No credentials found for ${platform}` },
        { status: 404 }
      )
    }

    if (existing.status === 'disconnected') {
      return NextResponse.json(
        { message: `${platform} is already disconnected` }
      )
    }

    // Clear credentials: null out tokens, empty the extra_config, set status to disconnected
    const { error: updateError } = await supabaseAdmin
      .from('platform_credentials')
      .update({
        access_token: '',
        refresh_token: null,
        token_expires: null,
        extra_config: {},
        status: 'disconnected',
        updated_at: new Date().toISOString(),
      })
      .eq('platform', platform)

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to disconnect platform', details: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: `${platform} disconnected successfully`,
      platform,
      status: 'disconnected',
    })
  } catch (err) {
    console.error('POST /api/platforms/[platform]/disconnect error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
