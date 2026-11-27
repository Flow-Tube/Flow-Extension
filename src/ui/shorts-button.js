import { createInlineHost } from "./shadow-host.js";
import { flowIcon } from "./icons.js";

const HOST_CLASS = "flow-ext-shorts-button";
const BAR_SELECTOR = "reel-action-bar-view-model";

function build(onOpen) {
  const { host, root } = createInlineHost(null, "all: initial; display: block;");
  host.className = HOST_CLASS;
  const wrap = document.createElement("div");
  wrap.className = "flow-shorts";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "flow-shorts__btn";
  button.setAttribute("aria-label", "Open in Flow");
  button.title = "Open in Flow";
  button.innerHTML = flowIcon;
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onOpen();
  });
  const label = document.createElement("span");
  label.className = "flow-shorts__label";
  label.textContent = "Flow";
  wrap.append(button, label);
  root.appendChild(wrap);
  return host;
}

// A Flow button at the end of each Short's action column (like, dislike, comments, share).
export function syncShortsButtons(enabled, onOpen) {
  for (const bar of document.querySelectorAll(BAR_SELECTOR)) {
    const existing = bar.querySelector(`:scope > .${HOST_CLASS}`);
    if (!enabled) existing?.remove();
    else if (!existing) bar.appendChild(build(onOpen));
  }
  if (!enabled) {
    for (const host of document.querySelectorAll(`.${HOST_CLASS}`)) host.remove();
  }
}
