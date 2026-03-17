import { supabase } from "~lib/supabase"

export {}

chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  if (message.type !== "AUTH_SESSION") return

  supabase.auth
    .setSession({
      access_token: message.accessToken,
      refresh_token: message.refreshToken,
    })
    .then(({ error }) => {
      sendResponse({ success: !error })
    })

  return true
})
