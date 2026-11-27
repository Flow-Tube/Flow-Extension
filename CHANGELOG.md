# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- **Open YouTube links in Flow** (off by default, in the popup and Settings): a video, Short, live stream or YouTube Music song opened from another site or app goes to Flow, and the tab goes back or closes. **Watch here instead** keeps a tab in the browser, and the page loads normally if Flow doesn't answer.

### Fixed

- Silent mode works from YouTube pages. Content scripts can't read the extension's permissions, so the check always failed and every handoff fell back to the `flow://` prompt; it now asks the background worker.

### Changed

- Links point to the Flow-Tube organisation on GitHub.
- The popup and the settings page use Flow Desktop's settings look: grouped rows and the same switches. The popup can send the video, Short or song on the current tab to Flow at the time you are at.
- Watch in Flow and Download sit in the player's own controls, next to subtitles and settings, like SponsorBlock's buttons. Watch pauses the video here and shows "Sent to Flow at 3:42" inside the player. Player buttons in the popup and Settings picks Watch and download, Watch only or Off.
- The bar above the video title is replaced by an Open in Flow pill next to Share, the same size and shape as YouTube's own buttons. It keeps the choice you made for the old bar.
- Watch and Download sit inside each thumbnail's top-left corner while you point at a card, so they scroll with it and no longer cover YouTube's Watch later and Add to queue icons. They are smaller on sidebar and search rows, Shorts cards open in Flow's Shorts player, Download hides on live streams and premieres, and YouTube Music song rows get a Flow button beside their menu. They also work over YouTube's hover previews in search.
- Video ids are found on YouTube's current card layout again.
- Shorts get a Flow button at the end of their action column, which opens the Short in Flow's Shorts player. Playlist, channel and YouTube Music album and playlist pages get Open in Flow next to their own buttons, and so does the playlist panel beside a video. Shorts and page buttons in the popup and Settings turns them off.
- YouTube Music's player bar has Flow and Download before the volume button, following the Player buttons setting. Notices on YouTube Music show above the player bar.
- Buttons on YouTube follow YouTube's own light or dark theme instead of the computer's. On light YouTube, Watch in Flow was white on white.

## [1.0.1]

### Fixed

- Watch-page buttons now render as a full-width bar directly below the player and above the metadata, instead of crowding and wrapping the like/share actions row.
- Thumbnail hover overlay no longer flickers: mouseover events that retarget to the overlay's own Shadow-DOM host are handled, and hiding is debounced.

## [1.0.0]

### Added

- Watch-page button row: **Watch in Flow** / **Download**.
- Hover overlay on video thumbnails across feeds, search, sidebar, playlists, and YouTube Music.
- Right-click context-menu items for video links and watch pages.
- Handoff cascade: silent `127.0.0.1` bridge → `flow://` deep link → "Get Flow" toast.
- Popup with live connection status and quick toggles; full settings page.
- Chromium and Firefox builds from a single source.
- Release packaging and GitHub Actions CI/release pipelines.
