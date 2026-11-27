import { api } from "../lib/browser.js";
import { bindSettingToggles } from "../lib/bind-settings.js";
import { findRunning } from "../bridge/ping.js";
import { hasBridgePermission, requestBridgePermission } from "../lib/permissions.js";
import { FLOW_RELEASE_URL } from "../lib/const.js";
import { ACTION, MSG } from "../lib/messages.js";
import { downloadIcon, flowIcon } from "../ui/icons.js";
import { renderSwitches } from "../pages/switches.js";
import { formatTime } from "../shared/time.js";

const statusEl = document.getElementById("status");
const accessCard = document.getElementById("access-card");

document.getElementById("version").textContent = `v${api.runtime.getManifest().version}`;

function setStatus(kind, text) {
  statusEl.className = `status status--${kind}`;
  statusEl.textContent = text;
}

async function refreshStatus(settings) {
  const allowed = await hasBridgePermission();
  accessCard.hidden = allowed || !settings.silentMode;
  if (!allowed) {
    setStatus("unknown", "Status needs local access");
    return;
  }
  setStatus("unknown", "Checking…");
  const running = await findRunning(settings.ports);
  if (running)
    setStatus(
      "ok",
      running.version ? `Connected · Flow ${running.version}` : "Connected",
    );
  else setStatus("off", "Flow isn't running");
}

const KIND_LABEL = { video: "Video", short: "Short", song: "Song" };

// The video, Short or song on the active tab, with buttons that send it to Flow.
async function showTabCard() {
  const [tab] = await api.tabs.query({ active: true, currentWindow: true });
  if (tab?.id == null) return;
  let state;
  try {
    state = await api.tabs.sendMessage(tab.id, { type: MSG.TAB_STATE });
  } catch {
    return;
  }
  if (!state?.id) return;

  const at = state.time > 0 ? ` · ${formatTime(state.time)}` : "";
  document.getElementById("tab-label").textContent =
    `On this tab · ${KIND_LABEL[state.kind] ?? "Video"}${at}`;
  document.getElementById("tab-title").textContent = state.title || "";

  const send = (action) => {
    api.tabs
      .sendMessage(tab.id, { type: MSG.HANDOFF, action, src: tab.url })
      .catch(() => {});
    window.close();
  };
  const watch = document.getElementById("tab-watch");
  watch.innerHTML = `${flowIcon}<span>Watch in Flow</span>`;
  watch.addEventListener("click", () => send(ACTION.WATCH));
  const download = document.getElementById("tab-download");
  download.innerHTML = `${downloadIcon}<span>Download</span>`;
  download.addEventListener("click", () => send(ACTION.DOWNLOAD));
  document.getElementById("tab-card").hidden = false;
}

document.getElementById("get-flow").href = FLOW_RELEASE_URL;
document.getElementById("open-options").addEventListener("click", () => {
  api.runtime.openOptionsPage();
  window.close();
});

renderSwitches();

(async () => {
  const settings = await bindSettingToggles(document, {
    silentMode: {
      onEnable: async () =>
        (await hasBridgePermission()) ? true : requestBridgePermission(),
      onChange: refreshStatus,
    },
  });
  document.getElementById("grant").addEventListener("click", async () => {
    await requestBridgePermission();
    refreshStatus(settings);
  });
  refreshStatus(settings);
  showTabCard();
})();
