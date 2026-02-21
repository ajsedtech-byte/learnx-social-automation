import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, Post } from '@/lib/supabase'
import { getAdapter } from '@/lib/platforms'
import { PublishResult } from '@/lib/platforms/types'

interface RouteContext {
  params: { id: string }
}

/**
 * POST /api/posts/[id]/publish — Manually publish a single post immediately
 *
 * This endpoint:
 * 1. Fetches the post by ID
 * 2. Sets status to 'publishing'
 * 3. Publishes to each platform in post.platforms
 * 4. Logs results to publish_log table
 * 5. Updates post status to 'posted' (all success) or 'failed' (any failure)
 */
export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = params

    // 1. Fetch the post
    const { data: post, error: fetchError } = await supabaseAdmin
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const typedPost = post as Post

    // Prevent re-publishing already published posts
    if (typedPost.status === 'publishing') {
      return NextResponse.json(
        { error: 'Post is already being published' },
        { status: 409 }
      )
    }

    if (typedPost.status === 'posted') {
      return NextResponse.json(
        { error: 'Post has already been published' },
        { status: 409 }
      )
    }

    // 2. Set status to 'publishing'
    await supabaseAdmin
      .from('posts')
      .update({ status: 'publishing', updated_at: new Date().toISOString() })
      .eq('id', id)

    // 3. Publish to each platform
    const results: Record<string, PublishResult> = {}
    const platformPostIds: Record<string, string> = { ...typedPost.platform_post_ids }
    const errorLog: Record<string, string> = {}
    let allSucceeded = true

    for (const platform of typedPost.platforms) {
      try {
        const adapter = await getAdapter(platform)

        // Determine content for this platform
        const platformContent = typedPost.content[platform] || typedPost.title

        // Determine publish method based on media
        let result: PublishResult

        if (typedPost.media_urls.length > 0) {
          const mediaUrl = typedPost.media_urls[0]
          const isVideo = /\.(mp4|mov|avi|webm)$/i.test(mediaUrl)

          if (isVideo) {
            result = await adapter.publishVideo(platformContent, mediaUrl)
          } else {
            result = await adapter.publishImage(platformContent, mediaUrl)
          }
        } else {
          result = await adapter.publishText(platformContent)
        }

        results[platform] = result

        // 4. Log to publish_log
        await supabaseAdmin.from('publish_log').insert({
          post_id: id,
          platform,
          status: result.success ? 'success' : 'failed',
          platform_post_id: result.postId || null,
          error_message: result.error || null,
          published_at: new Date().toISOString(),
        })

        if (result.success && result.postId) {
          platformPostIds[platform] = result.postId
        } else if (!result.success) {
          allSucceeded = false
          errorLog[platform] = result.error || 'Unknown error'
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err)
        allSucceeded = false
        results[platform] = { success: false, error: errorMessage }
        errorLog[platform] = errorMessage

        // Log the failure
        await supabaseAdmin.from('publish_log').insert({
          post_id: id,
          platform,
          status: 'failed',
          platform_post_id: null,
          error_message: errorMessage,
          published_at: new Date().toISOString(),
        })
      }
    }

    // 5. Update post status based on results
    const finalStatus = allSucceeded ? 'posted' : 'failed'
    const updateData: Record<string, unknown> = {
      status: finalStatus,
      platform_post_ids: platformPostIds,
      updated_at: new Date().toISOString(),
    }

    if (!allSucceeded) {
      updateData.error_log = errorLog
      updateData.retry_count = (typedPost.retry_count || 0) + 1
    }

    await supabaseAdmin
      .from('posts')
      .update(updateData)
      .eq('id', id)

    return NextResponse.json({
      post_id: id,
      status: finalStatus,
      results,
      platform_post_ids: platformPostIds,
      errors: Object.keys(errorLog).length > 0 ? errorLog : null,
    })
  } catch (err) {
    console.error('POST /api/posts/[id]/publish error:', err)

    // Attempt to reset the post status on unexpected errors
    try {
      await supabaseAdmin
        .from('posts')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('id', params.id)
    } catch {
      // Ignore cleanup errors
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
