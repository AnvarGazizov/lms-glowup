import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { APP_NAME } from "@lms-glowup/shared"
import { ExtensionSync } from "@/components/extension-sync"

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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {APP_NAME}
        </h1>

        {queryError === "invalid_link" && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            That sign-in link is invalid or has expired. Try signing in again.
          </p>
        )}

        {user ? (
          <div className="space-y-4">
            <ExtensionSync />
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Signed in as{" "}
              <span className="font-medium text-zinc-900 dark:text-zinc-50">
                {user.email}
              </span>
            </p>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Web sign-in is not available in this build. Magic-link login and sign-up
            pages are kept under{" "}
            <code className="rounded bg-zinc-100 px-1 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              apps/web/archived/next-app-routes
            </code>{" "}
            for you to move back into{" "}
            <code className="rounded bg-zinc-100 px-1 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              src/app
            </code>{" "}
            when you want them in the app again.
          </p>
        )}
      </div>
    </div>
  )
}
