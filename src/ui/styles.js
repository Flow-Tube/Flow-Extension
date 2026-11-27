// Self-contained styles for the Shadow DOM. No YouTube or Flow CSS is imported.
export const STYLES = `
:host { all: initial; }
* { box-sizing: border-box; font-family: "Roboto", system-ui, -apple-system, sans-serif; }


.flow-btn {
  display: inline-flex; align-items: center; gap: 6px;
  height: 36px; padding: 0 14px;
  border: 1px solid rgba(255,255,255,0.16);
  border-radius: 18px;
  background: rgba(255,255,255,0.08);
  color: #f1f1f1;
  font-size: 14px; font-weight: 500; line-height: 1;
  cursor: pointer; white-space: nowrap;
  transition: background .15s ease, border-color .15s ease;
}
.flow-btn:hover { background: rgba(255,255,255,0.16); }
.flow-btn:active { transform: translateY(1px); }
.flow-btn:focus-visible { outline: 2px solid #ff5252; outline-offset: 2px; }
.flow-btn__icon { display: inline-flex; }
.flow-btn__label:empty { display: none; }

/* Buttons inside a thumbnail, like YouTube's own Watch later and Add to queue icons. */
.flow-card { display: flex; gap: 4px; padding: 8px; }
.flow-card .flow-btn--card {
  width: 32px; height: 32px; padding: 0; justify-content: center;
  border: 0; border-radius: 6px;
  background: rgba(0,0,0,0.72); color: #fff;
}
.flow-card .flow-btn--card:hover { background: rgba(0,0,0,0.9); }
.flow-card .flow-btn--card svg { width: 20px; height: 20px; }
.flow-card.is-small { padding: 5px; }
.flow-card.is-small .flow-btn--card { width: 26px; height: 26px; border-radius: 5px; }
.flow-card.is-small .flow-btn--card svg { width: 16px; height: 16px; }
.flow-card.is-live .flow-card__download { display: none; }
/* Beside a YouTube Music song row's menu, like its own icon buttons. */
.flow-card.is-inline { padding: 0; }
.flow-card.is-inline .flow-btn--card { width: 40px; height: 40px; border-radius: 50%; background: transparent; color: #aaa; }
.flow-card.is-inline .flow-btn--card:hover { background: rgba(255,255,255,0.1); color: #fff; }
.flow-card.is-inline .flow-btn--card svg { width: 24px; height: 24px; }

.flow-toasts {
  position: fixed; bottom: 22px; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  pointer-events: none;
}
.flow-toasts.is-music { bottom: 96px; }
.flow-toast {
  display: inline-flex; align-items: center; gap: 12px;
  max-width: 90vw; padding: 10px 16px;
  border-radius: 10px;
  background: #1f1f22; color: #f1f1f1;
  border: 1px solid rgba(255,255,255,0.12);
  font-size: 14px;
  box-shadow: 0 8px 28px rgba(0,0,0,0.4);
  opacity: 0; transform: translateY(8px);
  transition: opacity .2s ease, transform .2s ease;
  pointer-events: auto;
}
.flow-toast.is-visible { opacity: 1; transform: translateY(0); }
.flow-toast--error { border-color: rgba(255,99,99,0.5); }
.flow-toast--success { border-color: rgba(88,214,141,0.45); }
.flow-toast__msg { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.flow-toast__cta {
  flex: none; border: 0; border-radius: 6px; padding: 6px 12px;
  background: #ff0000; color: #fff; font-weight: 600; font-size: 13px; cursor: pointer;
}
.flow-toast__cta:hover { background: #d90000; }

.flow-handoff {
  position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
  display: flex; flex-direction: column; align-items: center; gap: 14px;
  max-width: calc(100vw - 32px); padding: 22px 26px;
  border-radius: 16px;
  background: #1f1f22; color: #f1f1f1;
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: 0 8px 28px rgba(0,0,0,0.4);
  font-size: 15px;
  pointer-events: auto;
}
.flow-handoff__msg { font-weight: 500; }

/* "Open in Flow" in YouTube's actions row, sized and coloured like Share. */
.flow-pill {
  display: inline-flex; align-items: center; gap: 6px;
  height: var(--flow-pill-h, 36px); padding: 0 16px 0 12px;
  border: 0; border-radius: 999px;
  background: rgba(255,255,255,0.1); color: #f1f1f1;
  font-family: "Roboto", "Arial", sans-serif; font-size: 14px; font-weight: 500;
  cursor: pointer; white-space: nowrap;
  transition: background-color .15s ease;
}
.flow-pill svg { width: 24px; height: 24px; flex: none; }
.flow-pill:hover { background: rgba(255,255,255,0.2); }
.flow-pill:focus-visible { outline: 2px solid #3ea6ff; outline-offset: 2px; }
.flow-pill.is-compact { width: var(--flow-pill-h, 36px); padding: 0; justify-content: center; }
.flow-pill.is-compact .flow-pill__label { display: none; }

/* A Short's action column: a 48px tonal circle with its label under it, like Share. */
.flow-shorts { display: flex; flex-direction: column; align-items: center; gap: 4px; margin-top: 16px; }
.flow-shorts__btn {
  width: 48px; height: 48px; border: 0; border-radius: 50%;
  display: grid; place-items: center;
  background: rgba(255,255,255,0.1); color: #f1f1f1; cursor: pointer;
  transition: background-color .15s ease;
}
.flow-shorts__btn:hover { background: rgba(255,255,255,0.2); }
.flow-shorts__btn:focus-visible { outline: 2px solid #3ea6ff; outline-offset: 2px; }
.flow-shorts__btn svg { width: 24px; height: 24px; }
.flow-shorts__label { font-family: "Roboto", "Arial", sans-serif; font-size: 12px; color: #f1f1f1; }

/* YouTube Music's player bar: plain icons in its grey, white on hover. */
.flow-music-bar { display: flex; align-items: center; }
.flow-music-btn {
  width: 40px; height: 40px; border: 0; border-radius: 50%;
  display: grid; place-items: center;
  background: transparent; color: #909090; cursor: pointer;
  transition: color .15s ease, background-color .15s ease;
}
.flow-music-btn:hover { color: #fff; background: rgba(255,255,255,0.1); }
.flow-music-btn:focus-visible { outline: 2px solid #3ea6ff; outline-offset: 2px; }
.flow-music-btn svg { width: 24px; height: 24px; }

/* Inside the player: always on the player's dark ground. */
.flow-notice {
  display: inline-flex; align-items: center; gap: 12px;
  padding: 8px 14px; border-radius: 10px;
  background: rgba(28,28,28,0.9); color: #fff;
  font-size: 14px; font-weight: 500;
  opacity: 0; transform: translateY(6px);
  transition: opacity .2s ease, transform .2s ease;
  pointer-events: auto;
}
.flow-notice.is-visible { opacity: 1; transform: translateY(0); }
.flow-notice--error { box-shadow: inset 0 0 0 1px rgba(255,99,99,0.6); }
.flow-notice__cta { color: #3ea6ff; text-decoration: none; font-weight: 600; }

/* YouTube's light theme (set on the host by ui/theme.js). Card buttons stay dark over the picture. */
:host([data-yt-theme="light"]) .flow-pill { background: rgba(0,0,0,0.05); color: #0f0f0f; }
:host([data-yt-theme="light"]) .flow-pill:hover { background: rgba(0,0,0,0.1); }
:host([data-yt-theme="light"]) .flow-pill:focus-visible { outline-color: #065fd4; }
:host([data-yt-theme="light"]) .flow-shorts__btn { background: rgba(0,0,0,0.05); color: #0f0f0f; }
:host([data-yt-theme="light"]) .flow-shorts__btn:hover { background: rgba(0,0,0,0.1); }
:host([data-yt-theme="light"]) .flow-shorts__label { color: #0f0f0f; }
:host([data-yt-theme="light"]) .flow-handoff { background: #fff; color: #0f0f0f; border-color: rgba(0,0,0,0.12); box-shadow: 0 8px 28px rgba(0,0,0,0.16); }
:host([data-yt-theme="light"]) .flow-btn:not(.flow-btn--card) { color: #0f0f0f; border-color: rgba(0,0,0,0.15); background: rgba(0,0,0,0.05); }
:host([data-yt-theme="light"]) .flow-btn:not(.flow-btn--card):hover { background: rgba(0,0,0,0.1); }
`;
