/**
 * My Courses enrollment cards nest real text inside d2l-card's shadow root.
 * Page CSS cannot reach it, and themed :root tokens still resolve there—so we
 * inject a style sheet into each nested d2l-card shadow when a theme is on.
 */

const STYLE_ID = "lms-glowup-enrollment-card-inner-text"

const INNER_SHADOW_CSS = `
.d2l-enrollment-card-content-flex .d2l-organization-name {
  color: #1a1a1a !important;
}
.d2l-enrollment-card-content-flex .d2l-body-small,
.d2l-enrollment-card-content-flex d2l-card-content-meta,
.d2l-enrollment-card-content-flex d2l-card-content-meta span {
  color: #494c4e !important;
}
`

let observer: MutationObserver | null = null
let rafScheduled = false

function injectIntoCardShadow(card: Element) {
  const sr = card.shadowRoot
  if (!sr || sr.getElementById(STYLE_ID)) return
  const el = document.createElement("style")
  el.id = STYLE_ID
  el.textContent = INNER_SHADOW_CSS
  sr.appendChild(el)
}

function patchVisibleEnrollmentCards() {
  for (const host of document.querySelectorAll("d2l-my-courses-enrollment-card")) {
    const outer = host.shadowRoot
    if (!outer) continue
    const card = outer.querySelector("d2l-card")
    if (card) injectIntoCardShadow(card)
  }
}

function removePatches() {
  for (const host of document.querySelectorAll("d2l-my-courses-enrollment-card")) {
    const outer = host.shadowRoot
    const card = outer?.querySelector("d2l-card")
    card?.shadowRoot?.getElementById(STYLE_ID)?.remove()
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
