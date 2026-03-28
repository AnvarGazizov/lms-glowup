import { createClient } from "@supabase/supabase-js"

import type { Database } from "./database.types"

/**
 * Secret service-role key (Supabase Dashboard → Settings → API). Bypasses RLS;
 * `beta_sign_ups` and `feature_ideas` revoke anon/authenticated at the DB so
 * only this client can write those tables from trusted server code. Never expose
 * the key to the browser.
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    return null
  }
  return createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}
