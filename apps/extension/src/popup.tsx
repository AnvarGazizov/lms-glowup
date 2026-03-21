import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { APP_NAME } from "@lms-glowup/shared"
import { supabase } from "~lib/supabase"

const WEB_APP_URL = "http://localhost:3000"

function IndexPopup() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })

    const handleStorageChange = () => {
      supabase.auth.getUser().then(({ data }) => {
        setUser(data.user)
      })
    }

    chrome.storage.onChanged.addListener(handleStorageChange)
    return () => chrome.storage.onChanged.removeListener(handleStorageChange)
  }, [])

  const login = () => {
    chrome.tabs.create({ url: `${WEB_APP_URL}/login?redirect=extension` })
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.muted}>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>{APP_NAME}</h2>
        <p style={styles.muted}>Sign in to get started</p>
        <button onClick={login} style={styles.button}>
          Sign In
        </button>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{APP_NAME}</h2>
      <p style={styles.muted}>
        Signed in as <strong style={styles.email}>{user.email}</strong>
      </p>
      <button onClick={logout} style={styles.outlineButton}>
        Sign Out
      </button>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: 20,
    minWidth: 300,
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  title: {
    margin: "0 0 4px 0",
    fontSize: 18,
    fontWeight: 600,
  },
  muted: {
    margin: "0 0 16px 0",
    fontSize: 13,
    color: "#71717a",
  },
  email: {
    color: "#18181b",
  },
  button: {
    width: "100%",
    padding: "8px 16px",
    fontSize: 13,
    fontWeight: 500,
    color: "#fff",
    backgroundColor: "#18181b",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  outlineButton: {
    width: "100%",
    padding: "8px 16px",
    fontSize: 13,
    fontWeight: 500,
    color: "#3f3f46",
    backgroundColor: "transparent",
    border: "1px solid #d4d4d8",
    borderRadius: 8,
    cursor: "pointer",
  },
}

export default IndexPopup
