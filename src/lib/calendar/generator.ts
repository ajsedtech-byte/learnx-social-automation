import { parseAllContent, ParsedPost } from './content-parser';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CalendarPost {
  series: string;
  title: string;
  content: Record<string, string>;  // platform -> adapted text
  media_urls: string[];
  hashtags: string[];
  scheduled_date: string;  // YYYY-MM-DD
  scheduled_time: string;  // HH:MM
  platforms: string[];
  status: 'scheduled' | 'draft';
}

// ---------------------------------------------------------------------------
// Weekly schedule configuration
// ---------------------------------------------------------------------------

/** Day-of-week index (0 = Sunday, 1 = Monday, ..., 6 = Saturday) mapped to
 *  the series type that should be posted on that day. */
interface DaySlot {
  dayOfWeek: number;        // 0-6
  primarySeries: string;    // series to assign
  alternateSeries?: string; // fallback series for Saturday
  time: string;             // HH:MM IST
  platforms: string[];      // target platforms
}

const WEEKLY_SCHEDULE: DaySlot[] = [
  {
    dayOfWeek: 1, // Monday
    primarySeries: 'reel',
    time: '12:00',
    platforms: ['instagram', 'youtube', 'facebook', 'threads'],
  },
  {
    dayOfWeek: 2, // Tuesday
    primarySeries: 'tweet',
    time: '14:00',
    platforms: ['twitter', 'threads', 'telegram', 'reddit'],
  },
  {
    dayOfWeek: 3, // Wednesday
    primarySeries: 'data-drop',
    time: '11:00',
    platforms: ['instagram', 'facebook', 'pinterest', 'telegram', 'threads'],
  },
  {
    dayOfWeek: 4, // Thursday
    primarySeries: 'overheard',
    time: '17:00',
    platforms: ['instagram', 'whatsapp', 'facebook', 'telegram'],
  },
  {
    dayOfWeek: 5, // Friday
    primarySeries: 'engagement',
    time: '13:00',
    platforms: ['instagram', 'facebook', 'twitter', 'threads', 'telegram'],
  },
  {
    dayOfWeek: 6, // Saturday
    primarySeries: 'moment-marketing',
    alternateSeries: 'linkedin',
    time: '10:00',
    platforms: ['instagram', 'facebook', 'twitter', 'linkedin', 'threads', 'telegram', 'whatsapp'],
  },
  {
    dayOfWeek: 0, // Sunday
    primarySeries: 'confession',
    time: '19:00',
    platforms: ['instagram', 'twitter', 'threads', 'telegram'],
  },
];

/** Look up the slot config for a given JS Date day-of-week. */
function getSlotForDay(dayOfWeek: number): DaySlot {
  const slot = WEEKLY_SCHEDULE.find((s) => s.dayOfWeek === dayOfWeek);
  if (!slot) {
    // Should not happen since we cover all 7 days, but fallback to engagement
    return {
      dayOfWeek,
      primarySeries: 'engagement',
      time: '12:00',
      platforms: ['instagram', 'facebook'],
    };
  }
  return slot;
}

// ---------------------------------------------------------------------------
// Platform content adaptation
// ---------------------------------------------------------------------------

/** Truncate text to a max length, appending an ellipsis if needed. */
function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1).trimEnd() + '\u2026';
}

/** Pick the punchiest (shortest non-empty) line from the content. */
function punchiest(text: string): string {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  if (lines.length === 0) return text;
  // Sort by length ascending; take the shortest meaningful line (>10 chars if available)
  const meaningful = lines.filter((l) => l.length >= 10);
  if (meaningful.length > 0) {
    meaningful.sort((a, b) => a.length - b.length);
    return meaningful[0];
  }
  return lines[0];
}

/** Add casual emoji sprinkles to text for Telegram. */
function telegramize(text: string): string {
  const result = text;
  // Add contextual emoji at the start
  const prefixes: Record<string, string> = {
    'data-drop': '\uD83D\uDCCA ',   // bar chart
    'confession': '\uD83D\uDE4A ',   // see-no-evil monkey
    'overheard': '\uD83D\uDC42 ',    // ear
    'engagement': '\uD83D\uDD25 ',   // fire
    'tweet': '\uD83D\uDCAC ',        // speech bubble
    'reel': '\uD83C\uDFAC ',         // clapperboard
    'moment-marketing': '\u26A1 ',    // lightning
    'linkedin': '\uD83D\uDCDD ',     // memo
    'wrapped': '\uD83C\uDF81 ',      // wrapped present
    'whatsapp-card': '\uD83D\uDCF1 ', // mobile phone
    'launch': '\uD83D\uDE80 ',       // rocket
  };
  return (prefixes['data-drop'] || '') + result;  // default emoji
}

