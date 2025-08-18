// src/utils/inAppDetector.ts

export function detectInAppBrowser() {
  const ua = navigator.userAgent || navigator.vendor || "";
  if (/tiktok/i.test(ua)) return "TikTok";
  if (/instagram/i.test(ua)) return "Instagram";
  if (/fbav|facebook/i.test(ua)) return "Facebook";
  return null;
}

export function forceOpenInBrowser() {
  try {
    const url = window.location.href;
    // Try to open in Safari/Chrome
    window.open(url, "_blank");
  } catch (err) {
    console.error("Redirect failed", err);
  }
}
