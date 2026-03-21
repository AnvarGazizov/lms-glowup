export const WEB_APP_URL = "http://localhost:3000" as const

export const WEB_APP_LOGIN_REDIRECT_URL =
  `${WEB_APP_URL}/login?redirect=extension` as const
