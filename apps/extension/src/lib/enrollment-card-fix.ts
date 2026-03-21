/**
 * My Courses tiles use shadow DOM that page CSS cannot pierce:
 * - Legacy: text lives inside nested d2l-card shadows (d2l-my-courses-enrollment-card).
 * - v2 widget: course tiles are d2l-sort-item inside d2l-all-courses-v2.
 * We inject small style sheets into those shadows when a theme is active.
 */

const STYLE_ID = "lms-glowup-enrollment-card-inner-text"

const ALL_COURSES_V2_STYLE_ID = "lms-glowup-all-courses-v2-transparent"

const ALL_COURSES_V2_SHADOW_CSS = `
d2l-sort-item {
  background-color: transparent !important;
  background: transparent !important;
}
d2l-alert {
  background-color: transparent !important;
}
`

const INNER_SHADOW_CSS = `
/* My Courses v2: Brightspace paints white on the d2l-card host; page CSS cannot override shadow defaults. */
:host {
  background-color: transparent !important;
  background: transparent !important;
}

/* Older templates: solid footer panel inside the card shadow. */
.d2l-enrollment-card-content-flex {
  background-color: transparent !important;
  background: transparent !important;
}

.d2l-enrollment-card-content-flex .d2l-organization-name {
  color: var(--d2l-color-ferrite, #1a1a1a) !important;
}
.d2l-enrollment-card-content-flex .d2l-body-small,
.d2l-enrollment-card-content-flex d2l-card-content-meta,
.d2l-enrollment-card-content-flex d2l-card-content-meta span {
  color: var(--d2l-color-tungsten, #494c4e) !important;
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

function injectIntoCardShadow(card: Element) {
  const sr = card.shadowRoot
  if (!sr || sr.getElementById(STYLE_ID)) return
  const el = document.createElement("style")
  el.id = STYLE_ID
  el.textContent = INNER_SHADOW_CSS
  sr.appendChild(el)
}

function injectIntoAllCoursesV2Shadow(host: Element) {
  const sr = host.shadowRoot
  if (!sr || sr.getElementById(ALL_COURSES_V2_STYLE_ID)) return
  const el = document.createElement("style")
  el.id = ALL_COURSES_V2_STYLE_ID
  el.textContent = ALL_COURSES_V2_SHADOW_CSS
  sr.appendChild(el)
}

function patchVisibleEnrollmentCards() {
  /* Cards live under d2l-my-courses-container-v2 shadow, not in the document light tree. */
  for (const host of querySelectorAllDeep("d2l-my-courses-enrollment-card")) {
    const outer = host.shadowRoot
    if (!outer) continue
    const card = outer.querySelector("d2l-card")
    if (card) injectIntoCardShadow(card)
  }

  for (const host of querySelectorAllDeep("d2l-all-courses-v2")) {
    injectIntoAllCoursesV2Shadow(host)
  }
}

function removePatches() {
  for (const host of querySelectorAllDeep("d2l-my-courses-enrollment-card")) {
    const outer = host.shadowRoot
    const card = outer?.querySelector("d2l-card")
    card?.shadowRoot?.getElementById(STYLE_ID)?.remove()
  }

  for (const host of querySelectorAllDeep("d2l-all-courses-v2")) {
    host.shadowRoot?.getElementById(ALL_COURSES_V2_STYLE_ID)?.remove()
  }
}

function schedulePatch() {
  if (rafScheduled) return
  rafScheduled = true
  requestAnimationFrame(() => {
    rafScheduled = false
    patchVisibleEnrollmentCards()
  })
}

export function setEnrollmentCardTextFixActive(active: boolean): void {
  if (!active) {
    observer?.disconnect()
    observer = null
    removePatches()
    return
  }

  patchVisibleEnrollmentCards()

  if (!observer) {
    observer = new MutationObserver(schedulePatch)
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    })
  }
}
