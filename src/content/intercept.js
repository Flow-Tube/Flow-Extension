import { api } from "../lib/browser.js";
import { LINK_HANDOFF_TIMEOUT_MS } from "../lib/const.js";
import { MSG } from "../lib/messages.js";
import { hasBridgePermission } from "../lib/permissions.js";
import { loadSettings } from "../lib/settings.js";
import { HANDOFF, openLink } from "../bridge/index.js";
import { holdPage } from "../ui/handoff-card.js";
import { toast } from "../ui/toast.js";
import { cameFromYoutube, isFlowLink } from "./link-target.js";

// "Open YouTube links in Flow": runs at document_start, so it only ever sees full page loads.
// Moving around inside YouTube never reloads the page, so browsing youtube.com stays here.

const WATCH_HERE_KEY = "flow-watch-here";

function watchingHere() {
  try {
    return sessionStorage.getItem(WATCH_HERE_KEY) === "1";
  } catch {
    return false;
  }
}

function keepWatchingHere() {
  try {
    sessionStorage.setItem(WATCH_HERE_KEY, "1");
  } catch {
    // Without storage the choice lasts for this page only.
  }
}

// A reload, Back or Forward stays here, so a page the user came back to never bounces again.
function arrivedByLink() {
  return (
    (performance.getEntriesByType?.("navigation")[0]?.type ?? "navigate") === "navigate"
  );
}

function wantsFlow() {
  return (
    arrivedByLink() &&
    !cameFromYoutube(document.referrer) &&
    !watchingHere() &&
    isFlowLink(new URL(location.href))
  );
}

// Back to the page the link was on, or close a tab that was opened just for the link.
function leave() {
  if (history.length > 1) history.back();
  else api.runtime.sendMessage({ type: MSG.CLOSE_TAB }).catch(() => {});
}

async function start() {
  if (!wantsFlow()) return;
  const settings = await loadSettings();
  if (!settings.openLinksInFlow) return;

  let watchHere = false;
  const page = holdPage({
    onWatchHere: () => {
      watchHere = true;
      keepWatchingHere();
      page.release();
    },
  });

  const result = await openLink(location.href, {
    ports: settings.ports,
    silent: settings.silentMode && (await hasBridgePermission()),
    timeout: LINK_HANDOFF_TIMEOUT_MS,
  });
  if (watchHere) return;
  if (result !== HANDOFF.NOT_INSTALLED) {
    leave();
    return;
  }
  page.release();
  toast({ message: "Flow didn't open this link, so it plays here", variant: "error" });
}

start();
