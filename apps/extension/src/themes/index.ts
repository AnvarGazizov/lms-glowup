export interface ThemeDefinition {
  id: string
  name: string
  description: string
}

export const THEMES: ThemeDefinition[] = [
  {
    id: "none",
    name: "Default",
    description: "Original Brightspace appearance"
  },
  {
    id: "dark",
    name: "Dark",
    description: "High-contrast dark background with light text"
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Deep navy blues with cool accents"
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, airy look with reduced visual noise"
  },
  {
    id: "custom",
    name: "Custom CSS",
    description: "Write your own CSS overrides"
  }
]
