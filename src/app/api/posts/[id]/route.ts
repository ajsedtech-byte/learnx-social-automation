import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

interface RouteContext {
  params: { id: string }
}

/**
 * GET /api/posts/[id] — Get a single post by ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = params

    const { data, error } = await supabaseAdmin
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to fetch post', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ post: data })
  } catch (err) {
    console.error('GET /api/posts/[id] error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/posts/[id] — Update a post
 *
 * Body can contain any subset of post fields:
 * { title, content, media_urls, hashtags, scheduled_date, scheduled_time, platforms, status, series }
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = params
    const body = await request.json()

    // Only allow updating specific fields
    const allowedFields = [
      'series', 'title', 'content', 'media_urls', 'hashtags',
      'scheduled_date', 'scheduled_time', 'platforms', 'status',
      'platform_post_ids', 'error_log', 'retry_count',
    ]

    const updates: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field]
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields provided for update' },
        { status: 400 }
      )
    }

    // Add updated_at timestamp
    updates.updated_at = new Date().toISOString()

    const { data, error } = await supabaseAdmin
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to update post', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ post: data })
  } catch (err) {
    console.error('PUT /api/posts/[id] error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/posts/[id] — Delete a post
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = params

    // First check if post exists
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('posts')
      .select('id, status')
      .eq('id', id)
      .single()

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Prevent deleting posts that are currently being published
    if (existing.status === 'publishing') {
      return NextResponse.json(
        { error: 'Cannot delete a post that is currently being published' },
        { status: 409 }
      )
    }

    // Delete related publish_log entries first
    await supabaseAdmin
      .from('publish_log')
      .delete()
      .eq('post_id', id)

    // Delete the post
    const { error } = await supabaseAdmin
      .from('posts')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete post', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (err) {
    console.error('DELETE /api/posts/[id] error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
