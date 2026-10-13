# Grand Slam Tracker

Men's singles Grand Slam finals from 2003 onwards — champion, runner-up and
a running finals record for every player who reached one.

A single static page. No build step, no dependencies, no network calls.

**Live:** `https://<your-username>.github.io/grand-slam-tracker/`

---

## What's in it

| View | What it shows |
|---|---|
| **Champions grid** | Every final, colour-coded by champion. Highlight one player to grey out the rest. |
| **Leaderboard** | Titles, finals lost, finals reached and win rate. Sort by any column. |
| **Won / reached by year** | `2/4` = won 2 of the 4 finals reached that year. |
| **Notes & data** | Tournament footnotes, the corrections log, and backup/restore. |

## Desktop and mobile

The layout switches itself. The button in the toolbar cycles through three states:

- **Auto** (default) — grid on wide screens, one card per year at **720px or narrower**.
  It re-checks when you resize the window or rotate your phone.
- **Grid** — force the wide matrix, even on a phone (it scrolls sideways).
- **Cards** — force the per-year cards, even on a desktop.

Your choice is remembered per device. To change the breakpoint, edit `CARD_MAX`
in `index.html`.

## Installing it on a phone

It's a PWA, so it can live on your home screen and open full-screen with no
browser chrome, working with no signal.

- **iOS / Safari** — Share → *Add to Home Screen*
- **Android / Chrome** — menu → *Install app* (or *Add to Home screen*)

Offline support comes from `sw.js`, which caches the page and icons. It only
registers over `http(s)`, so opening `index.html` straight off disk still works —
it just won't cache.

## Editing the data

Two ways, and they're independent:

**In the app** — tap **Edit**, then tap any final. Use **+ Year** to start a new
season. Changes save to that browser's `localStorage`.

> Stored data is per-browser, so your laptop and phone keep separate copies even
> though they load the same URL. **Notes & data → Show my data** gives you a
> blob you can paste into the other device. **Reset to verified data** discards
> local edits and returns to what ships in the file.

**In the file** — the `SEED` object near the top of the `<script>` is the source
of truth that everyone gets on first load. One array per tournament, one entry
per year starting at 2003:

```js
"Wimbledon":[ /* 2003 */ "Federer|Philippoussis", ... ]
```

Format is `"Champion|Runner-up"` with an optional third field for the score
(`"Alcaraz|Djokovic|2-6 6-2 6-3 7-5"`). Use `"X"` for a tournament that wasn't
played, or `""` for one not recorded yet. Colours live in `COLORS`, retirements
in `STATUS`, footnotes in `NOTES`.

Editing `SEED` only changes what *new* visitors see. A browser that already has
local edits keeps them until you hit **Reset to verified data**.

## Deploying

### From the GitHub website

1. Create a repository called **grand-slam-tracker**.
2. *Add file → Upload files*, drag in everything here (including the `icons`
   folder), commit.
3. *Settings → Pages* → Source: **Deploy from a branch**, Branch: **main**, folder: **/ (root)**.
4. Wait a minute, then load `https://<your-username>.github.io/grand-slam-tracker/`.

### From the command line

```bash
cd grand-slam-tracker
git init -b main
git add .
git commit -m "Grand Slam Tracker"
git remote add origin git@github.com:<your-username>/grand-slam-tracker.git
git push -u origin main
```

Then enable Pages as in step 3 above.

**Renaming the repo?** Nothing in the code hardcodes the name — every path is
relative, so it works at any URL. Only the README link above needs updating.

**After you push an update:** bump `CACHE` in `sw.js` (`slam-tracker-v1` →
`-v2`). The page itself is fetched network-first so it refreshes anyway, but
bumping the version clears out stale icons and is the habit worth keeping.

`.nojekyll` is there to stop GitHub Pages running the files through Jekyll.

## Data provenance

Finals were checked against the Wikipedia per-tournament champion lists, the
Australian Open honour roll, the Roland-Garros palmarès, and the per-player
Grand Slam finals tables, with individual year articles for anything ambiguous.
The **Notes & data** tab lists every correction made to the spreadsheet this
started from — including the 2017 US Open runner-up (Anderson, not Del Potro)
and the two 2026 majors that were missing.

Counts cover 2003 onwards only, so they're not full career totals for players
who won majors before 2003 (Agassi, most obviously).

## Licence

MIT — see `LICENSE`.
