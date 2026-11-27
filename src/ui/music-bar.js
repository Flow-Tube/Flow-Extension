import { createInlineHost } from "./shadow-host.js";
import { downloadIcon, flowIcon } from "./icons.js";

const HOST_ID = "flow-ext-music-bar";
const CONTROLS_SELECTOR = "ytmusic-player-bar .right-controls-buttons";

function iconButton(label, icon, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "flow-music-btn";
  button.setAttribute("aria-label", label);
  button.title = label;
  button.innerHTML = icon;
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onClick();
  });
  return button;
}

// Flow and Download at the start of YouTube Music's player bar controls, before volume.
// mode: "both" | "watch" | "off", the same setting as the video player's buttons.
export function syncMusicBar(mode, { onWatch, onDownload }) {
  const existing = document.getElementById(HOST_ID);
  const controls = mode === "off" ? null : document.querySelector(CONTROLS_SELECTOR);
  if (!controls) {
    existing?.remove();
    return;
  }
  if (existing?.parentElement === controls && existing.dataset.mode === mode) return;
  existing?.remove();

  const { host, root } = createInlineHost(
    HOST_ID,
    "all: initial; display: inline-flex; align-items: center;",
  );
  host.dataset.mode = mode;
  const row = document.createElement("div");
  row.className = "flow-music-bar";
  row.append(iconButton("Play in Flow", flowIcon, onWatch));
  if (mode === "both")
    row.append(iconButton("Download with Flow", downloadIcon, onDownload));
  root.appendChild(row);
  controls.prepend(host);
}