/** Make text reflective / professional for LinkedIn. */
function linkedinize(text: string): string {
  // Add line breaks between sentences for the classic LinkedIn one-line-per-thought style
  return text
    .replace(/\. /g, '.\n\n')
    .replace(/\? /g, '?\n\n')
    .replace(/! /g, '!\n\n');
}

/** Format for WhatsApp: short, forwardable. */
function whatsappize(text: string, title: string): string {
  const shortText = truncate(text, 400);
  return `*${title}*\n\n${shortText}\n\n~ LearnX`;
}

/** Format for Reddit: title + self-text. */
function redditize(text: string, title: string): string {
  return `${title}\n\n${text}`;
}

/** Format for Pinterest: short description. */
function pinterestize(text: string): string {
  return truncate(text, 200) + ' | learnx.app';
}

/** Format for YouTube Shorts description. */
function youtubeize(text: string, title: string): string {
  return `${title}\n\n${truncate(text, 300)}\n\n#LearnX #HarBacchaStar`;
}

/** Adapt content for all target platforms. */
function adaptContent(
  post: ParsedPost,
  platforms: string[],
): Record<string, string> {
  const adapted: Record<string, string> = {};
  const baseText = post.content || post.caption || post.title;
  const hashtagStr = post.hashtags.length > 0 ? '\n\n' + post.hashtags.join(' ') : '';

  for (const platform of platforms) {
    switch (platform) {
      case 'twitter': {
        // Truncate to 280 chars, keep the punchiest line
        const tweetText = post.content
          ? punchiest(post.content)
          : baseText;
        adapted.twitter = truncate(tweetText, 280);
        break;
      }

      case 'linkedin': {
        const liText = post.caption || post.content || baseText;
        adapted.linkedin = linkedinize(liText) + hashtagStr;
        break;
      }

      case 'telegram': {
        const tgText = post.content || baseText;
        adapted.telegram = telegramize(truncate(tgText, 500));
        break;
      }

      case 'instagram': {
        // Full caption with hashtags
        const igText = post.caption || post.content || baseText;
        adapted.instagram = igText + hashtagStr;
        break;
      }

      case 'pinterest': {
        adapted.pinterest = pinterestize(post.content || baseText);
        break;
      }

      case 'youtube': {
        adapted.youtube = youtubeize(post.content || baseText, post.title);
        break;
      }

      case 'facebook': {
        // Full text, warm tone
        const fbText = post.caption || post.content || baseText;
        adapted.facebook = fbText + hashtagStr;
        break;
      }

      case 'threads': {
        // Casual, shorter than Instagram
        const thText = post.caption || post.content || baseText;
        adapted.threads = truncate(thText, 400);
        break;
      }

      case 'reddit': {
        adapted.reddit = redditize(post.content || baseText, post.title);
        break;
      }

      case 'whatsapp': {
        adapted.whatsapp = whatsappize(post.content || baseText, post.title);
        break;
      }

      default: {
        adapted[platform] = truncate(baseText, 500);
        break;
      }
    }
  }

  return adapted;
}

// ---------------------------------------------------------------------------
// Calendar generation
// ---------------------------------------------------------------------------

/** Format a Date as YYYY-MM-DD. */
function formatDate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/** Create a draft/template CalendarPost for a day that has no assigned
 *  existing content. */
function createDraftPost(
  date: Date,
  slot: DaySlot,
  weekNumber: number,
): CalendarPost {
  const dateStr = formatDate(date);
  const seriesLabel = slot.primarySeries;
  const displayName = seriesLabel
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const draftContent: Record<string, string> = {};
  for (const platform of slot.platforms) {
    draftContent[platform] = `[DRAFT] ${displayName} — Week ${weekNumber} — ${dateStr}. Content to be created.`;
  }

  return {
    series: seriesLabel,
    title: `${displayName} — Week ${weekNumber} [Draft]`,
    content: draftContent,
    media_urls: [],
    hashtags: ['#LearnX', '#HarBacchaStar'],
    scheduled_date: dateStr,
    scheduled_time: slot.time,
    platforms: slot.platforms,
    status: 'draft',
  };
}

/** Convert a parsed post into a CalendarPost for a specific date/slot. */
function createScheduledPost(
  parsedPost: ParsedPost,
  date: Date,
  slot: DaySlot,
): CalendarPost {
  const platforms = slot.platforms;
  const adaptedContent = adaptContent(parsedPost, platforms);

  return {
    series: parsedPost.series,
    title: parsedPost.title,
    content: adaptedContent,
    media_urls: [],  // To be filled in by media pipeline
    hashtags: parsedPost.hashtags.length > 0
      ? parsedPost.hashtags
      : ['#LearnX', '#HarBacchaStar'],
    scheduled_date: formatDate(date),
    scheduled_time: slot.time,
    platforms,
    status: 'scheduled',
  };
}

