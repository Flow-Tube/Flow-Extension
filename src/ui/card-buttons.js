import { createInlineHost } from "./shadow-host.js";
import { createButton } from "./button.js";
import { downloadIcon, flowIcon } from "./icons.js";
import {
  CARD_SELECTOR,
  CARD_THUMB_SELECTOR,
  LIVE_BADGE_RE,
  SONG_ROW_MENU_SELECTOR,
  SONG_ROW_SELECTOR,
} from "../extract/selectors.js";
import { idFromCard, shortsUrlFromCard } from "../extract/video-id.js";

const HOST_CLASS = "flow-ext-card-buttons";
// Smaller buttons on small thumbnails: sidebar, search rows, playlist rows.
const SMALL_BELOW_PX = 260;
const THUMB_HOST_CSS =
  "all: initial; position: absolute; top: 0; left: 0; z-index: 5; display: none;";
const INLINE_HOST_CSS =
  "all: initial; display: none; align-items: center; margin-right: 4px;";

const prepared = new WeakSet();
let handlers = null;
let enabled = false;
let listening = false;

function isLive(card) {
  const badges = card.querySelectorAll(
    "badge-shape, .badge-shape-wiz, ytd-badge-supported-renderer",
  );
  return [...badges].some((badge) => LIVE_BADGE_RE.test(badge.textContent.trim()));
}

// Where a card's buttons go: inside its thumbnail, or beside a song row's menu, since a
// YouTube Music cover carries its own play button.
function placement(card) {
  if (card.matches(SONG_ROW_SELECTOR)) {
    const menu = card.querySelector(SONG_ROW_MENU_SELECTOR);
    return menu ? { inline: true, parent: card, before: menu } : null;
  }
  const thumb = card.querySelector(CARD_THUMB_SELECTOR);
  return thumb ? { inline: false, parent: thumb, before: null } : null;
}

function hostIn(parent) {
  const children = [...parent.children];
  return children.find((child) => child.classList?.contains(HOST_CLASS)) ?? null;
}

function watchButton(card) {
  return createButton({
    icon: flowIcon,
    variant: "card",
    title: "Watch in Flow",
    onClick: () => {
      const shortsUrl = shortsUrlFromCard(card);
      if (shortsUrl) {
        handlers.onOpen(shortsUrl);
        return;
      }
      const id = idFromCard(card);
      if (id) handlers.onWatch(id);
    },
  });
}

function downloadButton(card) {
  const button = createButton({
    icon: downloadIcon,
    variant: "card",
    title: "Download with Flow",
    onClick: () => {
      const id = idFromCard(card);
      if (id) handlers.onDownload(id);
    },
  });
  button.classList.add("flow-card__download");
  return button;
}

function buildHost(card, { inline, parent, before }) {
  const { host, root } = createInlineHost(
    null,
    inline ? INLINE_HOST_CSS : THUMB_HOST_CSS,
  );
  host.className = HOST_CLASS;
  host.dataset.display = inline ? "flex" : "block";

  const row = document.createElement("div");
  row.className = inline ? "flow-card is-inline" : "flow-card";
  // A song row is too short for two buttons; Download stays in the right-click menu.
  row.append(watchButton(card));
  if (!inline) row.append(downloadButton(card));
  root.appendChild(row);

  if (before) {
    before.before(host);
  } else {
    if (getComputedStyle(parent).position === "static")
      parent.style.position = "relative";
    parent.appendChild(host);
  }
  return host;
}

// Shows the card's buttons, building them on the card's first hover. YouTube reuses card
// elements for other videos, so everything about the video is read again here and on click.
function show(card) {
  if (!enabled || !idFromCard(card)) return;
  const place = placement(card);
  if (!place) return;
  const host = hostIn(place.parent) ?? buildHost(card, place);
  const row = host.shadowRoot.querySelector(".flow-card");
  row.classList.toggle(
    "is-small",
    place.parent.getBoundingClientRect().width < SMALL_BELOW_PX,
  );
  row.classList.toggle("is-live", isLive(card));
  host.style.display = host.dataset.display;
}

function hide(card) {
  const place = placement(card);
  const host = place && hostIn(place.parent);
  if (host) host.style.display = "none";
}

function onMouseOver(event) {
  if (!enabled || !(event.target instanceof Element)) return;
  const card = event.target.closest(CARD_SELECTOR);
  if (!card || prepared.has(card)) return;
  prepared.add(card);
  card.addEventListener("mouseenter", () => show(card));
  card.addEventListener("mouseleave", () => hide(card));
  show(card);
}

export function initCardButtons(nextHandlers) {
  handlers = nextHandlers;
  if (listening) return;
  listening = true;
  document.addEventListener("mouseover", onMouseOver, { passive: true });
}

export function setCardButtonsEnabled(value) {
  enabled = value;
  if (!enabled) {
    for (const host of document.querySelectorAll(`.${HOST_CLASS}`))
      host.style.display = "none";
  }
}
