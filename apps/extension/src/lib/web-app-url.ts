export const WEB_APP_URL = "http://localhost:3000" as const

/** Opens the web app home; /login is archived — restore routes to use magic-link flow again. */
export const WEB_APP_LOGIN_REDIRECT_URL = `${WEB_APP_URL}/` as const
