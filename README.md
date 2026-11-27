# Flow — YouTube extension

[![CI](https://github.com/Flow-Tube/Flow-Extension/actions/workflows/ci.yml/badge.svg)](https://github.com/Flow-Tube/Flow-Extension/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/Flow-Tube/Flow-Extension?sort=semver)](https://github.com/Flow-Tube/Flow-Extension/releases/latest)
[![License: GPL v3](https://img.shields.io/badge/license-GPLv3-blue.svg)](LICENSE)

Send any YouTube or YouTube Music video to the [Flow desktop app](https://github.com/Flow-Tube/Flow-Desktop) to **watch** or **download** — one click, no accounts, no scraping. The extension only ever sends a video id (plus optional timestamp / playlist id), or with **Open YouTube links in Flow** on, the address of the YouTube page being opened. It goes to Flow on your own computer and nowhere else; all extraction and playback happen natively inside Flow.

## Install

**From a release (recommended)**

1. Download the latest build from [Releases](https://github.com/Flow-Tube/Flow-Extension/releases/latest):
   - `flow-extension-chromium-vX.Y.Z.zip` for Chrome / Edge / Brave / Opera / Vivaldi
   - `flow-extension-firefox-vX.Y.Z.zip` for Firefox
2. Unzip it.
3. Load it:
   - **Chromium** — `chrome://extensions` → enable **Developer mode** → **Load unpacked** → select the unzipped folder.
   - **Firefox** — `about:debugging` → **This Firefox** → **Load Temporary Add-on** → pick `manifest.json` inside the unzipped folder.

You also need the **Flow desktop app** installed for the handoff to do anything.

## How it works

Every action runs the same handoff cascade:

1. **Silent bridge** — if Flow is running, an HTTP request to `127.0.0.1` hands off instantly with no prompt.
2. **Deep link** — otherwise a `flow://` link launches Flow if it's installed.
3. **Get Flow** — if nothing handles it, a toast links to the desktop release.

Surfaces, each placed inside YouTube's own controls so it looks and behaves like them:

- **Player:** Watch in Flow and Download in the player's right-hand controls, with a notice inside the player.
- **Watch page:** an Open in Flow pill next to Share.
- **Thumbnails:** Watch and Download in a card's top-left corner while you point at it (beside the menu on YouTube Music song rows).
- **Shorts:** a Flow button at the end of the action column.
- **Pages:** Open in Flow on playlist, channel and YouTube Music album and playlist headers, and in a video's playlist panel.
- **YouTube Music:** Flow and Download in the player bar.
- **Popup:** the video on the current tab, at the time you are at, plus the switches. Right-click menu items too.

Everything follows YouTube's own light or dark theme. The popup and Settings use Flow Desktop's settings look.

## Open YouTube links in Flow

Off by default; turn it on in the popup or Settings. Then a YouTube video, Short, live stream or YouTube Music song that you open from another site, another app or the address bar goes to Flow instead of loading in the browser:

1. The page is held (hidden and paused) and a card shows **Opening in Flow…**.
2. The whole link goes to Flow over the silent bridge (Flow Desktop with `/flow/open`), or as `flow://open?url=…`. Flow raises its window and opens it, at the link's time.
3. The tab goes back to the page the link was on, or closes if it was opened just for the link.

**Watch here instead** on the card keeps that tab in the browser. Links stay in the browser when you reload, go Back or Forward, or open them from YouTube itself, and playlists, channels and the rest of YouTube are never sent. If Flow doesn't answer, the page simply loads.

## Project layout

```
src/
  lib/        constants, browser shim, settings, permissions, query
  bridge/     ping · http · deep-link · handoff cascade
  extract/    videoId / timestamp / playlist / selectors
  ui/         shadow host · theme · styles · icons · player buttons and notice · action pill · card buttons · shorts · page pill · music bar · toast · handoff-card
  content/    params · actions · navigation · messaging · main (entry) · link-target · intercept (entry)
  background/ context-menus · service-worker (entry)
  pages/      Flow Desktop's settings styles and switches, shared by popup and options
  popup/      status, current tab, quick switches
  options/    full settings
  manifest/   base + per-browser manifests
scripts/      icon rasteriser · zip · package · version check
build.mjs     esbuild bundler → dist/chromium + dist/firefox
```

Each module does one thing; nothing imports YouTube or Flow CSS. All injected UI lives in a Shadow DOM.

## Develop

```bash
npm install
npm run build          # → dist/chromium and dist/firefox
npm run dev            # rebuild on change (unminified, with logging)
npm run package        # zip both builds into release/
npm run release        # build + package
npm run format         # format with Prettier
```

Icons are generated from the Flow logo by a dependency-free SVG rasteriser (`scripts/`), so no binary assets are committed.

## Silent mode

Silent mode calls `127.0.0.1`, which needs an optional host permission requested on demand (from the popup or Settings). Without it the extension still works via the `flow://` deep link — just with the browser's "Open Flow?" prompt. The popup shows live connection status once access is granted.

## Releasing

Releases are automated. To cut `vX.Y.Z`:

1. Bump `version` in `package.json`.
2. `git tag vX.Y.Z && git push --tags`.

The [release workflow](.github/workflows/release.yml) verifies the tag matches `package.json`, builds and packages both browsers, and publishes the zips to GitHub Releases with generated notes.

## The bridge contract

Shared with Flow Desktop — keep both sides identical.

```
flow://watch?v=<ID>[&t=<SECONDS>][&list=<PLAYLIST_ID>]
flow://download?v=<ID>
flow://music?v=<ID>

flow://open?url=<YOUTUBE_URL>

GET http://127.0.0.1:47893/flow/ping      → { "app": "flow", "version": "…", "open": true }
GET http://127.0.0.1:47893/flow/watch     ?v,t?,list?
GET http://127.0.0.1:47893/flow/download  ?v
GET http://127.0.0.1:47893/flow/open      ?url
```

- Ports probed in order: `47893`, `47894`, `47895` (configurable in Settings).
- Video id: `^[A-Za-z0-9_-]{11}$`. Playlist id: `^[A-Za-z0-9_-]{10,64}$`.
- The desktop side validates every field and echoes CORS only for the allow-listed YouTube origins.
- `open` in the ping answer means that Flow takes whole links on `/flow/open`. An older Flow gets them as `flow://open`.

## License

[GPL-3.0-only](LICENSE).
