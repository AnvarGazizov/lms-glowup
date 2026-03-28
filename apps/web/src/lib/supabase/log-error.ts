/**
 * Emit structured errors to stderr for Vercel Function / runtime logs.
 * Do not pass PII (emails, tokens) in `context` or extra fields.
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
  extra?: Record<string, string | number | boolean | undefined>,
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
      ...extra,
    }),
  )
}
