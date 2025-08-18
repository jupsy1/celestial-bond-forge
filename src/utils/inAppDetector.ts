// src/utils/inAppDetector.ts
export type InAppApp =
  | "tiktok"
  | "youtube"
  | "pinterest"
  | "instagram"
  | "facebook"
  | "android_webview"
  | null;

/** Detect if the app is being opened inside an in-app browser */
export function detectInAppBrowser(
  ua: string = navigator.userAgent || "",
  ref: string = document.referrer || ""
): InAppApp {
  const U = ua.toLowerCase();
  const R = ref.toLowerCase();

  if (U.includes("tiktok") || U.includes("musically") || U.includes("ttwebview") || R.includes("tiktok")) return "tiktok";
  if (U.includes("instagram") || U.includes(" ig ") || U.includes("ig/") || R.includes("instagram")) return "instagram";
  if (U.includes("fban") || U.includes("fbav") || U.includes("fb_iab") || R.includes("facebook")) return "facebook";
  if (U.includes("pinterest") || R.includes("pinterest")) return "pinterest";
  if (U.includes("youtube") || U.includes("gsa") || R.includes("youtube")) return "youtube";

  // Generic Android webview hint
  if (U.includes("; wv;")) return "android_webview";

  return null;
}

/** Return a friendly name to show in the alert */
export function inAppPrettyName(app: InAppApp): string {
  switch (app) {
    case "tiktok": return "TikTok";
    case "instagram": return "Instagram";
    case "facebook": return "Facebook";
    case "pinterest": return "Pinterest";
    case "youtube": return "YouTube";
    case "android_webview": return "this in-app browser";
    default: return "this app";
  }
}
