/**
 * Brightspace Portfolio (`/d2l/folio/`) renders cards and chrome inside shadow roots.
 * `d2l-card` (and similar) use constructable stylesheets (`adoptedStyleSheets`);
 * appended <style> nodes lose to those, so hosts stay white unless we append a sheet last.
 */

const SURFACE_SHADOW_CSS = `
:host {
  background-color: transparent !important;
  background: transparent !important;
}

/* Slotted from d2l-portfolio-course-card: footer strip + banner plate */
::slotted(.d2l-user-card-footer) {
  background-color: transparent !important;
  background: transparent !important;
}

::slotted(.background) {
  background-color: transparent !important;
}

.d2l-card-container,
.d2l-card-link-container,
.d2l-card-header,
.d2l-card-content,
.d2l-card-footer,
.d2l-card-actions,
.d2l-card-badge {
  background-color: transparent !important;
  background: transparent !important;
}

.portfolio-header-row,
.portfolio-header-row-controls,
.portfolio-header-divider {
  background-color: transparent !important;
  background: transparent !important;
}

.radio-button-container,
.radio-button-padding,
.radio-button-content {
  background-color: transparent !important;
  background: transparent !important;
}

:host .d2l-card-container a {
  color: var(--d2l-color-celestine, #0066cc) !important;
}
`

const SHIMMER_SHADOW_CSS = `
:host {
  background-color: transparent !important;
  background: transparent !important;
}

::slotted(.background) {
  background-color: transparent !important;
}
`

const UNLINKED_EVIDENCE_SHADOW_CSS = `
:host {
  background-color: transparent !important;
  background: transparent !important;
}

.background {
  background-color: transparent !important;
  background: transparent !important;
}
`

const SELECTOR_SHADOW_CSS = `${SURFACE_SHADOW_CSS}
select.d2l-input-select {
  background-color: color-mix(
    in srgb,
    var(--d2l-color-mica, #1a1a1a) 92%,
    transparent
  ) !important;
  color: var(--d2l-color-ferrite, inherit) !important;
  border-color: color-mix(
    in srgb,
    var(--d2l-color-tungsten, #565656) 45%,
    transparent
  ) !important;
}
`

let observer: MutationObserver | null = null
let rafScheduled = false

/** MutationObserver does not see nodes added inside shadow roots; folio mounts cards there. */
let loadListener: (() => void) | null = null
const retryTimeouts: ReturnType<typeof setTimeout>[] = []

/** One constructable sheet per shadow host (replaced on each patch). */
const hostSheets = new WeakMap<Element, CSSStyleSheet>()

function isFolioPage(): boolean {
  return /\/d2l\/folio\//i.test(location.pathname)
}

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

function injectConstructableSheet(host: Element, css: string) {
  const sr = host.shadowRoot
  if (!sr || typeof CSSStyleSheet === "undefined" || !sr.adoptedStyleSheets) {
    return
  }

  let sheet = hostSheets.get(host)
  if (sheet) {
    void sheet.replaceSync(css)
    return
  }

  sheet = new CSSStyleSheet()
  void sheet.replaceSync(css)
  hostSheets.set(host, sheet)
  sr.adoptedStyleSheets = [...sr.adoptedStyleSheets, sheet]
}

function stripConstructableSheet(host: Element) {
  const sheet = hostSheets.get(host)
  if (!sheet) return
  const sr = host.shadowRoot
  if (sr) {
    sr.adoptedStyleSheets = sr.adoptedStyleSheets.filter((s) => s !== sheet)
  }
  hostSheets.delete(host)
}

function patchPortfolioShadows() {
  if (!isFolioPage()) return

  for (const host of querySelectorAllDeep("d2l-card")) {
    injectConstructableSheet(host, SURFACE_SHADOW_CSS)
  }
  for (const host of querySelectorAllDeep("d2l-card-loading-shimmer")) {
    injectConstructableSheet(host, SHIMMER_SHADOW_CSS)
  }
  for (const host of querySelectorAllDeep("d2l-portfolio-unlinked-evidence-card")) {
    injectConstructableSheet(host, UNLINKED_EVIDENCE_SHADOW_CSS)
  }
  for (const host of querySelectorAllDeep("d2l-portfolio-header-student")) {
    injectConstructableSheet(host, SURFACE_SHADOW_CSS)
  }
  for (const host of querySelectorAllDeep("d2l-portfolio-header-nav-student")) {
    injectConstructableSheet(host, SURFACE_SHADOW_CSS)
  }
  for (const host of querySelectorAllDeep("d2l-portfolio-radio-button")) {
    injectConstructableSheet(host, SURFACE_SHADOW_CSS)
  }
  for (const host of querySelectorAllDeep(
    "d2l-portfolio-portfolio-type-selector"
  )) {
    injectConstructableSheet(host, SELECTOR_SHADOW_CSS)
  }
}

function removePatches() {
  const hosts = [
    ...querySelectorAllDeep("d2l-card"),
    ...querySelectorAllDeep("d2l-card-loading-shimmer"),
    ...querySelectorAllDeep("d2l-portfolio-unlinked-evidence-card"),
    ...querySelectorAllDeep("d2l-portfolio-header-student"),
    ...querySelectorAllDeep("d2l-portfolio-header-nav-student"),
    ...querySelectorAllDeep("d2l-portfolio-radio-button"),
    ...querySelectorAllDeep("d2l-portfolio-portfolio-type-selector")
  ]
  for (const host of hosts) {
    stripConstructableSheet(host)
  }
}

function schedulePatch() {
  if (rafScheduled) return
  rafScheduled = true
  requestAnimationFrame(() => {
    rafScheduled = false
    patchPortfolioShadows()
  })
}

function clearDeferredRetries(): void {
  for (const id of retryTimeouts) {
    clearTimeout(id)
  }
  retryTimeouts.length = 0
  if (loadListener) {
    window.removeEventListener("load", loadListener)
    loadListener = null
  }
}

/** Re-run patch after layout and after late shadow-DOM mounts (SPA / web components). */
function armDeferredPortfolioPatches(): void {
  clearDeferredRetries()
  loadListener = () => schedulePatch()
  if (document.readyState === "complete") {
    schedulePatch()
  } else {
    window.addEventListener("load", loadListener, { once: true })
  }
  for (const ms of [0, 50, 150, 400, 1000, 2500]) {
    retryTimeouts.push(window.setTimeout(() => schedulePatch(), ms))
  }
}

export function setPortfolioShadowFixActive(active: boolean): void {
  if (!active) {
    clearDeferredRetries()
    observer?.disconnect()
    observer = null
    removePatches()
    return
  }

  patchPortfolioShadows()
  schedulePatch()
  armDeferredPortfolioPatches()

  if (!observer) {
    observer = new MutationObserver(schedulePatch)
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    })
  }
}
