/* ============================================================
   Stamps a content hash onto the asset URLs in the HTML, so a
   browser can never pair fresh HTML with a stale cached copy of
   assets/games.js or assets/style.css.

   That pairing took the live grid down once: index.html is served
   with max-age=0 and always arrives fresh, while /assets was served
   with max-age=14400, so a returning visitor ran new HTML against
   four-hour-old JS and every card threw.

   The hash is of the asset's own bytes, so it changes exactly when
   the file changes and never needs hand-incrementing.

     node tools/stamp-assets.mjs           rewrite the HTML
     node tools/stamp-assets.mjs --check   exit 1 if stamps are stale
   ============================================================ */

import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PAGES = ['index.html', 'game.html'];
const ASSETS = ['assets/games.js', 'assets/style.css'];

const hashOf = (rel) =>
  createHash('sha256').update(readFileSync(join(ROOT, rel))).digest('hex').slice(0, 8);

/* matches src="assets/games.js" or href="assets/style.css", with or
   without an existing ?v= stamp */
const urlRe = (rel) =>
  new RegExp(`((?:src|href)=")${rel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\?v=[^"]*)?(")`, 'g');

export function stamp({ check = false } = {}) {
  const hashes = Object.fromEntries(ASSETS.map((a) => [a, hashOf(a)]));
  let stale = false;
  const report = [];

  for (const page of PAGES) {
    const path = join(ROOT, page);
    const before = readFileSync(path, 'utf8');
    let after = before;

    for (const asset of ASSETS) {
      const re = urlRe(asset);
      if (!re.test(after)) continue;
      re.lastIndex = 0;
      after = after.replace(re, `$1${asset}?v=${hashes[asset]}$2`);
    }

    if (after !== before) {
      stale = true;
      if (!check) writeFileSync(path, after);
      report.push(`  ${check ? 'STALE' : 'updated'}  ${page}`);
    } else {
      report.push(`  ok       ${page}`);
    }
  }

  return { hashes, stale, report };
}

/* only act when run directly, so build-games.mjs can import stamp() */
if (import.meta.url === `file://${process.argv[1]}`) {
  const check = process.argv.includes('--check');
  const { hashes, stale, report } = stamp({ check });
  for (const [asset, h] of Object.entries(hashes)) console.log(`  ${asset}  ->  ?v=${h}`);
  console.log('');
  report.forEach((l) => console.log(l));
  if (check && stale) {
    console.error('\nasset stamps are out of date — run: node tools/stamp-assets.mjs');
    process.exit(1);
  }
}
