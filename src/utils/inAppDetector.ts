// src/utils/inAppDetector.ts
export function detectInApp(): "tiktok" | "instagram" | "facebook" | null {
  const ua = navigator.userAgent.toLowerCase();

  if (ua.includes("tiktok")) return "tiktok";
  if (ua.includes("instagram")) return "instagram";
  if (ua.includes("fbav") || ua.includes("facebook")) return "facebook";

  return null;
}

export function redirectIfInApp() {
  const inApp = detectInApp();
  if (!inApp) return;

  const currentUrl = window.location.href;

  // Deep link out of the in-app browser
  if (/iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())) {
    // iOS → Safari
    window.location.href = `x-safari-${currentUrl}`;
  } else if (/android/.test(navigator.userAgent.toLowerCase())) {
    // Android → Chrome
    window.location.href = `intent://${currentUrl.replace(/^https?:\/\//, "")}#Intent;scheme=https;package=com.android.chrome;end`;
  }
}
