/* ============================================================
   Downloads game thumbnails and writes resized copies into
   /thumbs, so the site never has to load img.gamemonetize.com.
   Some school filters block that host while leaving the games
   themselves reachable, which left the grid full of broken
   images.

   Run from the project root (needs: cd tools && npm install):
     node tools/fetch-thumbs.mjs                only missing ones
     node tools/fetch-thumbs.mjs --force        re-encode everything
     node tools/fetch-thumbs.mjs --width 360 --webp-quality 72
     node tools/fetch-thumbs.mjs --no-jpeg      webp only

   Originals are cached in tools/.thumb-cache so changing the
   quality settings does not re-download 205 files.
   ============================================================ */

import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const GAMES_JS = join(ROOT, 'assets', 'games.js');
const OUT_DIR = join(ROOT, 'thumbs');
const CACHE_DIR = join(ROOT, 'tools', '.thumb-cache');
const REMOTE = (id) => `https://img.gamemonetize.com/${id}/512x384.jpg`;
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
           '(KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36';

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(name);
  return i === -1 ? fallback : args[i + 1];
};
const WIDTH = Number(flag('--width', 400));
const WEBP_Q = Number(flag('--webp-quality', 78));
const JPEG_Q = Number(flag('--jpeg-quality', 74));
const FORCE = args.includes('--force');
const NO_JPEG = args.includes('--no-jpeg');
const CONCURRENCY = Number(flag('--concurrency', 8));

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch (e) {
  console.error('sharp is not installed. From the project root:\n\n  cd tools && npm install\n');
  process.exit(1);
}

for (const d of [OUT_DIR, CACHE_DIR]) if (!existsSync(d)) mkdirSync(d, { recursive: true });

/* ---------- which games ---------- */
const src = readFileSync(GAMES_JS, 'utf8');
const games = [...src.matchAll(/\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)"/g)]
  .map(([, id, name]) => ({ id, name }));
if (!games.length) { console.error(`parsed 0 games out of ${GAMES_JS}`); process.exit(1); }
console.log(`${games.length} games in ${GAMES_JS}`);
console.log(`target ${WIDTH}px wide · webp q${WEBP_Q}${NO_JPEG ? '' : ` · jpeg q${JPEG_Q}`}\n`);

/* ---------- fetch with a couple of retries ---------- */
async function download(id) {
  const cached = join(CACHE_DIR, `${id}.jpg`);
  if (existsSync(cached) && statSync(cached).size > 0) return readFileSync(cached);
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const r = await fetch(REMOTE(id), { headers: { 'user-agent': UA, referer: 'https://gamemonetize.com/' } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const buf = Buffer.from(await r.arrayBuffer());
      if (!buf.length) throw new Error('empty body');
      writeFileSync(cached, buf);
      return buf;
    } catch (err) {
      lastErr = err;
      await new Promise((res) => setTimeout(res, 400 * attempt));
    }
  }
  throw lastErr;
}

/* ---------- one game ---------- */
const stats = { sourceBytes: 0, webpBytes: 0, jpegBytes: 0, done: 0, skipped: 0, failed: [] };

async function processGame(game) {
  const webpPath = join(OUT_DIR, `${game.id}.webp`);
  const jpegPath = join(OUT_DIR, `${game.id}.jpg`);
  const wantJpeg = !NO_JPEG;

  if (!FORCE && existsSync(webpPath) && (!wantJpeg || existsSync(jpegPath))) {
    stats.webpBytes += statSync(webpPath).size;
    if (wantJpeg) stats.jpegBytes += statSync(jpegPath).size;
    const cached = join(CACHE_DIR, `${game.id}.jpg`);
    if (existsSync(cached)) stats.sourceBytes += statSync(cached).size;
    stats.skipped++;
    return;
  }

  const buf = await download(game.id);
  stats.sourceBytes += buf.length;

  const pipeline = () => sharp(buf).resize({ width: WIDTH, withoutEnlargement: true });

  const webp = await pipeline().webp({ quality: WEBP_Q, effort: 6 }).toBuffer();
  writeFileSync(webpPath, webp);
  stats.webpBytes += webp.length;

  if (wantJpeg) {
    const jpeg = await pipeline().jpeg({ quality: JPEG_Q, mozjpeg: true, progressive: true }).toBuffer();
    writeFileSync(jpegPath, jpeg);
    stats.jpegBytes += jpeg.length;
  }
  stats.done++;
}

/* ---------- run, a few at a time ---------- */
const queue = [...games];
const workers = Array.from({ length: Math.max(1, CONCURRENCY) }, async () => {
  while (queue.length) {
    const game = queue.shift();
    try {
      await processGame(game);
    } catch (err) {
      stats.failed.push({ id: game.id, name: game.name, why: err.message });
    }
    const n = stats.done + stats.skipped + stats.failed.length;
    if (n % 25 === 0 || n === games.length) process.stdout.write(`  ${n}/${games.length}\n`);
  }
});
await Promise.all(workers);

/* ---------- report ---------- */
const mb = (b) => (b / 1024 / 1024).toFixed(2) + ' MB';
const kb = (b) => (b / 1024).toFixed(1) + ' KB';
const outBytes = stats.webpBytes + stats.jpegBytes;

console.log(`\nencoded ${stats.done}, reused ${stats.skipped}, failed ${stats.failed.length}\n`);
console.log('                     total      per image');
console.log(`  source 512x384   ${mb(stats.sourceBytes).padStart(9)}   ${kb(stats.sourceBytes / games.length).padStart(9)}`);
console.log(`  webp ${WIDTH}px      ${mb(stats.webpBytes).padStart(9)}   ${kb(stats.webpBytes / games.length).padStart(9)}`);
if (!NO_JPEG)
  console.log(`  jpeg ${WIDTH}px      ${mb(stats.jpegBytes).padStart(9)}   ${kb(stats.jpegBytes / games.length).padStart(9)}`);
console.log(`  written total    ${mb(outBytes).padStart(9)}`);
if (stats.sourceBytes)
  console.log(`\n  ${(100 - (outBytes / stats.sourceBytes) * 100).toFixed(1)}% smaller than the originals` +
              ` (webp alone: ${(100 - (stats.webpBytes / stats.sourceBytes) * 100).toFixed(1)}%)`);

if (stats.failed.length) {
  console.log('\nfailed:');
  for (const f of stats.failed) console.log(`  ${f.id}  ${f.name}  — ${f.why}`);
  process.exitCode = 1;
}

/* anything in /thumbs that no longer belongs to a listed game */
const known = new Set(games.flatMap((g) => [`${g.id}.webp`, `${g.id}.jpg`]));
const orphans = readdirSync(OUT_DIR).filter((f) => /\.(webp|jpg)$/.test(f) && !known.has(f));
if (orphans.length) console.log(`\n${orphans.length} file(s) in /thumbs no longer match a listed game: ${orphans.slice(0, 5).join(', ')}${orphans.length > 5 ? ' …' : ''}`);
