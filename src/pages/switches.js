const CHECK =
  '<svg class="switch__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
const X =
  '<svg class="switch__x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';

// Wraps every settings checkbox in the M3E switch markup, so the pages keep plain inputs.
export function renderSwitches(root = document) {
  for (const input of root.querySelectorAll("input[type=checkbox][data-setting]")) {
    if (input.parentElement?.classList.contains("switch")) continue;
    input.setAttribute("role", "switch");
    const wrap = document.createElement("span");
    wrap.className = "switch";
    const track = document.createElement("span");
    track.className = "switch__track";
    track.innerHTML = `<span class="switch__handle">${CHECK}${X}</span>`;
    input.replaceWith(wrap);
    wrap.append(input, track);
  }
}
