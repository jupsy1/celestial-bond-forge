// src/utils/inAppDetector.ts

// Detect if we’re inside TikTok/Instagram/Facebook in-app browsers
export function isInApp(): "tiktok" | "instagram" | "facebook" | null {
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes("tiktok")) return "tiktok"
  if (ua.includes("instagram")) return "instagram"
  if (ua.includes("fbav")) return "facebook"
  return null
}

// Pretty name for display
export function inAppPrettyName(app: "tiktok" | "instagram" | "facebook" | null): string {
  if (app === "tiktok") return "TikTok"
  if (app === "instagram") return "Instagram"
  if (app === "facebook") return "Facebook"
  return "Unknown App"
}

// Helpful message (for debugging/logging, optional UI)
export function inAppHelpMessage(app: "tiktok" | "instagram" | "facebook" | null): string {
  if (!app) return ""
  return "For the best experience, we’ll open this page in your default browser."
}

// 🔥 Auto-redirect out of in-app browsers
export function handleInAppRedirect() {
  const app = isInApp()
  if (!app) return

  // Force open in the system browser
  // iOS/Android trick: using window.open with _blank sometimes doesn’t work in WebView
  // Instead, replace location directly:
  const currentUrl = window.location.href
  window.location.href = currentUrl
}