/**
 * Generate a full 365-day content calendar.
 *
 * @param startDate - ISO date string (YYYY-MM-DD) for day 1 of the calendar
 * @returns Array of 365 CalendarPost objects, one per day, ready for
 *          Supabase insertion.
 */
export function generateCalendar(startDate: string): CalendarPost[] {
  // Parse existing content synchronously by waiting on the promise
  // Since this runs server-side in a build/script context we use a sync wrapper
  // pattern. For async callers, use generateCalendarAsync() instead.
  const parsedPosts: ParsedPost[] = [];
  // We'll fill this in generateCalendarAsync; for the sync entry point,
  // callers should use generateCalendarAsync. This sync version uses an empty pool.
  // We provide it for interface compliance, but the real work is in the async version.

  return buildCalendar(startDate, parsedPosts);
}

/**
 * Async version that actually parses the markdown content first.
 */
export async function generateCalendarAsync(startDate: string): Promise<CalendarPost[]> {
  const parsedPosts = await parseAllContent();
  return buildCalendar(startDate, parsedPosts);
}

/** Core calendar-building logic. */
function buildCalendar(startDate: string, parsedPosts: ParsedPost[]): CalendarPost[] {
  const calendar: CalendarPost[] = [];
  const start = new Date(startDate + 'T00:00:00');

  // Group parsed posts by series for easy lookup
  const postPool: Record<string, ParsedPost[]> = {};
  for (const post of parsedPosts) {
    if (!postPool[post.series]) {
      postPool[post.series] = [];
    }
    postPool[post.series].push(post);
  }

  // Track how many posts we've consumed from each series pool
  const poolIndex: Record<string, number> = {};

  /** Pull the next available post from a series pool, or return null. */
  function pullFromPool(series: string): ParsedPost | null {
    const pool = postPool[series];
    if (!pool || pool.length === 0) return null;
    const idx = poolIndex[series] || 0;
    if (idx >= pool.length) return null;
    poolIndex[series] = idx + 1;
    return pool[idx];
  }

  // Generate 365 days
  for (let dayOffset = 0; dayOffset < 365; dayOffset++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + dayOffset);

    const dayOfWeek = currentDate.getDay(); // 0 = Sunday
    const weekNumber = Math.floor(dayOffset / 7) + 1;
    const slot = getSlotForDay(dayOfWeek);

    // Try to pull from the primary series first
    let parsedPost = pullFromPool(slot.primarySeries);

    // For Saturday, alternate between moment-marketing and linkedin
    if (!parsedPost && slot.alternateSeries) {
      parsedPost = pullFromPool(slot.alternateSeries);
    }

    // Also try related series for certain days:
    // - Saturday can also use 'wrapped', 'launch', 'whatsapp-card'
    if (!parsedPost && dayOfWeek === 6) {
      parsedPost =
        pullFromPool('wrapped') ||
        pullFromPool('launch') ||
        pullFromPool('whatsapp-card');
    }

    if (parsedPost) {
      calendar.push(createScheduledPost(parsedPost, currentDate, slot));
    } else {
      calendar.push(createDraftPost(currentDate, slot, weekNumber));
    }
  }

  return calendar;
}

// ---------------------------------------------------------------------------
// Standalone runner
// ---------------------------------------------------------------------------
if (require.main === module) {
  generateCalendarAsync('2026-03-01').then((calendar) => {
    const scheduled = calendar.filter((p) => p.status === 'scheduled').length;
    const draft = calendar.filter((p) => p.status === 'draft').length;

    console.log(`Calendar generated: ${calendar.length} days`);
    console.log(`  Scheduled (from existing content): ${scheduled}`);
    console.log(`  Draft (placeholders): ${draft}`);

    // Show first 14 days as a sample
    console.log('\n=== First 14 days ===\n');
    for (const post of calendar.slice(0, 14)) {
      const dayName = new Date(post.scheduled_date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'short',
      });
      console.log(
        `${post.scheduled_date} (${dayName}) ${post.scheduled_time} | ` +
        `[${post.status.toUpperCase()}] ${post.series} — ${post.title.slice(0, 60)}`
      );
      console.log(`  Platforms: ${post.platforms.join(', ')}`);
      console.log(`  Hashtags: ${post.hashtags.slice(0, 4).join(' ')}`);
      console.log('');
    }

    // Series distribution
    const bySeries: Record<string, { scheduled: number; draft: number }> = {};
    for (const post of calendar) {
      if (!bySeries[post.series]) bySeries[post.series] = { scheduled: 0, draft: 0 };
      bySeries[post.series][post.status]++;
    }
    console.log('\n=== Series distribution ===\n');
    for (const [series, counts] of Object.entries(bySeries)) {
      console.log(`  ${series}: ${counts.scheduled} scheduled, ${counts.draft} draft`);
    }
  });
}
