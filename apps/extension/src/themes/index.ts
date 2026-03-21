export interface ThemeDefinition {
  id: string
  name: string
}

export const THEMES: ThemeDefinition[] = [
  {
    id: "none",
    name: "Default"
  },
  {
    id: "basketball",
    name: "Basketball"
  },
  {
    id: "camo",
    name: "Camo"
  },
  {
    id: "vaporwave",
    name: "Vaporwave"
  },
  {
    id: "retro",
    name: "Retro"
  },
  {
    id: "neubrutal",
    name: "Neubrutal"
  },
  {
    id: "custom",
    name: "Custom CSS"
  }
]
