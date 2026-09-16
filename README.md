# Hall Pass

Static games site. No server, no database, no build step.
Deploys as-is to Cloudflare Pages.

## Files
- `index.html`      homepage grid
- `game.html`       game player (reads ?g=slug from the URL)
- `assets/games.js` THE ONLY FILE YOU EDIT to add/remove games
- `assets/style.css` styling
- `ads.txt`         required by GameMonetize — do not delete
- `assets/favicon.svg` + `favicon-32.png` + `apple-touch-icon.png`  site icon
- `/thumbs`         self-hosted game thumbnails, 400px webp + jpg
- `tools/`          local-only scripts; nothing in here is deployed
- `_headers`        Cloudflare cache rules; see Caching below

## Thumbnails

Thumbnails are served from this domain instead of img.gamemonetize.com,
because some school filters block that host while leaving the games
themselves reachable — which showed up as a grid full of broken images.

```
cd tools && npm install          # once, for sharp
node tools/fetch-thumbs.mjs      # fetch anything missing from /thumbs
node tools/fetch-thumbs.mjs --force --width 360 --webp-quality 72
```

Run it after adding games. It downloads the 512x384 original, writes
`thumbs/<id>.webp` and `thumbs/<id>.jpg` at 400px wide, and skips games
that already have both files. Originals are cached in
`tools/.thumb-cache` so re-encoding at a different quality does not
re-download anything. Useful flags: `--force`, `--width`,
`--webp-quality`, `--jpeg-quality`, `--no-jpeg`, `--concurrency`.

At 400px wide the current 205 games come to 8.7 MB — 4.3 MB of webp and
4.4 MB of jpg, down from 18.8 MB of originals. The jpg copies exist only
for browsers without webp support; `--no-jpeg` halves the total if that
stops being worth carrying.

The page asks for the webp, retries once on the jpg, and then falls back
to a plain block showing the game's name, so a missing file never
renders a broken-image icon.

## Caching

`index.html` is served with `max-age=0` and always revalidates, but
`/assets` used to come back with `max-age=14400`. For four hours after a
deploy a returning visitor would run fresh HTML against a stale
`assets/games.js`, every card would throw, and the grid rendered empty
while the header still said "205 games".

Three things now prevent that, and all three are wanted:

- `_headers` makes `/assets/*` revalidate like the HTML, and lets
  `/thumbs/*` cache for a year since a thumbnail is keyed by game id and
  never changes.
- The HTML references `assets/games.js?v=<hash>`, where the hash is of
  the file's own bytes. A changed asset is a URL the browser has never
  cached, which is the only thing that reaches browsers already holding
  a copy — `_headers` alone cannot, because their cached copy carries
  the old directive.
- `index.html` and `game.html` feature-detect the helpers they use from
  `games.js`, so a mismatch degrades to plain thumbnails instead of an
  empty grid.

```
node tools/stamp-assets.mjs           # rewrite the ?v= stamps
node tools/stamp-assets.mjs --check   # exit 1 if they are stale
```

`tools/build-games.mjs` re-stamps automatically after it writes
`games.js`. Run the stamper yourself if you hand-edit `assets/games.js`
or `assets/style.css`.

## Bulk import from the GameMonetize feed
```
node tools/build-games.mjs --dry-run   # preview + category breakdown
node tools/build-games.mjs            # rewrite assets/games.js
```
Existing entries are always kept, new ones are merged and deduped by
id and by slug, and trademarked titles are skipped. The feed ignores
`popularity=mostpopular` / `bestgames` / `hotgames` (all return `[]`),
so the script requests the full catalogue with `format=json`.

## Adding a game
1. Find the game on gamemonetize.com, copy the code from its URL:
   https://html5.gamemonetize.co/COPY_THIS_PART/
2. Open assets/games.js, copy any line, paste it, change id + name + cat.
3. Run `node tools/fetch-thumbs.mjs` so the new game gets a thumbnail.
4. Run `node tools/stamp-assets.mjs` so the cache stamp matches.
5. Save, commit, push. Cloudflare redeploys automatically.

## Deploy
GitHub repo -> Cloudflare Pages -> Connect to Git.
Build command: (leave empty)
Output directory: /
