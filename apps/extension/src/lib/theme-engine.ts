import { setAnnouncementsListShadowFixActive } from "./announcements-list-shadow-fix"
import { setCalendarShadowFixActive } from "./calendar-shadow-fix"
import { setEnrollmentCardTextFixActive } from "./enrollment-card-fix"
import { setPortfolioShadowFixActive } from "./portfolio-shadow-fix"
import type { ThemePreferences } from "./storage"
import { applySidebarNav } from "./sidebar-nav"

import baseCSS from "data-text:../themes/base.css"
import leSurfacesCSS from "data-text:../themes/le-surfaces.css"
import basketballCSS from "data-text:../themes/basketball.css"
import camoCSS from "data-text:../themes/camo.css"
import vaporwaveCSS from "data-text:../themes/vaporwave.css"
import retroCSS from "data-text:../themes/retro.css"
import neubrutalCSS from "data-text:../themes/neubrutal.css"

const STYLE_ID = "lms-glowup-theme"

const THEME_MAP: Record<string, string> = {
  basketball: basketballCSS,
  camo: camoCSS,
  vaporwave: vaporwaveCSS,
  retro: retroCSS,
  neubrutal: neubrutalCSS
}

export function buildCSS(prefs: ThemePreferences): string {
  const parts: string[] = [baseCSS]

  if (prefs.activeTheme === "custom") {
    parts.push(leSurfacesCSS)
    parts.push(prefs.customCSS)
  } else if (THEME_MAP[prefs.activeTheme]) {
    parts.push(THEME_MAP[prefs.activeTheme])
    parts.push(leSurfacesCSS)
  }

  return parts.join("\n")
}

function getFeatureAttrs(prefs: ThemePreferences) {
  return {
    "data-lms-glowup-themed": prefs.activeTheme !== "none"
  }
}

export function applyTheme(
  prefs: ThemePreferences,
  isLoggedIn: boolean
): void {
  const css = buildCSS(prefs)
  injectCSS(css)
  applyFeatureAttrs(prefs)
  const themed = prefs.activeTheme !== "none"
  setEnrollmentCardTextFixActive(themed)
  setCalendarShadowFixActive(themed)
  setAnnouncementsListShadowFixActive(themed)
  setPortfolioShadowFixActive(themed)
  applySidebarNav(isLoggedIn && prefs.enabledFeatures.sidebarNav)
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
  setEnrollmentCardTextFixActive(false)
  setCalendarShadowFixActive(false)
  setAnnouncementsListShadowFixActive(false)
  setPortfolioShadowFixActive(false)
  applySidebarNav(false)
  const root = document.documentElement
  root.removeAttribute("data-lms-glowup-themed")
}
