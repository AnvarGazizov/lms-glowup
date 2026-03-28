import { ExtensionSync } from "@/components/extension-sync"
import { GlowBetaLanding } from "@/components/glow-beta-landing"
import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"
import { Fira_Sans } from "next/font/google"
import { redirect } from "next/navigation"

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  title: "Glow — Brightspace Chrome Extension | Beta Access",
  description:
    "A brand new Chrome Extension is coming to Brightspace. Be one of the first to experience a fully personalized LMS — built around how you learn.",
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { error: queryError } = await searchParams

  async function signOut() {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/")
  }

  return (
    <div className={`${firaSans.className} min-h-screen`}>
      {user ? <ExtensionSync /> : null}
      <GlowBetaLanding
        showInvalidLinkError={queryError === "invalid_link"}
        signedInEmail={user?.email ?? null}
        signOut={user ? signOut : undefined}
      />
    </div>
  )
}
