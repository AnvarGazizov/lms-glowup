import { useEffect, useState } from "react"
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"

import styleText from "data-text:./theme-panel.css"
import iconUrl from "data-url:../../assets/icon.png"
import { getPrefs, setPrefs, onPrefsChanged } from "~lib/storage"
import type { ThemePreferences } from "~lib/storage"
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

  return (
    <>
      <button
        type="button"
        className="glowup-fab"
        onClick={() => setOpen(!open)}
        title={open ? "Close settings" : "LMS Glowup settings"}
        aria-label={open ? "Close LMS Glowup settings" : "Open LMS Glowup settings"}
      >
        {open ? (
          <span className="glowup-fab-close" aria-hidden>
            {"\u2715"}
          </span>
        ) : (
          <img
            className="glowup-fab-icon"
            src={iconUrl}
            alt=""
            decoding="async"
          />
        )}
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
                  <span className="glowup-theme-card-name">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="glowup-section">
            <div className="glowup-section-title">Layout</div>
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
          </div>
        </div>
      )}
    </>
  )
}

export default ThemePanel
