import { createInlineHost } from "./shadow-host.js";
import { PLAYER_SELECTOR } from "../extract/selectors.js";

const HOST_ID = "flow-ext-player-notice";
const HOST_CSS =
  "all: initial; position: absolute; left: 12px; bottom: 72px; z-index: 60; pointer-events: none;";
const SHOW_MS = 2500;

let hideTimer;

// A short notice inside the player, where SponsorBlock shows its skip notices. Returns false
// when there is no player to show it in, so the caller can fall back to a toast.
export function showPlayerNotice({ message, variant = "info", cta }) {
  const player = document.querySelector(PLAYER_SELECTOR);
  if (!player) return false;

  document.getElementById(HOST_ID)?.remove();
  const { host, root } = createInlineHost(HOST_ID, HOST_CSS);
  const el = document.createElement("div");
  el.className = `flow-notice flow-notice--${variant}`;
  el.setAttribute("role", "status");
  const text = document.createElement("span");
  text.textContent = message;
  el.appendChild(text);
  if (cta) {
    const link = document.createElement("a");
    link.className = "flow-notice__cta";
    link.href = cta.href;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = cta.label;
    el.appendChild(link);
  }
  root.appendChild(el);
  player.appendChild(host);
  requestAnimationFrame(() => el.classList.add("is-visible"));

  clearTimeout(hideTimer);
  hideTimer = setTimeout(
    () => {
      el.classList.remove("is-visible");
      setTimeout(() => host.remove(), 220);
    },
    cta ? SHOW_MS * 2 : SHOW_MS,
  );
  return true;
}
