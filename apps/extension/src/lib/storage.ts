const STORAGE_KEY = "lms-glowup-theme-prefs"

export interface ThemePreferences {
  activeTheme: string
  customCSS: string
  enabledFeatures: {
    sidebarNav: boolean
  }
}

export const DEFAULT_PREFS: ThemePreferences = {
  activeTheme: "none",
  customCSS: "",
  enabledFeatures: {
    sidebarNav: false
  }
}

export async function getPrefs(): Promise<ThemePreferences> {
  const result = await chrome.storage.local.get(STORAGE_KEY)
  return { ...DEFAULT_PREFS, ...result[STORAGE_KEY] }
}

export async function setPrefs(
  update: Partial<ThemePreferences>
): Promise<void> {
  const current = await getPrefs()
  const merged = {
    ...current,
    ...update,
    enabledFeatures: {
      ...current.enabledFeatures,
      ...(update.enabledFeatures ?? {})
    }
  }
  await chrome.storage.local.set({ [STORAGE_KEY]: merged })
}

export function onPrefsChanged(
  cb: (prefs: ThemePreferences) => void
): () => void {
  const listener = (
    changes: Record<string, chrome.storage.StorageChange>
  ) => {
    if (changes[STORAGE_KEY]) {
      cb({ ...DEFAULT_PREFS, ...changes[STORAGE_KEY].newValue })
    }
  }
  chrome.storage.onChanged.addListener(listener)
  return () => chrome.storage.onChanged.removeListener(listener)
}
