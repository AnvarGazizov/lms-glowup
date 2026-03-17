import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  process.env.PLASMO_PUBLIC_SUPABASE_URL!,
  process.env.PLASMO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: {
        async getItem(key: string) {
          const result = await chrome.storage.local.get(key)
          return result[key] ?? null
        },
        async setItem(key: string, value: string) {
          await chrome.storage.local.set({ [key]: value })
        },
        async removeItem(key: string) {
          await chrome.storage.local.remove(key)
        },
      },
      autoRefreshToken: true,
      persistSession: true,
    },
  }
)
