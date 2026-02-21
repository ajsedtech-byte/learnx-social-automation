import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import { getAdapter } from '@/lib/platforms'
import { PublishResult } from '@/lib/platforms/types'

interface CalendarPost {
  series: string
  title: string
  content: Record<string, string>
  media_urls: string[]
  hashtags: string[]
  scheduled_date: string
  scheduled_time: string
  platforms: string[]
  status: 'scheduled' | 'draft'
}

/**
 * POST /api/cron/publish — Daily cron job (runs once per day via Vercel Cron)
 *
 * Reads today's post from the static calendar.json, publishes to all platforms.
 * No database needed — content is baked into the deployment.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Verify Vercel Cron authorization
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret) {
      return NextResponse.json({ error: 'CRON_SECRET not set' }, { status: 500 })
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Get today's date in IST (UTC+5:30)
    const now = new Date()
    const istOffset = 5.5 * 60 * 60 * 1000
    const istNow = new Date(now.getTime() + istOffset)
    const todayIST = istNow.toISOString().split('T')[0]

    console.log(`[CRON] Running for IST date: ${todayIST}`)

    // 3. Read the calendar JSON
    let calendar: CalendarPost[]
    try {
      const calendarPath = join(process.cwd(), 'public', 'data', 'calendar.json')
      const raw = readFileSync(calendarPath, 'utf-8')
      calendar = JSON.parse(raw)
    } catch {
      return NextResponse.json({ error: 'calendar.json not found' }, { status: 500 })
    }

    // 4. Find today's post
    const todaysPost = calendar.find(p => p.scheduled_date === todayIST && p.status === 'scheduled')

    if (!todaysPost) {
      console.log(`[CRON] No scheduled post for ${todayIST}`)
      return NextResponse.json({
        date: todayIST,
        message: 'No scheduled post for today',
        published: 0,
      })
    }

    console.log(`[CRON] Publishing: "${todaysPost.title}" (${todaysPost.series}) to ${todaysPost.platforms.length} platforms`)

    // 5. Publish to each platform
    const results: Record<string, string> = {}
    let successCount = 0

    for (const platform of todaysPost.platforms) {
      try {
        const adapter = await getAdapter(platform as Parameters<typeof getAdapter>[0])
        const content = todaysPost.content[platform] || todaysPost.title
        let result: PublishResult

        if (todaysPost.media_urls && todaysPost.media_urls.length > 0) {
          const mediaUrl = todaysPost.media_urls[0]
          const isVideo = /\.(mp4|mov|avi|webm)$/i.test(mediaUrl)
          result = isVideo
            ? await adapter.publishVideo(content, mediaUrl)
            : await adapter.publishImage(content, mediaUrl)
        } else {
          result = await adapter.publishText(content)
        }

        if (result.success) {
          results[platform] = `success (${result.postId || 'ok'})`
          successCount++
        } else {
          results[platform] = `failed: ${result.error}`
        }
      } catch (err) {
        results[platform] = `error: ${err instanceof Error ? err.message : String(err)}`
      }
    }

    const summary = {
      date: todayIST,
      title: todaysPost.title,
      series: todaysPost.series,
      platforms: results,
      published: successCount,
      total: todaysPost.platforms.length,
    }

    console.log('[CRON] Done:', JSON.stringify(summary, null, 2))
    return NextResponse.json(summary)
  } catch (err) {
    console.error('[CRON] Fatal error:', err)
    return NextResponse.json(
      { error: 'Cron job failed', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}

/** GET handler for health check */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    description: 'LearnX daily publish cron — reads from calendar.json',
    schedule: 'Daily at 9:30 AM IST (4:00 UTC)',
  })
}
