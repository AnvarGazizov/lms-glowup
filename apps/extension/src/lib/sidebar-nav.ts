import sidebarCSS from "data-text:../contents/sidebar-nav.css"
import type { NavLink } from "./sidebar-extract"
import {
  collectNavLinks,
  collectUserMenuElements,
  deduplicateNavItems,
  hasBrightspaceNav,
} from "./sidebar-extract"

const SIDEBAR_ID = "lms-glowup-sidebar"
const SIDEBAR_STYLE_ID = "lms-glowup-sidebar-style"
const LAYOUT_WRAPPER_ID = "lms-glowup-layout"
const CONTENT_WRAPPER_ID = "lms-glowup-content"
const DATA_ATTR = "data-lms-glowup-sidebar-nav"

// ── Sidebar DOM construction ────────────────────────────────

function buildSidebar(navLinks: NavLink[], userEls: HTMLElement[]): HTMLElement {
  const sidebar = document.createElement("nav")
  sidebar.id = SIDEBAR_ID

  const section = document.createElement("div")
  section.className = "glowup-sidebar-section"

  for (const link of navLinks) {
    const a = document.createElement("a")
    a.className = "glowup-sidebar-item"
    a.href = link.href
    a.textContent = link.label
    section.appendChild(a)
  }

  if (userEls.length > 0) {
    appendDivider(section)

    for (const el of userEls) {
      el.classList.add("glowup-sidebar-item")
      section.appendChild(el)
    }
  }

  sidebar.appendChild(section)
  return sidebar
}

function appendDivider(parent: HTMLElement) {
  const el = document.createElement("div")
  el.className = "glowup-sidebar-divider"
  parent.appendChild(el)
}

// ── Page layout wrapping ────────────────────────────────────

function wrapPageContent(sidebar: HTMLElement): void {
  const layout = document.createElement("div")
  layout.id = LAYOUT_WRAPPER_ID

  const content = document.createElement("div")
  content.id = CONTENT_WRAPPER_ID

  const mainWrapper = document.querySelector(".d2l-body-main-wrapper")
  const footer = document.querySelector("footer.d2l-footer")

  if (mainWrapper) content.appendChild(mainWrapper)
  if (footer) content.appendChild(footer)

  layout.appendChild(sidebar)
  layout.appendChild(content)
  document.body.prepend(layout)
}

function unwrapPageContent(): void {
  const layout = document.getElementById(LAYOUT_WRAPPER_ID)
  if (!layout) return

  const content = document.getElementById(CONTENT_WRAPPER_ID)
  if (content) {
    for (const child of Array.from(content.children)) {
      layout.before(child)
    }
  }

  layout.remove()
}

// ── Style injection ─────────────────────────────────────────

function injectStyles(): void {
  if (document.getElementById(SIDEBAR_STYLE_ID)) return
  const style = document.createElement("style")
  style.id = SIDEBAR_STYLE_ID
  style.textContent = sidebarCSS
  document.head.appendChild(style)
}

function removeStyles(): void {
  document.getElementById(SIDEBAR_STYLE_ID)?.remove()
}

// ── Nav readiness ───────────────────────────────────────────

function onNavReady(cb: () => void): void {
  if (hasBrightspaceNav()) {
    cb()
    return
  }

  const observer = new MutationObserver((_mutations, obs) => {
    if (hasBrightspaceNav()) {
      obs.disconnect()
      cb()
    }
  })
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  })
}

// ── Public API ──────────────────────────────────────────────

export function applySidebarNav(enabled: boolean): void {
  const root = document.documentElement

  if (!enabled) {
    document.getElementById(SIDEBAR_ID)?.remove()
    removeStyles()
    unwrapPageContent()
    root.removeAttribute(DATA_ATTR)
    return
  }

  root.setAttribute(DATA_ATTR, "")
  injectStyles()

  if (document.getElementById(SIDEBAR_ID)) return

  const mount = () => {
    onNavReady(() => {
      const userEls = collectUserMenuElements()
      const navLinks = deduplicateNavItems(collectNavLinks(), userEls)
      if (navLinks.length > 0 || userEls.length > 0) {
        wrapPageContent(buildSidebar(navLinks, userEls))
      }
    })
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount)
  } else {
    mount()
  }
}
