export interface NavLink {
  label: string
  href: string
}

const EXCLUDED_LABELS = new Set([
  "Menu",
  "Select a course...",
  "Message alerts",
  "Subscription alerts",
  "Update alerts",
  "Admin Tools",
  "Help",
  "More",
])

function isUsable(label: string, seen: Set<string>): boolean {
  return (
    label.length > 0 &&
    label.length <= 60 &&
    !seen.has(label) &&
    !EXCLUDED_LABELS.has(label)
  )
}

export function collectNavLinks(): NavLink[] {
  const links: NavLink[] = []
  const seen = new Set<string>()

  function add(label: string, href: string) {
    const trimmed = label.trim()
    if (!isUsable(trimmed, seen)) return
    seen.add(trimmed)
    links.push({ label: trimmed, href })
  }

  document
    .querySelectorAll<HTMLElement>(
      ".d2l-navigation-s d2l-labs-navigation-link-icon[href]"
    )
    .forEach((el) => {
      const text = el.getAttribute("text") || ""
      const href = el.getAttribute("href") || ""
      if (href) add(text, href)
    })

  document
    .querySelectorAll<HTMLAnchorElement>(".d2l-navigation-s .d2l-navigation-s-item a")
    .forEach((el) => {
      add(el.textContent?.trim() || "", el.href)
    })

  document
    .querySelectorAll<HTMLAnchorElement>(".d2l-navigation-s a")
    .forEach((el) => {
      if (el.href && !el.href.startsWith("javascript:")) {
        add(el.textContent?.trim() || "", el.href)
      }
    })

  return links
}

export function collectUserMenuElements(): HTMLElement[] {
  const els: HTMLElement[] = []
  const seen = new Set<string>()

  document
    .querySelectorAll<HTMLElement>(".d2l-personal-tools-list a")
    .forEach((el) => {
      const label = el.textContent?.trim() || ""
      if (!isUsable(label, seen)) return
      seen.add(label)
      els.push(el)
    })

  return els
}

export function deduplicateNavItems(
  navLinks: NavLink[],
  userEls: HTMLElement[]
): NavLink[] {
  const userLabels = new Set(
    userEls.map((el) => el.textContent?.trim() || "")
  )
  return navLinks.filter((link) => !userLabels.has(link.label))
}

export function hasBrightspaceNav(): boolean {
  return !!(
    document.querySelector(".d2l-navigation") ||
    document.querySelector(".d2l-navigation-s") ||
    document.querySelector(".d2l-minibar")
  )
}
