/**
 * Mini calendar in the LE sidebar (`d2l-calendar`) paints date cells inside a shadow root.
 * Theme :root variables still apply there; we align buttons with the active palette.
 */

const STYLE_ID = "lms-glowup-d2l-calendar-theme"

const CALENDAR_SHADOW_CSS = `
button.d2l-calendar-date {
  background-color: color-mix(
    in srgb,
    var(--d2l-color-sylvite, #3a3a3a) 42%,
    transparent
  ) !important;
  color: var(--d2l-color-ferrite, inherit) !important;
  border: 1px solid color-mix(
    in srgb,
    var(--d2l-color-tungsten, #888) 35%,
    transparent
  ) !important;
}
button.d2l-calendar-date:hover,
button.d2l-calendar-date:focus-visible {
  background-color: color-mix(
    in srgb,
    var(--d2l-color-celestine, #0066cc) 26%,
    var(--d2l-color-sylvite, #444)
  ) !important;
}
button.d2l-calendar-date-today {
  box-shadow: inset 0 0 0 2px var(--d2l-color-celestine, #0066cc) !important;
}
abbr.d2l-body-small {
  color: var(--d2l-color-tungsten, inherit) !important;
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

function injectIntoCalendarShadow(host: Element) {
  const sr = host.shadowRoot
  if (!sr || sr.getElementById(STYLE_ID)) return
  const el = document.createElement("style")
  el.id = STYLE_ID
  el.textContent = CALENDAR_SHADOW_CSS
  sr.appendChild(el)
}

function patchCalendars() {
  for (const host of querySelectorAllDeep("d2l-calendar")) {
    injectIntoCalendarShadow(host)
  }
}

function removePatches() {
  for (const host of querySelectorAllDeep("d2l-calendar")) {
    host.shadowRoot?.getElementById(STYLE_ID)?.remove()
  }
}

function schedulePatch() {
  if (rafScheduled) return
  rafScheduled = true
  requestAnimationFrame(() => {
    rafScheduled = false
    patchCalendars()
  })
}

export function setCalendarShadowFixActive(active: boolean): void {
  if (!active) {
    observer?.disconnect()
    observer = null
    removePatches()
    return
  }

  patchCalendars()

  if (!observer) {
    observer = new MutationObserver(schedulePatch)
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    })
  }
}
