import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, PostStatus, PlatformName, SeriesName } from '@/lib/supabase'

/**
 * GET /api/posts — List posts with filtering and pagination
 *
 * Query params:
 *   status       — filter by post status (draft, scheduled, posted, failed, publishing)
 *   series       — filter by series name
 *   date_from    — filter scheduled_date >= date_from (YYYY-MM-DD)
 *   date_to      — filter scheduled_date <= date_to (YYYY-MM-DD)
 *   platform     — filter posts that include this platform
 *   limit        — page size (default 50, max 200)
 *   offset       — pagination offset (default 0)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const status = searchParams.get('status') as PostStatus | null
    const series = searchParams.get('series') as SeriesName | null
    const dateFrom = searchParams.get('date_from')
    const dateTo = searchParams.get('date_to')
    const platform = searchParams.get('platform') as PlatformName | null
    const limit = Math.min(Number(searchParams.get('limit')) || 50, 200)
    const offset = Number(searchParams.get('offset')) || 0

    let query = supabaseAdmin
      .from('posts')
      .select('*', { count: 'exact' })
      .order('scheduled_date', { ascending: true })
      .order('scheduled_time', { ascending: true })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    if (series) {
      query = query.eq('series', series)
    }

    if (dateFrom) {
      query = query.gte('scheduled_date', dateFrom)
    }

    if (dateTo) {
      query = query.lte('scheduled_date', dateTo)
    }

    if (platform) {
      query = query.contains('platforms', [platform])
    }

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch posts', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      posts: data,
      total: count,
      limit,
      offset,
    })
  } catch (err) {
    console.error('GET /api/posts error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/posts — Create a new post
 *
 * Body: {
 *   series: SeriesName
 *   title: string
 *   content: Record<PlatformName, string>
 *   media_urls?: string[]
 *   hashtags?: string[]
 *   scheduled_date: string (YYYY-MM-DD)
 *   scheduled_time: string (HH:MM)
 *   platforms: PlatformName[]
 *   status?: PostStatus (defaults to 'scheduled')
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      series,
      title,
      content,
      media_urls = [],
      hashtags = [],
      scheduled_date,
      scheduled_time,
      platforms,
      status = 'scheduled',
    } = body

    // Validate required fields
    if (!series || !title || !content || !scheduled_date || !scheduled_time || !platforms) {
      return NextResponse.json(
        { error: 'Missing required fields: series, title, content, scheduled_date, scheduled_time, platforms' },
        { status: 400 }
      )
    }

    if (!Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json(
        { error: 'platforms must be a non-empty array' },
        { status: 400 }
      )
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(scheduled_date)) {
      return NextResponse.json(
        { error: 'scheduled_date must be in YYYY-MM-DD format' },
        { status: 400 }
      )
    }

    // Validate time format
    if (!/^\d{2}:\d{2}$/.test(scheduled_time)) {
      return NextResponse.json(
        { error: 'scheduled_time must be in HH:MM format' },
        { status: 400 }
      )
    }

    const newPost = {
      series,
      title,
      content,
      media_urls,
      hashtags,
      scheduled_date,
      scheduled_time,
      platforms,
      status,
      platform_post_ids: {},
      error_log: null,
      retry_count: 0,
    }

    const { data, error } = await supabaseAdmin
      .from('posts')
      .insert(newPost)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create post', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ post: data }, { status: 201 })
  } catch (err) {
    console.error('POST /api/posts error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
