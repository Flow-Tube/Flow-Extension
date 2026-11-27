import { api } from "./browser.js";
import { BRIDGE_PORTS } from "./const.js";

const KEY = "settings";

export const PLAYER_BUTTONS = ["both", "watch", "off"];

export const DEFAULT_SETTINGS = {
  overlayOnThumbnails: true,
  // "both" | "watch" | "off": Flow's buttons in the player's controls.
  playerButtons: "both",
  actionPill: true,
  silentMode: true,
  includeTimestamp: true,
  musicAsMusic: true,
  openLinksInFlow: false,
  ports: BRIDGE_PORTS,
};

function merge(stored) {
  const settings = { ...DEFAULT_SETTINGS, ...(stored ?? {}) };
  // 1.x kept the watch-page bar under `watchPageRow`; the pill that replaced it keeps that choice.
  if (
    stored &&
    stored.actionPill === undefined &&
    typeof stored.watchPageRow === "boolean"
  ) {
    settings.actionPill = stored.watchPageRow;
  }
  delete settings.watchPageRow;
  if (!PLAYER_BUTTONS.includes(settings.playerButtons)) {
    settings.playerButtons = DEFAULT_SETTINGS.playerButtons;
  }
  return settings;
}

export async function loadSettings() {
  const stored = await api.storage.sync.get(KEY);
  return merge(stored?.[KEY]);
}

export async function saveSettings(patch) {
  const next = { ...(await loadSettings()), ...patch };
  await api.storage.sync.set({ [KEY]: next });
  return next;
}

export function onSettingsChanged(callback) {
  const handler = (changes, area) => {
    if (area === "sync" && changes[KEY]) callback(merge(changes[KEY].newValue));
  };
  api.storage.onChanged.addListener(handler);
  return () => api.storage.onChanged.removeListener(handler);
}
