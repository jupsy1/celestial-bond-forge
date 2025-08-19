// src/utils/inAppDetector.ts
export function detectInAppBrowser(ua: string = (navigator.userAgent || navigator.vendor || "").toLowerCase()) {
  if (ua.includes("tiktok")) return "TikTok";
  if (ua.includes("instagram") || ua.includes("ig/")) return "Instagram";
  if (ua.includes("fbav") || ua.includes("fb_iab") || ua.includes("facebook")) return "Facebook";
  if (ua.includes("youtube")) return "YouTube";
  if (ua.includes("pinterest")) return "Pinterest";
  if (ua.includes("gsa")) return "Google App";
  if (ua.includes("; wv;")) return "Android WebView";

  const isiOS = /iphone|ipad|ipod/.test(ua);
  const isSafari = ua.includes("safari");
  if (isiOS && !isSafari) return "iOS WebView";
  return null;
}

export function inAppHelp(inApp: string | null) {
  if (!inApp) return null;
  const base = "You’re inside this app’s built-in browser.";
  switch (inApp) {
    case "TikTok":
    case "YouTube":
    case "Instagram":
    case "Facebook":
    case "Pinterest":
      return `${base} Google login is blocked here. Open in Safari/Chrome to continue.`;
    default:
      return `${base} If Google/Facebook fail, open in Safari/Chrome.`;
  }
}
