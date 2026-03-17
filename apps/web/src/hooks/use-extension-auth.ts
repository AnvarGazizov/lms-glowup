"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

const EXTENSION_ID =
  process.env.NEXT_PUBLIC_EXTENSION_ID || "your-chrome-extension-id-here"

type ExtensionAuthStatus =
  | "idle"
  | "sending"
  | "success"
  | "no_session"
  | "extension_not_found"

export function useExtensionAuth({ enabled = true }: { enabled?: boolean } = {}) {
  const [status, setStatus] = useState<ExtensionAuthStatus>("idle")

  useEffect(() => {
    if (!enabled) return
    if (typeof chrome === "undefined" || !chrome.runtime?.sendMessage) {
      setStatus("extension_not_found")
      return
    }

    setStatus("sending")

    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setStatus("no_session")
        return
      }

      try {
        chrome.runtime.sendMessage(
          EXTENSION_ID,
          {
            type: "AUTH_SESSION",
            accessToken: session.access_token,
            refreshToken: session.refresh_token,
          },
          (response) => {
            if (chrome.runtime.lastError || !response?.success) {
              setStatus("extension_not_found")
              return
            }
            setStatus("success")
          }
        )
      } catch {
        setStatus("extension_not_found")
      }
    })
  }, [enabled])

  return status
}
