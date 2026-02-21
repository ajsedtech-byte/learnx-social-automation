import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/calendar/generate — Trigger calendar generation
 *
 * This is a long-running operation that generates 365 days of social media content.
 * It calls the calendar generator and inserts all posts into Supabase.
 *
 * Body: { start_date?: "YYYY-MM-DD" }
 *   - start_date defaults to tomorrow if not provided
 *
 * Returns: { message, count, start_date, end_date }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))

    // Determine start date (default to tomorrow in IST)
    let startDate: string

    if (body.start_date) {
      // Validate provided date format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(body.start_date)) {
        return NextResponse.json(
          { error: 'start_date must be in YYYY-MM-DD format' },
          { status: 400 }
        )
      }
      startDate = body.start_date
    } else {
      // Default to tomorrow in IST
      const now = new Date()
      const istOffset = 5.5 * 60 * 60 * 1000
      const istNow = new Date(now.getTime() + istOffset)
      const tomorrow = new Date(istNow.getTime() + 24 * 60 * 60 * 1000)
      startDate = tomorrow.toISOString().split('T')[0]
    }

    // Calculate end date (365 days from start)
    const startObj = new Date(startDate + 'T00:00:00Z')
    const endObj = new Date(startObj.getTime() + 364 * 24 * 60 * 60 * 1000)
    const endDate = endObj.toISOString().split('T')[0]

    console.log(`[CALENDAR] Generating content from ${startDate} to ${endDate}`)

    // Import and call the calendar generator
    // This is dynamically imported to avoid loading it on every API route initialization
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let generateCalendar: (startDate: string) => Promise<any[]>

    try {
      const calendarModule = await import('@/lib/calendar/generator')
      generateCalendar = calendarModule.generateCalendarAsync
    } catch (importErr) {
      console.error('[CALENDAR] Failed to import calendar generator:', importErr)
      return NextResponse.json(
        { error: 'Calendar generator module not found at @/lib/calendar/generator. Please ensure it exists and exports a generateCalendar function.' },
        { status: 500 }
      )
    }

    // Generate all posts (this is the long-running part)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let generatedPosts: any[]
    try {
      generatedPosts = await generateCalendar(startDate)
    } catch (genErr) {
      console.error('[CALENDAR] Generation failed:', genErr)
      return NextResponse.json(
        { error: 'Calendar generation failed', details: genErr instanceof Error ? genErr.message : String(genErr) },
        { status: 500 }
      )
    }

    if (!generatedPosts || generatedPosts.length === 0) {
      return NextResponse.json(
        { message: 'No posts were generated', count: 0, start_date: startDate, end_date: endDate },
        { status: 200 }
      )
    }

    console.log(`[CALENDAR] Generated ${generatedPosts.length} posts, inserting into Supabase...`)

    // Insert posts in batches of 100 to avoid hitting Supabase limits
    const BATCH_SIZE = 100
    let insertedCount = 0
    const errors: string[] = []

    for (let i = 0; i < generatedPosts.length; i += BATCH_SIZE) {
      const batch = generatedPosts.slice(i, i + BATCH_SIZE)

      // Ensure each post has the required default fields
      const postsToInsert = batch.map((post) => ({
        series: post.series,
        title: post.title,
        content: post.content || {},
        media_urls: post.media_urls || [],
        hashtags: post.hashtags || [],
        scheduled_date: post.scheduled_date,
        scheduled_time: post.scheduled_time || '10:00',
        platforms: post.platforms || [],
        status: post.status || 'scheduled',
        platform_post_ids: {},
        error_log: null,
        retry_count: 0,
      }))

      const { data, error } = await supabaseAdmin
        .from('posts')
        .insert(postsToInsert)
        .select('id')

      if (error) {
        console.error(`[CALENDAR] Batch ${Math.floor(i / BATCH_SIZE) + 1} insert error:`, error.message)
        errors.push(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${error.message}`)
      } else {
        insertedCount += data?.length || 0
      }
    }

    console.log(`[CALENDAR] Inserted ${insertedCount} posts (${errors.length} batch errors)`)

    const response: Record<string, unknown> = {
      message: `Calendar generated successfully`,
      count: insertedCount,
      total_generated: generatedPosts.length,
      start_date: startDate,
      end_date: endDate,
    }

    if (errors.length > 0) {
      response.warnings = errors
    }

    return NextResponse.json(response, { status: 201 })
  } catch (err) {
    console.error('[CALENDAR] Fatal error:', err)
    return NextResponse.json(
      { error: 'Internal server error', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
