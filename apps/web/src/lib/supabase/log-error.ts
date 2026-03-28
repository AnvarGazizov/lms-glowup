/**
 * Emit structured errors to stderr for Vercel Function / runtime logs.
 * `requestPayload` is for reproducing failed writes (may include PII); keep logs access-restricted.
 */
export function logSupabaseError(
  context: string,
  error: {
    message: string
    code?: string
    status?: number
    details?: string
    hint?: string
  },
  requestPayload?: Record<string, unknown>,
): void {
  console.error(
    JSON.stringify({
      tag: "supabase_error",
      context,
      message: error.message,
      code: error.code,
      status: error.status,
      details: error.details,
      hint: error.hint,
      ...(requestPayload !== undefined ? { requestPayload } : {}),
    }),
  )
}
