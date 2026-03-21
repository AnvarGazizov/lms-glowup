import type { PlasmoCSConfig } from "plasmo"

import { getPrefs, onPrefsChanged } from "~lib/storage"
import { applyTheme } from "~lib/theme-engine"

export const config: PlasmoCSConfig = {
  matches: ["https://*.brightspacedemo.com/*", "https://*.brightspace.com/*"],
  run_at: "document_start"
}

async function init() {
  const prefs = await getPrefs()
  applyTheme(prefs)

  onPrefsChanged((updated) => {
    applyTheme(updated)
  })
}

init()
