import { FLOATING_HOST_ID, floatingRoot } from "./shadow-host.js";

const HIDE_PAGE = `body > :not(#${FLOATING_HOST_ID}) { visibility: hidden !important; }`;

// Keeps a YouTube page from showing or playing while its link goes to Flow, with a card
// that lets this tab keep watching in the browser instead.
export function holdPage({ onWatchHere }) {
  const style = document.createElement("style");
  style.textContent = HIDE_PAGE;
  document.documentElement.appendChild(style);

  const pause = (event) => event.target.pause?.();
  document.addEventListener("play", pause, true);

  const card = document.createElement("div");
  card.className = "flow-handoff";
  card.setAttribute("role", "status");

  const msg = document.createElement("span");
  msg.className = "flow-handoff__msg";
  msg.textContent = "Opening in Flow…";
  card.appendChild(msg);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "flow-btn";
  button.textContent = "Watch here instead";
  button.addEventListener("click", onWatchHere);
  card.appendChild(button);

  floatingRoot().appendChild(card);

  return {
    release() {
      style.remove();
      document.removeEventListener("play", pause, true);
      card.remove();
    },
  };
}
