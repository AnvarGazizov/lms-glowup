"use client"

import Link from "next/link"
import { useExtensionAuth } from "@/hooks/use-extension-auth"

export default function ExtensionCallbackPage() {
  const status = useExtensionAuth()

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-sm space-y-4 rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {status === "sending" && (
          <>
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-600 dark:border-t-zinc-100" />
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Signing you into the extension...
            </p>
          </>
        )}

        {status === "success" && (
          <div className="space-y-2">
            <div className="text-3xl">&#10003;</div>
            <p className="font-medium text-zinc-900 dark:text-zinc-50">
              You&apos;re signed in!
            </p>
          </div>
        )}

        {status === "no_session" && (
          <div className="space-y-2">
            <p className="font-medium text-red-600 dark:text-red-400">
              No active session found
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Please{" "}
              <Link
                href="/"
                className="font-medium text-zinc-900 hover:underline dark:text-zinc-50"
              >
                sign in
              </Link>{" "}
              first.
            </p>
          </div>
        )}

        {status === "extension_not_found" && (
          <div className="space-y-2">
            <p className="font-medium text-amber-600 dark:text-amber-400">
              Could not connect to the extension
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Make sure the extension is installed and enabled, then try again.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
