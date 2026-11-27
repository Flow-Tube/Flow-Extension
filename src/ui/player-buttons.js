import { ensurePageStyle } from "./page-style.js";
import { downloadIcon, flowIcon } from "./icons.js";

const WATCH_ID = "flow-player-watch";
const DOWNLOAD_ID = "flow-player-download";

const sized = (icon) => icon.replace('width="16" height="16"', 'width="24" height="24"');

// The player's right-hand controls, as SponsorBlock finds them: the last one on the page that
// isn't Home's hover preview. YouTube's newer player splits them in two; ours go in the first half.
function controlsContainer() {
  const all = [...document.querySelectorAll(".ytp-right-controls")].filter(
    (el) => !el.closest("#inline-preview-player"),
  );
  const controls = all[all.length - 1];
  return controls ? controls.querySelector(".ytp-right-controls-left") || controls : null;
}

function makeButton(id, label, icon, onClick) {
  const button = document.createElement("button");
  button.id = id;
  button.type = "button";
  button.className = "ytp-button flow-player-btn";
  button.setAttribute("aria-label", label);
  // YouTube's own tooltip only knows its own buttons, so ours use the browser's, as SponsorBlock does.
  button.title = label;
  button.innerHTML = sized(icon);
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    onClick();
  });
  return button;
}

// Puts Flow's buttons at the start of the player's right-hand controls, or takes them away.
// mode: "both" | "watch" | "off". Safe to call on every page change.
export function syncPlayerButtons(mode, { onWatch, onDownload }) {
  const wantWatch = mode === "both" || mode === "watch";
  const wantDownload = mode === "both";
  const container = wantWatch ? controlsContainer() : null;

  let watch = document.getElementById(WATCH_ID);
  let download = document.getElementById(DOWNLOAD_ID);
  if (!container) {
    watch?.remove();
    download?.remove();
    return;
  }
  ensurePageStyle();

  if (!watch || watch.parentElement !== container) {
    watch?.remove();
    watch = makeButton(WATCH_ID, "Watch in Flow", flowIcon, onWatch);
    container.prepend(watch);
  }
  if (!wantDownload) {
    download?.remove();
  } else if (!download || download.parentElement !== container) {
    download?.remove();
    download = makeButton(DOWNLOAD_ID, "Download with Flow", downloadIcon, onDownload);
    watch.after(download);
  }
}
