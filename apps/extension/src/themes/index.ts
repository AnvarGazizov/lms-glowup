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
    id: "maple-leafs",
    name: "Maple Leafs",
    description: "Toronto Maple Leafs blue & white"
  },
  {
    id: "raptors",
    name: "Raptors",
    description: "Toronto Raptors red, black & silver"
  },
  {
    id: "camo",
    name: "Camo",
    description: "Hunting woodland camouflage"
  },
  {
    id: "vaporwave",
    name: "Vaporwave",
    description: "Retro neon pink, cyan & purple"
  },
  {
    id: "custom",
    name: "Custom CSS",
    description: "Write your own CSS overrides"
  }
]
