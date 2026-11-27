import { MUSIC_HOST } from "../lib/const.js";

const hosts = new Set();
let observer = null;

// YouTube marks its dark theme with a `dark` attribute on <html>; YouTube Music is always dark.
export function youtubeTheme() {
  if (location.host === MUSIC_HOST) return "dark";
  return document.documentElement.hasAttribute("dark") ? "dark" : "light";
}

function applyAll() {
  const theme = youtubeTheme();
  for (const host of hosts) {
    if (host.isConnected) host.dataset.ytTheme = theme;
    else hosts.delete(host);
  }
}

// Keeps a shadow host's `data-yt-theme` in step with YouTube's theme, which can change live.
export function followTheme(host) {
  hosts.add(host);
  host.dataset.ytTheme = youtubeTheme();
  if (observer) return;
  observer = new MutationObserver(applyAll);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["dark"],
  });
}
