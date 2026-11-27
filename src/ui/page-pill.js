import { createInlineHost } from "./shadow-host.js";
import { flowMarkIcon } from "./icons.js";

const HOST_ID = "flow-ext-page-pill";
const PANEL_HOST_ID = "flow-ext-panel-pill";

const HEADER_ACTIONS = "yt-page-header-view-model yt-flexible-actions-view-model";

// Where "Open in Flow" goes on each page. The first one whose test passes is used.
const PLACES = [
  // Playlist headers: a full row that doesn't wrap, so a round button before the ⋮ menu.
  // Narrow layouts wrap that row in a column; the button goes in the row.
  {
    test: () => location.pathname === "/playlist",
    selector: `${HEADER_ACTIONS} .ytFlexibleActionsViewModelActionRow`,
    before: ":scope > :last-child",
    compact: true,
  },
  {
    test: () => location.pathname === "/playlist",
    selector: HEADER_ACTIONS,
    before: ":scope > :last-child",
    compact: true,
  },
  // Channel headers: a labelled pill after Subscribe.
  { selector: HEADER_ACTIONS, compact: false },
  // YouTube Music album, playlist and artist headers: before the ⋮ menu.
  {
    selector: "ytmusic-responsive-header-renderer .action-buttons",
    before: ":scope > ytmusic-menu-renderer",
    compact: true,
    music: true,
  },
];

// YouTube keeps hidden copies of some headers for other layouts; only the shown one counts.
function visible(selector) {
  return (
    [...document.querySelectorAll(selector)].find((el) => el.getClientRects().length) ??
    null
  );
}

function build(id, { compact, music }, onOpen) {
  const { host, root } = createInlineHost(
    id,
    `all: initial; display: inline-flex; align-items: center; margin: 0 ${music ? 8 : 0}px 0 8px;`,
  );
  const pill = document.createElement("button");
  pill.type = "button";
  pill.className = compact ? "flow-pill is-compact" : "flow-pill";
  pill.setAttribute("aria-label", "Open in Flow");
  pill.title = "Open in Flow";
  pill.innerHTML = `${flowMarkIcon}<span class="flow-pill__label">Open in Flow</span>`;
  pill.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onOpen();
  });
  root.appendChild(pill);
  host.style.setProperty("--flow-pill-h", "40px");
  return host;
}

function place(id, spot, onOpen) {
  const container = visible(spot.selector);
  const existing = document.getElementById(id);
  if (!container) {
    existing?.remove();
    return;
  }
  if (existing && container.contains(existing)) return;
  existing?.remove();
  const host = build(id, spot, onOpen);
  const before = spot.before && container.querySelector(spot.before);
  if (before) before.before(host);
  else container.appendChild(host);
}

// "Open in Flow" on playlist, channel and YouTube Music headers. `onOpen` gets the page's
// own link, which Flow Desktop turns into the matching page.
export function syncPagePill(enabled, onOpen) {
  const spot = enabled
    ? PLACES.find((p) => (p.test?.() ?? true) && visible(p.selector))
    : null;
  if (!spot) {
    document.getElementById(HOST_ID)?.remove();
    return;
  }
  place(HOST_ID, spot, () => onOpen(location.href));
}

// The same pill in the watch page's playlist panel, opening that playlist.
export function syncPanelPill(listId, onOpen) {
  const spot = {
    selector: "ytd-playlist-panel-renderer #playlist-actions",
    compact: true,
  };
  if (!listId) {
    document.getElementById(PANEL_HOST_ID)?.remove();
    return;
  }
  place(PANEL_HOST_ID, spot, () =>
    onOpen(`https://www.youtube.com/playlist?list=${listId}`),
  );
}
