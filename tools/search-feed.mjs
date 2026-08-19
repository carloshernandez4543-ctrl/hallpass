/* ============================================================
   Searches the GameMonetize catalogue without changing anything.

     node tools/search-feed.mjs --cache feed.json "slither" "moto x3m"
     node tools/search-feed.mjs "cookie clicker"        (fetches live)

   Prints, per term, every catalogue match with its id, mapped site
   category, orientation, and whether it is already in assets/games.js.
   Nothing is written; use tools/build-games.mjs to actually add games.
   ============================================================ */

import { readFileSync } from 'node:fs';

const FEED = 'https://rss.gamemonetize.com/rssfeed.php?format=json';
const args = process.argv.slice(2);
const cacheAt = args.indexOf('--cache');
const CACHE = cacheAt !== -1 ? args[cacheAt + 1] : null;
const LIMIT = 14;
const terms = args.filter((a, i) =>
  a !== '--cache' && i !== cacheAt + 1 && !a.startsWith('--'));

if (!terms.length) { console.error('give me at least one search term'); process.exit(1); }

const CATEGORY_MAP = {
  'action':'Action','fighting':'Action','arcade':'Action','3d':'Action','boys':'Action',
  'racing':'Racing','shooting':'Shooting','sports':'Sports','soccer':'Sports',
  'puzzles':'Puzzle','puzzle':'Puzzle','bejeweled':'Puzzle',
  'hypercasual':'Casual','clicker':'Casual','girls':'Casual','cooking':'Casual',
  'adventure':'Adventure','multiplayer':'Multiplayer','.io':'Multiplayer','2 player':'2 Player'
};
const toCat = (c) => {
  for (const part of String(c ?? '').split(','))
    if (CATEGORY_MAP[part.trim().toLowerCase()]) return CATEGORY_MAP[part.trim().toLowerCase()];
  return 'Casual';
};

/* "Paper.io 2" and "PAPER IO" both normalise to "paper io 2" */
const norm = (s) => String(s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const feed = CACHE
  ? JSON.parse(readFileSync(CACHE, 'utf8'))
  : await (await fetch(FEED, { headers: { 'user-agent': 'Mozilla/5.0', referer: 'https://gamemonetize.com/' } })).json();

let owned = new Set();
try {
  const src = readFileSync('assets/games.js', 'utf8');
  owned = new Set([...src.matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1]));
} catch {}

const rows = feed.map((g) => {
  const id = (String(g.url ?? '').match(/html5\.gamemonetize\.co\/([a-z0-9]+)\//) ?? [])[1];
  const w = Number(g.width), h = Number(g.height);
  return {
    id, title: String(g.title ?? '').trim(),
    nTitle: ' ' + norm(g.title) + ' ',
    nTags: ' ' + norm(g.tags) + ' ',
    cat: toCat(g.category), feedCat: String(g.category ?? '').trim(),
    ratio: Number.isFinite(w) && Number.isFinite(h) && h > w ? 'tall' : 'wide'
  };
}).filter((r) => r.id);

console.log(`catalogue: ${rows.length} games   already on the site: ${owned.size}\n`);

for (const term of terms) {
  const n = norm(term);
  const tokens = n.split(' ');
  const phrase = ' ' + n + ' ';

  const exact  = rows.filter((r) => r.nTitle.includes(phrase));
  const loose  = rows.filter((r) => !exact.includes(r) && tokens.every((t) => r.nTitle.includes(' ' + t + ' ')));
  const tagged = rows.filter((r) => !exact.includes(r) && !loose.includes(r) && r.nTags.includes(phrase));

  const total = exact.length + loose.length + tagged.length;
  console.log(`\n${'='.repeat(72)}`);
  console.log(`TERM: "${term}"   ${total ? `${total} match(es)` : 'NO MATCHES'}`);
  console.log('='.repeat(72));

  const show = (label, list) => {
    if (!list.length) return;
    console.log(`  -- ${label} --`);
    for (const r of list.slice(0, LIMIT)) {
      const have = owned.has(r.id) ? ' [ALREADY ON SITE]' : '';
      console.log(`   ${r.title}`);
      console.log(`      cat=${r.cat} (feed: ${r.feedCat})  ratio=${r.ratio}  id=${r.id}${have}`);
    }
    if (list.length > LIMIT) console.log(`   ... and ${list.length - LIMIT} more`);
  };
  show('title contains the exact phrase', exact);
  show('title contains all the words, not adjacent', loose);
  show('phrase only in tags, not the title', tagged);
}
