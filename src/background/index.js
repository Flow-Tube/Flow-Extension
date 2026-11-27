import { api } from "../lib/browser.js";
import { MSG } from "../lib/messages.js";
import { createMenus, menuAction } from "./context-menus.js";
import { hasBridgePermission } from "../lib/permissions.js";

// MV3 service workers are ephemeral — (re)create menus on both events.
api.runtime.onInstalled.addListener((details) => {
  createMenus();
  if (details.reason === "install") api.runtime.openOptionsPage?.();
});
api.runtime.onStartup.addListener(createMenus);

// Delegate to the content script so the bridge + focus detection run in the page.
api.contextMenus.onClicked.addListener((info, tab) => {
  const action = menuAction(info.menuItemId);
  const src = info.linkUrl || info.pageUrl || tab?.url || "";
  if (tab?.id != null) {
    api.tabs.sendMessage(tab.id, { type: MSG.HANDOFF, action, src }).catch(() => {});
  }
});

api.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === MSG.BRIDGE_ALLOWED) {
    hasBridgePermission().then(sendResponse);
    return true;
  }
  return false;
});
