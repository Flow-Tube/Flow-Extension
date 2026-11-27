import { MUSIC_HOST, VIDEO_ID_RE } from "../lib/const.js";

const VIDEO_HOSTS = new Set(["www.youtube.com", "m.youtube.com", "youtube.com"]);
const PATH_VIDEO_RE = /^\/(?:shorts|live)\/[A-Za-z0-9_-]{11}(?:\/|$)/;
const YOUTUBE_PAGE_RE =
  /^https?:\/\/(?:[a-z0-9-]+\.)*(?:youtube\.com|youtu\.be)(?:[/:?#]|$)/i;

// The pages "Open YouTube links in Flow" sends on: a video, a Short, a live stream, or a
// song on YouTube Music. Playlists, channels and the rest of YouTube stay in the browser.
export function isFlowLink(url) {
  const host = url.hostname.toLowerCase();
  const watch =
    url.pathname === "/watch" && VIDEO_ID_RE.test(url.searchParams.get("v") ?? "");
  if (host === MUSIC_HOST) return watch;
  if (!VIDEO_HOSTS.has(host)) return false;
  return watch || PATH_VIDEO_RE.test(url.pathname);
}

// A page opened from YouTube itself, such as a video opened in a new tab while browsing it.
export function cameFromYoutube(referrer) {
  return YOUTUBE_PAGE_RE.test(referrer);
}
