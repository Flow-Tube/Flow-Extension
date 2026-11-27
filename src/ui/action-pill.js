import { createInlineHost } from "./shadow-host.js";
import { flowMarkIcon } from "./icons.js";

const HOST_ID = "flow-ext-action-pill";
const HOST_CSS =
  "all: initial; display: inline-flex; margin-left: 8px; vertical-align: top;";
const ROW_SELECTOR = "ytd-watch-metadata #top-level-buttons-computed";
// YouTube drops the labels from its own buttons when the row runs out of room.
const ICON_ONLY_SELECTOR = "yt-button-view-model button.ytSpecButtonShapeNextIconButton";

// Takes the height and label style of YouTube's own buttons in the row, which change by layout.
function sync(host, row) {
  const compact = !!row.querySelector(ICON_ONLY_SELECTOR);
  host.shadowRoot.querySelector(".flow-pill").classList.toggle("is-compact", compact);
  const height = row.querySelector("button")?.getBoundingClientRect().height;
  if (height) host.style.setProperty("--flow-pill-h", `${Math.round(height)}px`);
}

// "Open in Flow" in YouTube's actions row, next to Share. Removed when `enabled` is false.
export function syncActionPill(enabled, onWatch) {
  const existing = document.getElementById(HOST_ID);
  const row = enabled ? document.querySelector(ROW_SELECTOR) : null;
  if (!row) {
    existing?.remove();
    return;
  }
  if (existing?.parentElement === row) {
    sync(existing, row);
    return;
  }
  existing?.remove();

  const { host, root } = createInlineHost(HOST_ID, HOST_CSS);
  const pill = document.createElement("button");
  pill.type = "button";
  pill.className = "flow-pill";
  pill.setAttribute("aria-label", "Open in Flow");
  pill.title = "Open in Flow";
  pill.innerHTML = `${flowMarkIcon}<span class="flow-pill__label">Open in Flow</span>`;
  pill.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onWatch();
  });
  root.appendChild(pill);
  row.appendChild(host);
  sync(host, row);
}
