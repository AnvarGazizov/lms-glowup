import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"

import styleText from "data-text:./theme-panel.css"
import { getPrefs, setPrefs, onPrefsChanged } from "~lib/storage"
import type { ThemePreferences } from "~lib/storage"
import { supabase } from "~lib/supabase"
import { WEB_APP_LOGIN_REDIRECT_URL } from "~lib/web-app-url"
import { THEMES } from "~themes"

export const config: PlasmoCSConfig = {
  matches: ["https://*.brightspacedemo.com/*", "https://*.brightspace.com/*"]
}

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

function Toggle({
  checked,
  onChange
}: {
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="glowup-toggle">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="glowup-toggle-track" />
    </label>
  )
}

function ThemePanel() {
  const [open, setOpen] = useState(false)
  const [prefs, setLocalPrefs] = useState<ThemePreferences | null>(null)
  const [customDraft, setCustomDraft] = useState("")
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    getPrefs().then((p) => {
      setLocalPrefs(p)
      setCustomDraft(p.customCSS)
    })

    const unsubscribe = onPrefsChanged((p) => {
      setLocalPrefs(p)
      setCustomDraft(p.customCSS)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setAuthLoading(false)
      }
    )

    const onStorageChange = () => {
      supabase.auth.getUser().then(({ data }) => setUser(data.user))
    }
    chrome.storage.onChanged.addListener(onStorageChange)
    return () => {
      subscription.unsubscribe()
      chrome.storage.onChanged.removeListener(onStorageChange)
    }
  }, [])

  if (!prefs) return null

  const selectTheme = (id: string) => {
    setPrefs({ activeTheme: id })
  }

  const toggleFeature = (
    key: keyof ThemePreferences["enabledFeatures"],
    value: boolean
  ) => {
    setPrefs({
      enabledFeatures: { ...prefs.enabledFeatures, [key]: value }
    })
  }

  const saveCustomCSS = () => {
    setPrefs({ customCSS: customDraft })
  }

  const openSignIn = () => {
    window.open(
      WEB_APP_LOGIN_REDIRECT_URL,
      "_blank",
      "noopener,noreferrer"
    )
  }

  return (
    <>
      <button
        className="glowup-fab"
        onClick={() => setOpen(!open)}
        title="LMS Glowup Settings"
      >
        {open ? "\u2715" : "\u2728"}
      </button>

      {open && (
        <div className="glowup-panel">
          <div className="glowup-panel-header">
            <span className="glowup-panel-title">LMS Glowup</span>
            <button
              className="glowup-close-btn"
              onClick={() => setOpen(false)}
            >
              {"\u2715"}
            </button>
          </div>

          <div className="glowup-section">
            <div className="glowup-section-title">Theme</div>
            <div className="glowup-themes">
              {THEMES.filter((t) => t.id !== "custom").map((theme) => (
                <button
                  key={theme.id}
                  className={`glowup-theme-card${prefs.activeTheme === theme.id ? " active" : ""}`}
                  onClick={() => selectTheme(theme.id)}
                >
                  <div className="glowup-theme-card-name">{theme.name}</div>
                  <div className="glowup-theme-card-desc">
                    {theme.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="glowup-section">
            <div className="glowup-section-title">Layout</div>
            {authLoading ? (
              <p className="glowup-sidebar-gate-text">Checking sign-in…</p>
            ) : user ? (
              <div className="glowup-toggle-row">
                <span className="glowup-toggle-label">Sidebar Nav</span>
                <Toggle
                  checked={prefs.enabledFeatures.sidebarNav}
                  onChange={(v) => {
                    toggleFeature("sidebarNav", v)
                    setTimeout(() => window.location.reload(), 300)
                  }}
                />
              </div>
            ) : (
              <div className="glowup-sidebar-gate">
                <p className="glowup-sidebar-gate-text">
                  Log in to use the sidebar functionality.
                </p>
                <button
                  type="button"
                  className="glowup-signin-btn"
                  onClick={openSignIn}
                >
                  Sign in
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default ThemePanel
