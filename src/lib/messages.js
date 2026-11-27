export const MSG = {
  HANDOFF: "flow-handoff",
  // Content scripts have no permissions API, so they ask the background worker.
  BRIDGE_ALLOWED: "flow-bridge-allowed",
  // A tab whose link went to Flow, with no page of its own to go back to.
  CLOSE_TAB: "flow-close-tab",
  // The popup asking what the tab is playing.
  TAB_STATE: "flow-tab-state",
};

export const ACTION = {
  WATCH: "watch",
  DOWNLOAD: "download",
  MUSIC: "music",
  MUSIC_DOWNLOAD: "music-download",
};
