/**
 * Generate the 365-day content calendar as a static JSON file.
 * Run: npx tsx scripts/generate-calendar.ts
 */
import { generateCalendarAsync } from '../src/lib/calendar/generator';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

async function main() {
  const startDate = '2026-03-01';
  console.log(`Generating calendar starting ${startDate}...`);

  const calendar = await generateCalendarAsync(startDate);

  // Write to public/data/calendar.json so it's accessible at runtime
  const outDir = join(process.cwd(), 'public', 'data');
  mkdirSync(outDir, { recursive: true });

  const outPath = join(outDir, 'calendar.json');
  writeFileSync(outPath, JSON.stringify(calendar, null, 2));

  // Stats
  const scheduled = calendar.filter(p => p.status === 'scheduled').length;
  const drafts = calendar.filter(p => p.status === 'draft').length;
  const series: Record<string, number> = {};
  for (const post of calendar) {
    series[post.series] = (series[post.series] || 0) + 1;
  }

  console.log(`\nGenerated ${calendar.length} posts:`);
  console.log(`  Scheduled (from content): ${scheduled}`);
  console.log(`  Drafts (placeholders): ${drafts}`);
  console.log(`\nBy series:`);
  for (const [s, count] of Object.entries(series).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${s}: ${count}`);
  }
  console.log(`\nSaved to: ${outPath}`);
}

main().catch(console.error);
