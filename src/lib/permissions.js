import { api } from "./browser.js";
import { MSG } from "./messages.js";

const BRIDGE_ORIGINS = ["http://127.0.0.1/*", "http://localhost/*"];

export async function hasBridgePermission() {
  try {
    if (!api.permissions) {
      return (await api.runtime.sendMessage({ type: MSG.BRIDGE_ALLOWED })) === true;
    }
    return await api.permissions.contains({ origins: BRIDGE_ORIGINS });
  } catch {
    return false;
  }
}

export async function requestBridgePermission() {
  try {
    return await api.permissions.request({ origins: BRIDGE_ORIGINS });
  } catch {
    return false;
  }
}
