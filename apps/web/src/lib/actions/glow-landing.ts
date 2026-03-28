"use server"

import { createClient } from "@/lib/supabase/server"

/** Pragmatic RFC-style check; blocks obvious junk without being pedantic. */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export type GlowLandingActionState =
  | { ok: true }
  | { ok: false; message: string }
  | null

export async function submitBetaSignUp(
  _prev: GlowLandingActionState,
  formData: FormData,
): Promise<GlowLandingActionState> {
  const first_name = String(formData.get("firstName") ?? "").trim()
  const last_name = String(formData.get("lastName") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const institutionRaw = formData.get("institution")
  const trimmed = institutionRaw ? String(institutionRaw).trim() : ""
  const institution = trimmed === "" ? null : trimmed

  if (!first_name || !last_name || !email) {
    return { ok: false, message: "Please fill in all required fields." }
  }

  if (!isValidEmail(email)) {
    return {
      ok: false,
      message: "Please enter a valid email address.",
    }
  }

  const supabase = await createClient()
  const { error } = await supabase.from("beta_sign_ups").upsert(
    {
      first_name,
      last_name,
      email,
      institution,
    },
    { onConflict: "email" },
  )

  if (error) {
    return {
      ok: false,
      message: "Something went wrong. Please try again in a moment.",
    }
  }

  return { ok: true }
}

export async function submitFeatureIdea(
  _prev: GlowLandingActionState,
  formData: FormData,
): Promise<GlowLandingActionState> {
  const email = String(formData.get("ideaEmail") ?? "").trim()
  const idea = String(formData.get("idea") ?? "").trim()

  if (!email || !idea) {
    return {
      ok: false,
      message:
        "Please enter your email in the beta sign-up form above, then try again.",
    }
  }

  if (!isValidEmail(email)) {
    return {
      ok: false,
      message: "Please enter a valid email in the beta sign-up form above.",
    }
  }

  const supabase = await createClient()
  const { error } = await supabase.from("feature_ideas").insert({
    email,
    idea,
  })

  if (error) {
    return {
      ok: false,
      message: "Something went wrong. Please try again in a moment.",
    }
  }

  return { ok: true }
}
