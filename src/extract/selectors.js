// Broad, ordered lists. YouTube renames these often, so match many and always
// re-derive the id from the anchor href rather than a fixed attribute.

export const CARD_SELECTORS = [
  "ytd-rich-item-renderer",
  "ytd-video-renderer",
  "ytd-compact-video-renderer",
  "ytd-grid-video-renderer",
  "ytd-playlist-video-renderer",
  "ytd-reel-item-renderer",
  "ytd-rich-grid-media",
  "yt-lockup-view-model",
  "ytm-shorts-lockup-view-model",
  // The inline preview YouTube lays over a card on hover; the pointer is on it, not the card.
  "ytd-video-preview",
  "ytmusic-responsive-list-item-renderer",
  "ytmusic-two-row-item-renderer",
];

// The element inside a card that holds its picture; Flow's card buttons go in its top left.
export const CARD_THUMB_SELECTOR = [
  ".ytdVideoPreviewVideoPreviewContainer",
  "yt-thumbnail-view-model",
  "ytd-thumbnail",
  "ytd-playlist-thumbnail",
  "ytmusic-two-row-item-renderer .image-wrapper",
].join(",");

// YouTube Music song rows: the cover carries its own play button, so Flow's sits by the menu.
export const SONG_ROW_SELECTOR = "ytmusic-responsive-list-item-renderer";
export const SONG_ROW_MENU_SELECTOR = ":scope > ytmusic-menu-renderer";

// Thumbnail badges that mean the video can't be downloaded yet: live now, or not out yet.
export const LIVE_BADGE_RE = /^(live|upcoming|premieres?\b)/i;

export const CARD_SELECTOR = CARD_SELECTORS.join(",");

export const WATCH_ANCHOR_SELECTOR = [
  "a#thumbnail",
  "a.yt-simple-endpoint",
  "a[href*='watch?v=']",
  "a[href*='/shorts/']",
  "a.yt-lockup-view-model-wiz__content-image",
  "a.ytLockupViewModelContentImage",
  "a.shortsLockupViewModelHostEndpoint",
].join(",");

export const PLAYER_SELECTOR = "#movie_player";
export const VIDEO_EL_SELECTOR = "video.html5-main-video, #movie_player video";
