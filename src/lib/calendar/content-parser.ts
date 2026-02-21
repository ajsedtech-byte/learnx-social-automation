import * as fs from 'fs';
import * as path from 'path';

export interface ParsedPost {
  series: string;           // 'data-drop', 'confession', 'overheard', 'engagement', 'wrapped', 'moment-marketing', 'tweet', 'reel', 'linkedin', 'launch', 'whatsapp-card'
  title: string;            // "Data Drop #1", "Confession #1", etc.
  content: string;          // The main creative copy
  caption: string;          // Instagram/social caption if provided
  hashtags: string[];       // Extracted hashtags
  platforms: string[];      // Suggested platforms from the file
  mediaType: 'text' | 'image' | 'video' | 'carousel';  // What type of media this needs
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Split a markdown file into blocks delimited by ### headers. Returns an
 *  array of { title, body } where title is the ### line content and body is
 *  everything until the next ### (or end of file). */
function splitByH3(markdown: string): { title: string; body: string }[] {
  const blocks: { title: string; body: string }[] = [];
  // Split on lines that start with "### " (exactly three hashes + space)
  const parts = markdown.split(/^### /m);
  // First part is everything before the first ###, skip it
  for (let i = 1; i < parts.length; i++) {
    const raw = parts[i];
    const newlineIdx = raw.indexOf('\n');
    const title = newlineIdx === -1 ? raw.trim() : raw.slice(0, newlineIdx).trim();
    const body = newlineIdx === -1 ? '' : raw.slice(newlineIdx + 1).trim();
    blocks.push({ title, body });
  }
  return blocks;
}

/** Extract all hashtags (#Xyz) from a string. */
function extractHashtags(text: string): string[] {
  const matches = text.match(/#[A-Za-z0-9_]+/g);
  return matches ? Array.from(new Set(matches)) : [];
}

/** Pull the value after a bolded label like **Platform:** or **Caption:** */
function extractField(body: string, label: string): string {
  // Match **Label:** followed by content (possibly multi-line) until the next **Label:** or --- or end
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(
    `\\*\\*${escapedLabel}:\\*\\*\\s*([\\s\\S]*?)(?=\\n\\*\\*[A-Za-z][^*]*:\\*\\*|\\n---|$)`,
    'i'
  );
  const match = body.match(regex);
  return match ? match[1].trim() : '';
}

/** Extract platform list from a platform string like "Instagram + Twitter + WhatsApp forward" */
function parsePlatforms(platformStr: string): string[] {
  if (!platformStr) return [];
  return platformStr
    .split(/[+,]/)
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean)
    .map((p) => {
      // Normalize platform names
      if (p.includes('instagram')) return 'instagram';
      if (p.includes('twitter') || p.includes('x')) return 'twitter';
      if (p.includes('whatsapp')) return 'whatsapp';
      if (p.includes('facebook')) return 'facebook';
      if (p.includes('linkedin')) return 'linkedin';
      if (p.includes('pinterest')) return 'pinterest';
      if (p.includes('telegram')) return 'telegram';
      if (p.includes('youtube')) return 'youtube';
      if (p.includes('threads')) return 'threads';
      if (p.includes('reddit')) return 'reddit';
      return p;
    });
}

/** Extract the main creative/copy content from a post body, stripping away
 *  metadata fields like **Platform:**, **Caption:**, **Visual:**, etc. */
function extractMainContent(body: string): string {
  // Remove lines that start with bold labels we want to exclude
  const metadataLabels = [
    'Platform', 'Caption', 'Visual', 'LearnX tie-in', 'LearnX connection',
    'LearnX note', 'Background', 'Main stat', 'Cheeky line', 'Bottom text',
    'Share prompt', 'Alt cheeky lines', 'Dynamic sub-lines', 'Personality types',
    'Time-based reactions', 'Garden status lines', 'Milestone lines',
    'Fun additions by count', 'Emotional escalation by count', 'Annual bonus elements',
    'Comparison lines', 'Stats block', 'Format', 'Typography', 'Starter comment',
    'Expected engagement', 'Question/Prompt', 'Timing', 'Visual concept',
    'Main copy', 'Punchline', 'Hook', 'Scene breakdown', 'Audio',
    'Goal', 'Hashtags', 'Headline', 'Body',
  ];

  const lines = body.split('\n');
  const contentLines: string[] = [];
  let skipping = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip horizontal rules
    if (trimmed === '---') continue;

    // Check if line starts with a bold metadata label
    const isMetadata = metadataLabels.some((label) => {
      const pattern = `**${label}:**`;
      return trimmed.startsWith(pattern) || trimmed.startsWith(`**${label} (`);
    });

    if (isMetadata) {
      skipping = true;
      continue;
    }

    // If we hit a new bold label we don't recognize, still skip
    if (trimmed.match(/^\*\*[A-Z][^*]*:\*\*/)) {
      skipping = true;
      continue;
    }

    // A blank line resets the skip state
    if (trimmed === '') {
      skipping = false;
      contentLines.push('');
      continue;
    }

    if (!skipping) {
      contentLines.push(line);
    }
  }

  // Clean up: collapse multiple blank lines, trim
  return contentLines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ---------------------------------------------------------------------------
// Per-file parsers
// ---------------------------------------------------------------------------

function parseDataDrops(filePath: string): ParsedPost[] {
  const md = fs.readFileSync(filePath, 'utf-8');
  const blocks = splitByH3(md);
  const posts: ParsedPost[] = [];

  for (const block of blocks) {
    // Only process actual data drop posts (skip non-post sections)
    if (!block.title.match(/^Data Drop #\d+/i)) continue;

    const stat = extractField(block.body, 'STAT');
    const context = extractField(block.body, 'CONTEXT');
    const punchline = extractField(block.body, 'PUNCHLINE');
    const caption = extractField(block.body, 'Caption');
    const platformStr = extractField(block.body, 'Platform');

    const content = [
      stat ? `STAT: ${stat}` : '',
      context ? `CONTEXT: ${context}` : '',
      punchline ? `PUNCHLINE: ${punchline}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    posts.push({
      series: 'data-drop',
      title: block.title,
      content,
      caption,
      hashtags: extractHashtags(caption || block.body),
      platforms: parsePlatforms(platformStr),
      mediaType: 'image',
    });
  }

  return posts;
}

function parseConfessionsOverheard(filePath: string): ParsedPost[] {
  const md = fs.readFileSync(filePath, 'utf-8');
  const blocks = splitByH3(md);
  const posts: ParsedPost[] = [];

  for (const block of blocks) {
    const isConfession = block.title.match(/^Confession #\d+/i);
    const isOverheard = block.title.match(/^Overheard #\d+/i);
    if (!isConfession && !isOverheard) continue;

    const platformStr = extractField(block.body, 'Platform');
    const content = extractMainContent(block.body);

    posts.push({
      series: isConfession ? 'confession' : 'overheard',
      title: block.title,
      content,
      caption: '', // These posts use the content itself as the caption
      hashtags: isConfession
        ? ['#StudentConfessions', '#LearnX', '#HarBacchaStar', '#SchoolLife', '#IndianStudents', '#Relatable']
        : ['#OverheardInSchool', '#LearnX', '#HarBacchaStar', '#IndianSchoolLife', '#SchoolMemes', '#Relatable'],
      platforms: parsePlatforms(platformStr),
      mediaType: isConfession ? 'image' : 'carousel',
    });
  }

  return posts;
}

function parseMomentMarketingEngagement(filePath: string): ParsedPost[] {
  const md = fs.readFileSync(filePath, 'utf-8');
  const blocks = splitByH3(md);
  const posts: ParsedPost[] = [];

  for (const block of blocks) {
    const isMoment = block.title.match(/^Moment #\d+/i);
    const isEngagement = block.title.match(/^Engagement #\d+/i);
    if (!isMoment && !isEngagement) continue;

    const platformStr = extractField(block.body, 'Platform');
    const caption = extractField(block.body, 'Caption');

    let content: string;
    if (isMoment) {
      const mainCopy = extractField(block.body, 'Main copy');
      const punchline = extractField(block.body, 'Punchline');
      content = [mainCopy, punchline].filter(Boolean).join('\n\n');
    } else {
      // Engagement posts use Question/Prompt as the main content
      const questionPrompt = extractField(block.body, 'Question/Prompt');
      const starterComment = extractField(block.body, 'Starter comment');
      content = [questionPrompt, starterComment ? `Starter: ${starterComment}` : '']
        .filter(Boolean)
        .join('\n\n');
    }

    let mediaType: ParsedPost['mediaType'] = 'image';
    if (isMoment) {
      // Some moment marketing posts mention Reel explicitly
      const visualConcept = extractField(block.body, 'Visual concept');
      if (visualConcept.toLowerCase().includes('reel')) {
        mediaType = 'video';
      }
      if (visualConcept.toLowerCase().includes('carousel')) {
        mediaType = 'carousel';
      }
    }

    posts.push({
      series: isMoment ? 'moment-marketing' : 'engagement',
      title: block.title,
      content,
      caption,
      hashtags: extractHashtags(caption || block.body),
      platforms: parsePlatforms(platformStr),
      mediaType,
    });
  }

  return posts;
}

function parseWrappedLaunchWhatsapp(filePath: string): ParsedPost[] {
  const md = fs.readFileSync(filePath, 'utf-8');
  const blocks = splitByH3(md);
  const posts: ParsedPost[] = [];

  for (const block of blocks) {
    const isWrapped = block.title.match(/^Wrapped Card #\d+/i);
    const isWhatsapp = block.title.match(/^WhatsApp #\d+/i);

    // Launch days are formatted differently — look for "DAY N:" in the parent content
    // We detect them by the format of the title itself
    const isLaunchSection = block.title.match(/^DAY \d+/i) !== null;

    // Also handle individual day content that appears as sub-sections
    if (!isWrapped && !isWhatsapp && !isLaunchSection) continue;

    if (isWrapped) {
      const mainStat = extractField(block.body, 'Main stat');
      const cheekyLine = extractField(block.body, 'Cheeky line');
      const sharePrompt = extractField(block.body, 'Share prompt');
      const content = [mainStat, cheekyLine].filter(Boolean).join('\n\n');

      posts.push({
        series: 'wrapped',
        title: block.title,
        content,
        caption: sharePrompt,
        hashtags: ['#LearnXWrapped', '#LearnX', '#HarBacchaStar'],
        platforms: ['instagram', 'whatsapp', 'facebook'],
        mediaType: 'image',
      });
    } else if (isWhatsapp) {
      const headline = extractField(block.body, 'Headline');
      const bodyText = extractField(block.body, 'Body');
      const content = [headline, bodyText].filter(Boolean).join('\n\n');

      posts.push({
        series: 'whatsapp-card',
        title: block.title,
        content,
        caption: '',
        hashtags: ['#LearnX'],
        platforms: ['whatsapp'],
        mediaType: 'image',
      });
    } else if (isLaunchSection) {
      // Launch day content — extract from the various platform sections
      // Get the concept text as the main content
      const concept = extractField(block.body, 'Concept');
      void extractField(block.body, 'Time'); // used for context only

      // Try to extract the visual/main post text
      const visualText = extractField(block.body, 'Visual');
      const mainText = extractField(block.body, 'The post');

      // Extract inline code blocks as platform-specific content
      const codeBlocks = block.body.match(/```[\s\S]*?```/g) || [];
      const platformContent = codeBlocks
        .map((cb) => cb.replace(/```/g, '').trim())
        .join('\n\n');

      const content = [concept, mainText, visualText]
        .filter(Boolean)
        .join('\n\n');

      posts.push({
        series: 'launch',
        title: block.title,
        content: content || platformContent.slice(0, 500),
        caption: '',
        hashtags: ['#LearnX', '#HarBacchaStar', '#EveryChildShines'],
        platforms: ['instagram', 'twitter', 'facebook', 'whatsapp'],
        mediaType: 'image',
      });
    }
  }

  return posts;
}

function parseTweetsReelsLinkedin(filePath: string): ParsedPost[] {
  const md = fs.readFileSync(filePath, 'utf-8');
  const blocks = splitByH3(md);
  const posts: ParsedPost[] = [];

  for (const block of blocks) {
    const isTweet = block.title.match(/^Tweet #\d+/i);
    const isReel = block.title.match(/^Reel #\d+/i);
    const isLinkedIn = block.title.match(/^LinkedIn #\d+/i);
    if (!isTweet && !isReel && !isLinkedIn) continue;

    if (isTweet) {
      // Tweet content is the body text directly (no metadata fields usually)
      // The body is the tweet itself, sometimes followed by blank lines
      const content = block.body
        .split('\n---')[0]  // Stop at section dividers
        .trim();

      posts.push({
        series: 'tweet',
        title: block.title,
        content,
        caption: '',
        hashtags: extractHashtags(block.body) || ['#LearnX'],
        platforms: ['twitter', 'threads'],
        mediaType: 'text',
      });
    } else if (isReel) {
      // Reels have structured metadata: Hook, Scene breakdown, Audio, Caption
      const caption = extractField(block.body, 'Caption');
      const hook = extractField(block.body, 'Hook \\(0-2s\\)') || extractField(block.body, 'Hook');

      // Extract scene breakdown for the content
      const sceneBreakdown = extractField(block.body, 'Scene breakdown');
      const content = [hook ? `Hook: ${hook}` : '', sceneBreakdown]
        .filter(Boolean)
        .join('\n\n');

      posts.push({
        series: 'reel',
        title: block.title,
        content,
        caption,
        hashtags: extractHashtags(caption || block.body),
        platforms: ['instagram', 'youtube', 'facebook'],
        mediaType: 'video',
      });
    } else if (isLinkedIn) {
      // LinkedIn posts are long-form text — the body IS the content
      // Extract hashtags from the end
      const hashtagField = extractField(block.body, 'Hashtags');
      const hashtags = extractHashtags(hashtagField || block.body);

      // The content is everything before the **Hashtags:** line
      const hashtagLineIdx = block.body.indexOf('**Hashtags:**');
      const content = hashtagLineIdx > -1
        ? block.body.slice(0, hashtagLineIdx).trim()
        : block.body.trim();

      posts.push({
        series: 'linkedin',
        title: block.title,
        content,
        caption: '',
        hashtags,
        platforms: ['linkedin'],
        mediaType: 'text',
      });
    }
  }

  return posts;
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/** The docs/social-media/ directory is resolved relative to the project root
 *  (two levels above src/lib/calendar/). If running from a different cwd,
 *  the caller can pass an explicit base path. */
function resolveDocsDir(): string {
  // __dirname at compile time would be src/lib/calendar
  // We go up three levels to reach the repo root
  // However, because this may be bundled by Next.js, we also accept process.cwd()
  const possibleRoots = [
    path.resolve(__dirname, '..', '..', '..'),   // from src/lib/calendar -> root
    process.cwd(),                                  // from wherever node runs
  ];

  for (const root of possibleRoots) {
    const docsDir = path.join(root, 'docs', 'social-media');
    if (fs.existsSync(docsDir)) {
      return docsDir;
    }
  }

  // Fallback: assume cwd is project root
  return path.join(process.cwd(), 'docs', 'social-media');
}

export async function parseAllContent(): Promise<ParsedPost[]> {
  const docsDir = resolveDocsDir();
  const allPosts: ParsedPost[] = [];

  // 1. Data Drops (15 posts)
  const dataDropsPath = path.join(docsDir, 'series-data-drops.md');
  if (fs.existsSync(dataDropsPath)) {
    allPosts.push(...parseDataDrops(dataDropsPath));
  }

  // 2. Confessions + Overheard (15 + 15 = 30 posts)
  const confessionsPath = path.join(docsDir, 'series-confessions-overheard.md');
  if (fs.existsSync(confessionsPath)) {
    allPosts.push(...parseConfessionsOverheard(confessionsPath));
  }

  // 3. Moment Marketing + Engagement (20 + 15 = 35 posts)
  const momentPath = path.join(docsDir, 'series-moment-marketing-engagement.md');
  if (fs.existsSync(momentPath)) {
    allPosts.push(...parseMomentMarketingEngagement(momentPath));
  }

  // 4. Wrapped + Launch + WhatsApp (12 + 7 + 20 = 39 pieces)
  const wrappedPath = path.join(docsDir, 'series-wrapped-launch-whatsapp.md');
  if (fs.existsSync(wrappedPath)) {
    allPosts.push(...parseWrappedLaunchWhatsapp(wrappedPath));
  }

  // 5. Tweets + Reels + LinkedIn (25 + 15 + 10 = 50 posts)
  const tweetsPath = path.join(docsDir, 'series-tweets-reels-voice.md');
  if (fs.existsSync(tweetsPath)) {
    allPosts.push(...parseTweetsReelsLinkedin(tweetsPath));
  }

  return allPosts;
}

// ---------------------------------------------------------------------------
// Utility: run standalone to verify parsing
// ---------------------------------------------------------------------------
if (require.main === module) {
  parseAllContent().then((posts) => {
    const bySeries: Record<string, number> = {};
    for (const p of posts) {
      bySeries[p.series] = (bySeries[p.series] || 0) + 1;
    }
    console.log(`Total posts parsed: ${posts.length}`);
    console.log('By series:', bySeries);
    // Print first post of each series as a sample
    const seen = new Set<string>();
    for (const p of posts) {
      if (!seen.has(p.series)) {
        seen.add(p.series);
        console.log(`\n--- Sample: ${p.series} ---`);
        console.log(`Title: ${p.title}`);
        console.log(`Content (first 200 chars): ${p.content.slice(0, 200)}`);
        console.log(`Caption (first 100 chars): ${p.caption.slice(0, 100)}`);
        console.log(`Hashtags: ${p.hashtags.join(', ')}`);
        console.log(`Platforms: ${p.platforms.join(', ')}`);
        console.log(`Media type: ${p.mediaType}`);
      }
    }
  });
}
