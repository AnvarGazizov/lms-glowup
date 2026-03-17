"use client"

import { useExtensionAuth } from "@/hooks/use-extension-auth"

export function ExtensionSync() {
  useExtensionAuth()
  return null
}
