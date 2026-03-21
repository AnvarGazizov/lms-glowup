/**
 * Course Announcements often use `d2l-list` with expandable rows: the HTML body is wrapped in
 * `d2l-list-item` → `d2l-expand-collapse-content` shadow trees. Page-level theme CSS cannot pierce
 * those roots (same idea as calendar / portfolio fixes).
 *
 * `d2l-expand-collapse-content` is used elsewhere (forms, inputs); we only patch instances whose
 * shadow root chain includes a `d2l-list-item` host.
 *
 * Instructor HTML inside `d2l-html-block` often ships with white `table`/`div` shells; we inject
 * into that shadow only in the same announcement context (list item ancestor).
 */

const LIST_ITEM_STYLE_ID = "lms-glowup-announcements-list-item"
const EXPAND_COLLAPSE_STYLE_ID = "lms-glowup-announcements-expand-collapse"
const HTML_BLOCK_STYLE_ID = "lms-glowup-announcements-html-block"

const LIST_ITEM_SHADOW_CSS = `
[slot="nested"] {
  background-color: color-mix(
    in srgb,
    var(--d2l-color-mica, #1a1a1a) 90%,
    transparent
  ) !important;
}

d2l-expand-collapse-content {
  background-color: color-mix(
    in srgb,
    var(--d2l-color-mica, #1a1a1a) 90%,
    transparent
  ) !important;
}
`

const EXPAND_COLLAPSE_SHADOW_CSS = `
.d2l-expand-collapse-content-inner {
  background-color: color-mix(
    in srgb,
    var(--d2l-color-mica, #1a1a1a) 92%,
    transparent
  ) !important;
}
`

const HTML_BLOCK_SHADOW_CSS = `
:host {
  background-color: transparent !important;
}

.d2l-html-block-rendered {
  background-color: color-mix(
    in srgb,
    var(--d2l-color-mica, #1a1a1a) 72%,
    transparent
  ) !important;
}

.d2l-html-block-rendered table,
.d2l-html-block-rendered tbody,
.d2l-html-block-rendered thead,
.d2l-html-block-rendered tfoot,
.d2l-html-block-rendered tr,
.d2l-html-block-rendered td,
.d2l-html-block-rendered th {
  background: transparent !important;
  background-color: transparent !important;
}

.d2l-html-block-rendered div {
  background-color: transparent !important;
  background-image: none !important;
}
`

let observer: MutationObserver | null = null
let rafScheduled = false

function querySelectorAllDeep(selector: string): Element[] {
  const out: Element[] = []
  function walk(root: Document | ShadowRoot) {
    root.querySelectorAll(selector).forEach((el) => out.push(el))
    root.querySelectorAll("*").forEach((el) => {
      if (el.shadowRoot) walk(el.shadowRoot)
    })
  }
  walk(document)
  return out
}

function isInsideAnnouncementListItem(host: Element): boolean {
  if (host.closest("d2l-list-item")) return true
  let root: Node | null = host.getRootNode()
  while (root instanceof ShadowRoot) {
    if (root.host.tagName === "D2L-LIST-ITEM") return true
    root = root.host.getRootNode()
  }
  return false
}

function injectIntoShadow(host: Element, css: string, styleId: string) {
  const sr = host.shadowRoot
  if (!sr || sr.getElementById(styleId)) return
  const el = document.createElement("style")
  el.id = styleId
  el.textContent = css
  sr.appendChild(el)
}

function patchListItems() {
  for (const host of querySelectorAllDeep("d2l-list-item")) {
    injectIntoShadow(host, LIST_ITEM_SHADOW_CSS, LIST_ITEM_STYLE_ID)
  }
}

function patchExpandCollapseInLists() {
  for (const host of querySelectorAllDeep("d2l-expand-collapse-content")) {
    if (!isInsideAnnouncementListItem(host)) continue
    injectIntoShadow(host, EXPAND_COLLAPSE_SHADOW_CSS, EXPAND_COLLAPSE_STYLE_ID)
  }
}

function patchHtmlBlocksInListAnnouncements() {
  for (const host of querySelectorAllDeep("d2l-html-block")) {
    if (!isInsideAnnouncementListItem(host)) continue
    injectIntoShadow(host, HTML_BLOCK_SHADOW_CSS, HTML_BLOCK_STYLE_ID)
  }
}

function patchAll() {
  patchListItems()
  patchExpandCollapseInLists()
  patchHtmlBlocksInListAnnouncements()
}

function removePatches() {
  for (const host of querySelectorAllDeep("d2l-list-item")) {
    host.shadowRoot?.getElementById(LIST_ITEM_STYLE_ID)?.remove()
  }
  for (const host of querySelectorAllDeep("d2l-expand-collapse-content")) {
    if (!isInsideAnnouncementListItem(host)) continue
    host.shadowRoot?.getElementById(EXPAND_COLLAPSE_STYLE_ID)?.remove()
  }
  for (const host of querySelectorAllDeep("d2l-html-block")) {
    if (!isInsideAnnouncementListItem(host)) continue
    host.shadowRoot?.getElementById(HTML_BLOCK_STYLE_ID)?.remove()
  }
}

function schedulePatch() {
  if (rafScheduled) return
  rafScheduled = true
  requestAnimationFrame(() => {
    rafScheduled = false
    patchAll()
  })
}

export function setAnnouncementsListShadowFixActive(active: boolean): void {
  if (!active) {
    observer?.disconnect()
    observer = null
    removePatches()
    return
  }

  patchAll()

  if (!observer) {
    observer = new MutationObserver(schedulePatch)
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    })
  }
}
