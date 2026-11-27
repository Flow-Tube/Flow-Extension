const STYLE_ID = "flow-ext-page-style";

// Styles for elements that live in YouTube's own DOM (player buttons), where a shadow root
// would lose YouTube's control classes.
const CSS = `
.flow-player-btn { display: inline-flex; align-items: center; justify-content: center; }
.flow-player-btn svg { width: 24px; height: 24px; pointer-events: none; }
#movie_player.ad-showing .flow-player-btn,
.ytp-miniplayer-ui .flow-player-btn { display: none !important; }
`;

export function ensurePageStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = CSS;
  (document.head || document.documentElement).appendChild(style);
}
