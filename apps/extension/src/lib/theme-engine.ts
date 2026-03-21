import type { ThemePreferences } from "./storage"
import { applySidebarNav } from "./sidebar-nav"

import baseCSS from "data-text:../themes/base.css"
import darkCSS from "data-text:../themes/dark.css"
import midnightCSS from "data-text:../themes/midnight.css"
import minimalCSS from "data-text:../themes/minimal.css"

const STYLE_ID = "lms-glowup-theme"

const THEME_MAP: Record<string, string> = {
  dark: darkCSS,
  midnight: midnightCSS,
  minimal: minimalCSS
}

export function buildCSS(prefs: ThemePreferences): string {
  const parts: string[] = []

  if (prefs.activeTheme !== "none") {
    parts.push(baseCSS)
  }

  if (prefs.activeTheme === "custom") {
    parts.push(prefs.customCSS)
  } else if (THEME_MAP[prefs.activeTheme]) {
    parts.push(THEME_MAP[prefs.activeTheme])
  }

  return parts.join("\n")
}

function getFeatureAttrs(prefs: ThemePreferences) {
  return {
    "data-lms-glowup-themed": prefs.activeTheme !== "none",
    "data-lms-glowup-full-width": prefs.enabledFeatures.fullWidth,
    "data-lms-glowup-hide-banner": prefs.enabledFeatures.hideBanner,
    "data-lms-glowup-compact-nav": prefs.enabledFeatures.compactNav
  }
}

export function applyTheme(prefs: ThemePreferences): void {
  const css = buildCSS(prefs)
  injectCSS(css)
  applyFeatureAttrs(prefs)
  applySidebarNav(prefs.enabledFeatures.sidebarNav)
}

export function injectCSS(css: string): void {
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null

  if (!css) {
    el?.remove()
    return
  }

  if (!el) {
    el = document.createElement("style")
    el.id = STYLE_ID
    el.setAttribute("type", "text/css")
    document.head.appendChild(el)
  }

  el.textContent = css
}

function applyFeatureAttrs(prefs: ThemePreferences): void {
  const attrs = getFeatureAttrs(prefs)
  const root = document.documentElement

  for (const [attr, enabled] of Object.entries(attrs)) {
    if (enabled) {
      root.setAttribute(attr, "")
    } else {
      root.removeAttribute(attr)
    }
  }
}

export function removeTheme(): void {
  document.getElementById(STYLE_ID)?.remove()
  applySidebarNav(false)
  const root = document.documentElement
  root.removeAttribute("data-lms-glowup-themed")
  root.removeAttribute("data-lms-glowup-full-width")
  root.removeAttribute("data-lms-glowup-hide-banner")
  root.removeAttribute("data-lms-glowup-compact-nav")
}
