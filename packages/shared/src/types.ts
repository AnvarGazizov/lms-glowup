/**
 * Shared types used across the web app and Chrome extension.
 * Add your Supabase-generated types and shared interfaces here.
 */

export interface ApiResponse<T = unknown> {
  data: T | null
  error: string | null
}

export interface User {
  id: string
  email: string
  created_at: string
}
