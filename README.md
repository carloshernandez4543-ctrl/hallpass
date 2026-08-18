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
3. Save, commit, push. Cloudflare redeploys automatically.

## Deploy
GitHub repo -> Cloudflare Pages -> Connect to Git.
Build command: (leave empty)
Output directory: /
