import { api } from "../lib/browser.js";
import { MSG, ACTION } from "../lib/messages.js";
import { MUSIC_HOST } from "../lib/const.js";
import { idFromWatchUrl, currentWatchId } from "../extract/video-id.js";
import { currentTimeSeconds } from "../extract/player.js";
import { toast } from "../ui/toast.js";

const TITLE_SELECTORS = [
  "ytmusic-player-bar .title",
  "ytd-watch-metadata h1",
  "yt-shorts-video-title-view-model",
];

function currentTitle() {
  for (const selector of TITLE_SELECTORS) {
    const text = document.querySelector(selector)?.textContent?.trim();
    if (text) return text;
  }
  return document.title.replace(/ - YouTube( Music)?$/, "");
}

// What this tab is playing, for the popup's current-tab card.
function tabState() {
  const id = currentWatchId();
  if (!id) return { id: null };
  const kind =
    location.host === MUSIC_HOST
      ? "song"
      : location.pathname.startsWith("/shorts/")
        ? "short"
        : "video";
  return { id, kind, title: currentTitle(), time: currentTimeSeconds() };
}

// Handles handoffs from the context menu and the popup, and the popup's question about the tab.
export function listenForContextMenu(actions) {
  api.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg?.type === MSG.TAB_STATE) {
      sendResponse(tabState());
      return false;
    }
    if (msg?.type !== MSG.HANDOFF) return false;

    const id = idFromWatchUrl(msg.src) || currentWatchId();
    if (!id) {
      toast({ message: "No YouTube video found here", variant: "error" });
      return false;
    }

    if (msg.action === ACTION.DOWNLOAD) actions.download(id);
    else actions.watch(id);
    return false;
  });
}
