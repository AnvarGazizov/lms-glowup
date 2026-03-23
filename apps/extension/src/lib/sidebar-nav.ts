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

// ── Icon SVGs (20×20, stroke-based, Lucide-style) ───────────

const ICONS: Record<string, string> = {
  home: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  book: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  calendar: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  file: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  chart: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  message: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  clipboard: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>`,
  checkSquare: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
  award: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`,
  bell: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  user: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  settings: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1.08 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1.08z"/></svg>`,
  logOut: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  mail: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  grid: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
  link: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  compass: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
  image: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  globe: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  trendingUp: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  folder: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
  chevronDown: `<svg class="glowup-sidebar-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
}

const LABEL_ICON_PATTERNS: [RegExp, string][] = [
  [/^(home|my home|dashboard|homepage)$/i, "home"],
  [/course|class/i, "book"],
  [/calendar|schedule/i, "calendar"],
  [/content|module|material/i, "file"],
  [/grade|mark|score|report/i, "chart"],
  [/discuss|forum|thread/i, "message"],
  [/assign|submission|dropbox/i, "clipboard"],
  [/quiz|test|exam|survey/i, "checkSquare"],
  [/award|badge|achievement/i, "award"],
  [/notif|alert|announcement/i, "bell"],
  [/profile|account/i, "user"],
  [/setting|preference/i, "settings"],
  [/log\s*out|sign\s*out/i, "logOut"],
  [/mail|email|inbox|message/i, "mail"],
  [/discover|explore|browse|search/i, "compass"],
  [/media|library|video|gallery/i, "image"],
  [/english|language|locale|français|español/i, "globe"],
  [/progress|activity|analytics/i, "trendingUp"],
  [/portfolio|collection/i, "folder"],
  [/tool|app|widget/i, "grid"],
  [/link|resource/i, "link"],
]

function iconForLabel(label: string): string {
  for (const [pattern, key] of LABEL_ICON_PATTERNS) {
    if (pattern.test(label)) return ICONS[key]
  }
  return ICONS.grid
}

function isActivePath(href: string): boolean {
  try {
    const linkPath = new URL(href, location.origin).pathname.replace(/\/+$/, "")
    const currentPath = location.pathname.replace(/\/+$/, "")
    if (!linkPath) return currentPath === "" || currentPath === "/"
    return currentPath === linkPath || currentPath.startsWith(linkPath + "/")
  } catch {
    return false
  }
}

let sidebarActiveSyncCleanup: (() => void) | null = null

function syncSidebarActiveItems(): void {
  const sidebar = document.getElementById(SIDEBAR_ID)
  if (!sidebar) return
  for (const item of sidebar.querySelectorAll<HTMLElement>(".glowup-sidebar-item")) {
    item.classList.remove("active")
    if (
      item instanceof HTMLAnchorElement &&
      item.href &&
      !item.href.startsWith("javascript:")
    ) {
      if (isActivePath(item.href)) item.classList.add("active")
    }
  }

  const disclosure = sidebar.querySelector<HTMLDetailsElement>(
    ".glowup-sidebar-disclosure"
  )
  if (disclosure?.querySelector(".glowup-sidebar-item.active")) {
    disclosure.open = true
  }
}

function attachSidebarActiveSync(): void {
  sidebarActiveSyncCleanup?.()
  const sync = () => syncSidebarActiveItems()
  window.addEventListener("popstate", sync)
  window.addEventListener("hashchange", sync)
  sidebarActiveSyncCleanup = () => {
    window.removeEventListener("popstate", sync)
    window.removeEventListener("hashchange", sync)
  }
}

function detachSidebarActiveSync(): void {
  sidebarActiveSyncCleanup?.()
  sidebarActiveSyncCleanup = null
}

// ── Sidebar DOM construction ────────────────────────────────

/** Visible course nav rows before folding the rest into “More”. Keeps the bar usable on short viewports. */
const SIDEBAR_PRIMARY_NAV_MAX = 9

function createNavLinkAnchor(link: NavLink): HTMLAnchorElement {
  const a = document.createElement("a")
  a.className = "glowup-sidebar-item"
  a.href = link.href

  const iconSpan = document.createElement("span")
  iconSpan.className = "glowup-sidebar-icon"
  iconSpan.innerHTML = iconForLabel(link.label)

  const labelSpan = document.createElement("span")
  labelSpan.className = "glowup-sidebar-label"
  labelSpan.textContent = link.label

  a.appendChild(iconSpan)
  a.appendChild(labelSpan)
  return a
}

function buildSidebar(navLinks: NavLink[], userEls: HTMLElement[]): HTMLElement {
  const sidebar = document.createElement("nav")
  sidebar.id = SIDEBAR_ID

  const body = document.createElement("div")
  body.className = "glowup-sidebar-body"

  const scroll = document.createElement("div")
  scroll.className = "glowup-sidebar-nav-scroll"

  const section = document.createElement("div")
  section.className = "glowup-sidebar-section"

  const primary = navLinks.slice(0, SIDEBAR_PRIMARY_NAV_MAX)
  const overflow = navLinks.slice(SIDEBAR_PRIMARY_NAV_MAX)

  for (const link of primary) {
    section.appendChild(createNavLinkAnchor(link))
  }

  if (overflow.length > 0) {
    const details = document.createElement("details")
    details.className = "glowup-sidebar-disclosure"

    const summary = document.createElement("summary")
    summary.className = "glowup-sidebar-disclosure-summary"

    const sumIcon = document.createElement("span")
    sumIcon.className = "glowup-sidebar-icon"
    sumIcon.innerHTML = ICONS.chevronDown

    const sumLabel = document.createElement("span")
    sumLabel.className = "glowup-sidebar-label"
    sumLabel.textContent = "More"

    summary.appendChild(sumIcon)
    summary.appendChild(sumLabel)

    const panel = document.createElement("div")
    panel.className = "glowup-sidebar-disclosure-panel"

    for (const link of overflow) {
      panel.appendChild(createNavLinkAnchor(link))
    }

    details.appendChild(summary)
    details.appendChild(panel)
    section.appendChild(details)
  }

  scroll.appendChild(section)
  body.appendChild(scroll)

  const footer = document.createElement("div")
  footer.className = "glowup-sidebar-footer"

  if (userEls.length > 0) {
    appendDivider(footer)

    for (const el of userEls) {
      const label = el.textContent?.trim() || ""
      const a = document.createElement("a")
      a.className = "glowup-sidebar-item"
      if (el instanceof HTMLAnchorElement) {
        a.href = el.href
        if (el.target) a.target = el.target
        if (el.rel) a.rel = el.rel
        if (el.download) a.download = el.download
      } else {
        a.href = "#"
      }

      const iconSpan = document.createElement("span")
      iconSpan.className = "glowup-sidebar-icon"
      iconSpan.innerHTML = iconForLabel(label)

      const labelSpan = document.createElement("span")
      labelSpan.className = "glowup-sidebar-label"
      labelSpan.textContent = label

      a.appendChild(iconSpan)
      a.appendChild(labelSpan)
      footer.appendChild(a)
    }
  }

  sidebar.appendChild(body)
  sidebar.appendChild(footer)
  return sidebar
}

function appendDivider(parent: HTMLElement) {
  const el = document.createElement("div")
  el.className = "glowup-sidebar-divider"
  parent.appendChild(el)
}

// ── Page layout wrapping ────────────────────────────────────

const SKIP_WRAP_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "LINK",
  "META",
  "NOSCRIPT",
])

let bodyObserver: MutationObserver | null = null

function shouldSkipNode(node: Node): boolean {
  if (!(node instanceof HTMLElement)) return node.nodeType !== Node.ELEMENT_NODE
  return (
    SKIP_WRAP_TAGS.has(node.tagName) ||
    node.id === SIDEBAR_STYLE_ID ||
    node.id === SIDEBAR_ID ||
    node.id === LAYOUT_WRAPPER_ID ||
    node.id === "lms-glowup-theme"
  )
}

function sweepBodyChildren(content: HTMLElement): void {
  const children = Array.from(document.body.childNodes)
  for (const child of children) {
    if (shouldSkipNode(child)) continue
    if (child instanceof HTMLElement && child.id === LAYOUT_WRAPPER_ID) continue
    content.appendChild(child)
  }
}

function watchBodyForStrayNodes(): void {
  stopWatchingBody()
  const content = document.getElementById(CONTENT_WRAPPER_ID)
  if (!content) return

  bodyObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of Array.from(m.addedNodes)) {
        if (node.parentNode !== document.body) continue
        if (shouldSkipNode(node)) continue
        if (node instanceof HTMLElement && node.id === LAYOUT_WRAPPER_ID)
          continue
        content.appendChild(node)
      }
    }
  })

  bodyObserver.observe(document.body, { childList: true })
}

function stopWatchingBody(): void {
  bodyObserver?.disconnect()
  bodyObserver = null
}

function wrapPageContent(sidebar: HTMLElement): void {
  const layout = document.createElement("div")
  layout.id = LAYOUT_WRAPPER_ID

  const content = document.createElement("div")
  content.id = CONTENT_WRAPPER_ID

  sweepBodyChildren(content)

  layout.appendChild(sidebar)
  layout.appendChild(content)
  document.body.prepend(layout)

  watchBodyForStrayNodes()
}

function unwrapPageContent(): void {
  stopWatchingBody()

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

  let settled = false
  const settle = () => {
    if (settled) return
    settled = true
    cb()
  }

  const observer = new MutationObserver((_mutations, obs) => {
    if (hasBrightspaceNav()) {
      obs.disconnect()
      settle()
    }
  })
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  })

  setTimeout(() => {
    observer.disconnect()
    settle()
  }, 3000)
}

// ── Public API ──────────────────────────────────────────────

export function applySidebarNav(enabled: boolean): void {
  const root = document.documentElement

  if (!enabled) {
    detachSidebarActiveSync()
    document.getElementById(SIDEBAR_ID)?.remove()
    removeStyles()
    unwrapPageContent()
    root.removeAttribute(DATA_ATTR)
    return
  }

  root.setAttribute(DATA_ATTR, "")
  injectStyles()

  if (document.getElementById(SIDEBAR_ID)) {
    syncSidebarActiveItems()
    attachSidebarActiveSync()
    return
  }

  const mount = () => {
    onNavReady(() => {
      const userEls = collectUserMenuElements()
      const navLinks = deduplicateNavItems(collectNavLinks(), userEls)
      if (navLinks.length > 0 || userEls.length > 0) {
        wrapPageContent(buildSidebar(navLinks, userEls))
        syncSidebarActiveItems()
        attachSidebarActiveSync()
      }
    })
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount)
  } else {
    mount()
  }
}
