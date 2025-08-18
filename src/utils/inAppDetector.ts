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

// Helpful message for users
export function inAppHelpMessage(app: "tiktok" | "instagram" | "facebook" | null): string {
  if (!app) return ""
  return "For the best experience, please open this page in Safari or Chrome instead."
}
