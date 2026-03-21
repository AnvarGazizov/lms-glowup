import type { ThemePreferences } from "./storage"
import { applySidebarNav } from "./sidebar-nav"

import baseCSS from "data-text:../themes/base.css"
import mapleLeafsCSS from "data-text:../themes/maple-leafs.css"
import raptorsCSS from "data-text:../themes/raptors.css"
import camoCSS from "data-text:../themes/camo.css"
import vaporwaveCSS from "data-text:../themes/vaporwave.css"

const STYLE_ID = "lms-glowup-theme"

const THEME_MAP: Record<string, string> = {
  "maple-leafs": mapleLeafsCSS,
  raptors: raptorsCSS,
  camo: camoCSS,
  vaporwave: vaporwaveCSS
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
    "data-lms-glowup-themed": prefs.activeTheme !== "none"
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
}
