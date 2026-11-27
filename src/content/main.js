import { loadSettings, onSettingsChanged } from "../lib/settings.js";
import { MUSIC_HOST } from "../lib/const.js";
import { currentWatchId } from "../extract/video-id.js";
import { currentTimeSeconds } from "../extract/player.js";
import { VIDEO_EL_SELECTOR } from "../extract/selectors.js";
import { syncPlayerButtons } from "../ui/player-buttons.js";
import { syncActionPill } from "../ui/action-pill.js";
import { showPlayerNotice } from "../ui/player-notice.js";
import { toast } from "../ui/toast.js";
import { initOverlay, setOverlayEnabled } from "../ui/overlay.js";
import { formatTime } from "../shared/time.js";
import { onNavigate } from "./navigation.js";
import { createActions } from "./actions.js";
import { listenForContextMenu } from "./messaging.js";
import { log } from "../lib/log.js";

let settings;
const actions = createActions(() => settings);

// Shows a handoff's outcome inside the player, with the second it starts at; the page toast
// when there is no player.
function inPlayer(seconds) {
  return ({ message, variant, cta }) => {
    const at = seconds > 0 && variant !== "error" ? ` at ${formatTime(seconds)}` : "";
    const text = `${message.replace(/…$/, "")}${at}`;
    if (!showPlayerNotice({ message: text, variant, cta }))
      toast({ message, variant, cta });
  };
}

function watchFromPlayer() {
  const id = currentWatchId();
  if (!id) return;
  const seconds = settings.includeTimestamp ? currentTimeSeconds() : 0;
  document.querySelector(VIDEO_EL_SELECTOR)?.pause();
  actions.watch(id, inPlayer(seconds));
}

function downloadFromPlayer() {
  const id = currentWatchId();
  if (id) actions.download(id, inPlayer(0));
}

function render() {
  const onVideoPage = location.host !== MUSIC_HOST && location.pathname === "/watch";
  syncPlayerButtons(onVideoPage ? settings.playerButtons : "off", {
    onWatch: watchFromPlayer,
    onDownload: downloadFromPlayer,
  });
  syncActionPill(
    onVideoPage && settings.actionPill && !!currentWatchId(),
    watchFromPlayer,
  );
}

async function start() {
  settings = await loadSettings();

  initOverlay({
    onWatch: (id) => actions.watch(id),
    onDownload: (id) => actions.download(id),
  });
  setOverlayEnabled(settings.overlayOnThumbnails);

  listenForContextMenu(actions);

  onNavigate(render);
  onSettingsChanged((next) => {
    settings = next;
    setOverlayEnabled(settings.overlayOnThumbnails);
    render();
  });

  render();
  log("content script ready");
}

start();
