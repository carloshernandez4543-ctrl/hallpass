/* ============================================================
   Rebuilds assets/games.js from the GameMonetize JSON feed.

   Run from the project root:
     node tools/build-games.mjs --dry-run     print the result only
     node tools/build-games.mjs               write assets/games.js
     node tools/build-games.mjs --target 150  ask for a different size
     node tools/build-games.mjs --add id,id   add only these games
     node tools/build-games.mjs --audit       check what is already listed

   Existing entries in assets/games.js are always kept, so hand
   edits survive a rebuild. New games are merged in and deduped.

   NOTE: the feed ignores popularity=mostpopular / bestgames /
   hotgames (each returns an empty array). Passing format=json on
   its own returns the whole catalogue, which is what we use.
   ============================================================ */

import { readFileSync, writeFileSync } from 'node:fs';

const FEED = 'https://rss.gamemonetize.com/rssfeed.php?format=json';
const GAMES_JS = 'assets/games.js';

const args = process.argv.slice(2);
const flagValue = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? null : args[i + 1];
};
const DRY = args.includes('--dry-run');
const AUDIT = args.includes('--audit');
const TARGET = Number(flagValue('--target')) || 100;
const CACHE = flagValue('--cache');
const ADD = (flagValue('--add') ?? '').split(',').map((s) => s.trim()).filter(Boolean);

/* Names we will not list, per site policy. Each term matches when all
   of its words appear as independent words in the title (or all in the
   tags) -- adjacency is not required, so "Squid Sprunki ... Game" is
   caught. Title and tags are checked separately so a word in one is
   never paired with a word in the other. */
const BLOCKED = ['mario', 'pokemon', 'minecraft', 'squid game',
                 'roblox', 'disney', 'hello kitty', 'sonic'];

/* The feed uses its own vocabulary; the site uses these nine. */
const CATEGORY_MAP = {
  'action': 'Action', 'fighting': 'Action', 'arcade': 'Action',
  '3d': 'Action', 'boys': 'Action',
  'racing': 'Racing',
  'shooting': 'Shooting',
  'sports': 'Sports', 'soccer': 'Sports',
  'puzzles': 'Puzzle', 'puzzle': 'Puzzle', 'bejeweled': 'Puzzle',
  'hypercasual': 'Casual', 'clicker': 'Casual', 'girls': 'Casual',
  'cooking': 'Casual',
  'adventure': 'Adventure',
  'multiplayer': 'Multiplayer', '.io': 'Multiplayer',
  '2 player': '2 Player'
};

/* strips accents too, so "Pokémon" and "Pokemon" normalise alike */
const norm = (s) => String(s ?? '')
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const wordsOf = (s) => new Set(norm(s).split(' ').filter(Boolean));

const blockedBy = (title, tags) => {
  const t = wordsOf(title), g = wordsOf(tags);
  for (const term of BLOCKED) {
    const parts = norm(term).split(' ').filter(Boolean);
    if (parts.every((w) => t.has(w))) return { term, where: 'title' };
    if (parts.every((w) => g.has(w))) return { term, where: 'tags' };
  }
  return null;
};

