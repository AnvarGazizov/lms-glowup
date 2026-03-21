import type { PlasmoCSConfig } from "plasmo"

import { applyTheme } from "~lib/theme-engine"
import { getPrefs, onPrefsChanged } from "~lib/storage"
import { supabase } from "~lib/supabase"

export const config: PlasmoCSConfig = {
  matches: ["https://*.brightspacedemo.com/*", "https://*.brightspace.com/*"],
  run_at: "document_start"
}

async function init() {
  const prefs = await getPrefs()
  const { data: { session } } = await supabase.auth.getSession()
  applyTheme(prefs, !!session)

  onPrefsChanged((updated) => {
    void supabase.auth.getSession().then(({ data: { session: s } }) => {
      applyTheme(updated, !!s)
    })
  })

  supabase.auth.onAuthStateChange((_event, session) => {
    void getPrefs().then((p) => applyTheme(p, !!session))
  })
}

init()
