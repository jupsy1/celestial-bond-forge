// src/utils/inAppDetector.ts

import { useEffect, useState } from "react"

// Detect if we’re inside TikTok/Instagram/Facebook in-app browsers
export function isInApp(): "tiktok" | "instagram" | "facebook" | null {
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes("tiktok")) return "tiktok"
  if (ua.includes("instagram")) return "instagram"
  if (ua.includes("fbav")) return "facebook"
  return null
}

// Pretty names
export function inAppPrettyName(app: "tiktok" | "instagram" | "facebook" | null): string {
  if (app === "tiktok") return "TikTok"
  if (app === "instagram") return "Instagram"
  if (app === "facebook") return "Facebook"
  return "Unknown App"
}

// Small helper for UI
export function inAppHelpMessage(app: "tiktok" | "instagram" | "facebook" | null): string {
  if (!app) return ""
  return `You’re currently inside ${inAppPrettyName(app)}’s in-app browser. 
We’ll open the page in Safari/Chrome so login works properly.`
}

// Hook that shows redirect message, then auto-redirects
export function useInAppRedirect() {
  const [app, setApp] = useState<"tiktok" | "instagram" | "facebook" | null>(null)
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    const detected = isInApp()
    if (detected) {
      setApp(detected)
      setRedirecting(true)

      // Show message briefly, then redirect
      setTimeout(() => {
        window.location.href = window.location.href
      }, 2000) // 2 second delay so user sees why
    }
  }, [])

  return { app, redirecting }
}