const slugify = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const cleanTitle = (t) =>
  String(t ?? '')
    .replace(/&amp;/g, '&').replace(/&#\d+;/g, '')
    .replace(/\s+/g, ' ')
    .replace(/"/g, "'")          // keep the generated JS string safe
    .trim();

const hashFromUrl = (url) =>
  (String(url ?? '').match(/html5\.gamemonetize\.co\/([a-z0-9]+)\//) ?? [])[1] ?? null;

const toCat = (feedCat) => {
  for (const part of String(feedCat ?? '').split(',')) {
    const hit = CATEGORY_MAP[part.trim().toLowerCase()];
    if (hit) return hit;
  }
  return 'Casual';
};

/* ---------- read what is already on the site ---------- */
const existingSrc = readFileSync(GAMES_JS, 'utf8');
const existing = [...existingSrc.matchAll(
  /\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*cat:\s*"([^"]+)",\s*ratio:\s*"([^"]+)"\s*\}/g
)].map(([, id, name, cat, ratio]) => ({ id, name, cat, ratio }));

if (!existing.length) throw new Error(`parsed 0 games out of ${GAMES_JS} — aborting rather than clobbering it`);

/* ---------- fetch the catalogue ---------- */
const feed = CACHE
  ? JSON.parse(readFileSync(CACHE, 'utf8'))
  : await (await fetch(FEED, {
      headers: { 'user-agent': 'Mozilla/5.0', referer: 'https://gamemonetize.com/' }
    })).json();

if (!Array.isArray(feed) || !feed.length) throw new Error('feed returned no records');

const byId = new Map();
for (const raw of feed) {
  const id = hashFromUrl(raw.url);
  if (id) byId.set(id, raw);
}

/* ---------- audit mode: check what is already listed ---------- */
if (AUDIT) {
  console.log(`auditing ${existing.length} listed games against the blocklist\n`);
  console.log(`blocklist: ${BLOCKED.join(', ')}`);
  console.log(`rule: every word of a term must appear as its own word in the title (or in the tags)\n`);
  let hits = 0, noFeed = 0;
  for (const g of existing) {
    const raw = byId.get(g.id);
    if (!raw) noFeed++;
    const hit = blockedBy(g.name, raw?.tags ?? '');
    if (hit) {
      hits++;
      console.log(`  CAUGHT  "${g.name}"`);
      console.log(`          term "${hit.term}" matched in the ${hit.where}` +
                  (hit.where === 'tags' ? `  (tags: ${String(raw.tags).slice(0, 80)})` : ''));
      console.log(`          cat=${g.cat}  id=${g.id}`);
    }
  }
  console.log(`\n${hits} of ${existing.length} listed games would be caught.`);
  console.log(`(${noFeed} are no longer in the catalogue, so only their name could be checked)`);
  process.exit(0);
}

/* ---------- convert, filter, dedupe ---------- */
const seenId = new Set(existing.map((g) => g.id));
const seenSlug = new Set(existing.map((g) => slugify(g.name)));
const stats = { blocked: {}, dupId: 0, dupSlug: 0, noHash: 0, noName: 0 };

const convert = (raw) => {
  const name = cleanTitle(raw.title);
  const w = Number(raw.width), h = Number(raw.height);
  return {
    id: hashFromUrl(raw.url),
    name,
    cat: toCat(raw.category),
    ratio: Number.isFinite(w) && Number.isFinite(h) && h > w ? 'tall' : 'wide'
  };
};

let picked = [];

if (ADD.length) {
  /* explicit picks: take exactly these, in the order given */
  for (const id of ADD) {
    const raw = byId.get(id);
    if (!raw) { console.log(`  !! ${id} is not in the catalogue, skipping`); continue; }
    if (seenId.has(id)) { console.log(`  -- ${id} is already listed, skipping`); continue; }
    const g = convert(raw);
    const slug = slugify(g.name);
    if (seenSlug.has(slug)) { console.log(`  !! "${g.name}" collides with an existing slug, skipping`); continue; }
    const hit = blockedBy(raw.title, raw.tags);
    if (hit) console.log(`  ** "${g.name}" matches blocked term "${hit.term}" in the ${hit.where} — adding anyway because it was named explicitly`);
    seenId.add(id); seenSlug.add(slug);
    picked.push(g);
    console.log(`  ++ ${g.name}  (${g.cat}, ${g.ratio})`);
  }
  console.log('');
} else {
  const buckets = new Map();
  for (const raw of feed) {
    const id = hashFromUrl(raw.url);
    if (!id) { stats.noHash++; continue; }
    if (seenId.has(id)) { stats.dupId++; continue; }

    const hit = blockedBy(raw.title, raw.tags);
    if (hit) { stats.blocked[hit.term] = (stats.blocked[hit.term] ?? 0) + 1; continue; }

    const g = convert(raw);
    if (!g.name) { stats.noName++; continue; }

    const slug = slugify(g.name);
    if (!slug || seenSlug.has(slug)) { stats.dupSlug++; continue; }

    seenId.add(id); seenSlug.add(slug);
    if (!buckets.has(g.cat)) buckets.set(g.cat, []);
    buckets.get(g.cat).push(g);
  }

  /* Round-robin across categories so one huge bucket cannot swamp the grid. */
  const need = Math.max(0, TARGET - existing.length);
  const order = [...buckets.keys()].sort();
  let exhausted = false;
  while (picked.length < need && !exhausted) {
    exhausted = true;
    for (const cat of order) {
      if (picked.length >= need) break;
      const q = buckets.get(cat);
      if (q.length) { picked.push(q.shift()); exhausted = false; }
    }
  }
}

const final = [...existing, ...picked];

/* ---------- render ---------- */
const pad = (s, n) => s + ' '.repeat(Math.max(0, n - s.length));
const wName = Math.max(...final.map((g) => g.name.length)) + 2;
const wCat = Math.max(...final.map((g) => g.cat.length)) + 2;
const lines = final.map((g, i) =>
  `  { id: "${g.id}", name: ${pad(`"${g.name}",`, wName + 1)} ` +
  `cat: ${pad(`"${g.cat}",`, wCat + 1)} ratio: "${g.ratio}" }` +
  (i === final.length - 1 ? '' : ',')
);

const header = existingSrc.slice(0, existingSrc.indexOf('const GAMES'));
const footer = existingSrc.slice(existingSrc.indexOf('/* --- helpers'));
const out = `${header}const GAMES = [\n${lines.join('\n')}\n];\n\n${footer}`;

/* ---------- report ---------- */
const tally = (list) => list.reduce((a, g) => (a[g.cat] = (a[g.cat] ?? 0) + 1, a), {});
const before = tally(existing), after = tally(final);

console.log(`feed records          ${feed.length}`);
console.log(`kept from your file   ${existing.length}`);
console.log(`new games merged in   ${picked.length}`);
console.log(`FINAL TOTAL           ${final.length}\n`);

if (!ADD.length) {
  console.log('skipped while merging:');
  for (const [term, n] of Object.entries(stats.blocked).sort((a, b) => b[1] - a[1]))
    console.log(`  trademark "${term}"`.padEnd(26) + n);
  console.log('  already on the site'.padEnd(26) + stats.dupId);
  console.log('  duplicate slug'.padEnd(26) + stats.dupSlug);
  console.log('  unusable record'.padEnd(26) + (stats.noHash + stats.noName));
}

console.log('\nCATEGORY BREAKDOWN');
console.log('  category      before   after   added');
for (const cat of Object.keys(after).sort()) {
  const b = before[cat] ?? 0, a = after[cat];
  console.log(`  ${pad(cat, 14)}${String(b).padStart(4)}${String(a).padStart(9)}${String(a - b).padStart(8)}`);
}
console.log(`  ${pad('TOTAL', 14)}${String(existing.length).padStart(4)}${String(final.length).padStart(9)}${String(picked.length).padStart(8)}`);

const tall = final.filter((g) => g.ratio === 'tall').length;
console.log(`\norientation: ${final.length - tall} wide, ${tall} tall`);

if (DRY) {
  console.log(`\n--dry-run: ${GAMES_JS} not written`);
} else {
  writeFileSync(GAMES_JS, out);
  console.log(`\nwrote ${GAMES_JS} (${final.length} games)`);
}
