import { handoff } from "../bridge/index.js";
import { toast } from "../ui/toast.js";
import { hasBridgePermission } from "../lib/permissions.js";
import { watchAction, downloadAction, watchParams, downloadParams } from "./params.js";

// getSettings is a live getter so actions always read the latest settings.
export function createActions(getSettings) {
  async function silentAllowed(settings) {
    return settings.silentMode && (await hasBridgePermission());
  }

  // `notify` shows the outcome; the page toast unless the caller has a better place for it.
  async function run(action, params, settings, notify) {
    return handoff(action, params, {
      ports: settings.ports,
      silent: await silentAllowed(settings),
      toast: notify,
    });
  }

  return {
    watch(id, notify = toast) {
      const settings = getSettings();
      return run(watchAction(settings), watchParams(id, settings), settings, notify);
    },
    // A whole YouTube link, such as a Short, which Flow opens on the right page.
    open(url, notify = toast) {
      return run("open", { url }, getSettings(), notify);
    },
    download(id, notify = toast) {
      const settings = getSettings();
      return run(downloadAction(settings), downloadParams(id), settings, notify);
    },
  };
}
