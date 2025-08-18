// src/utils/inAppDetector.ts
export type InAppApp =
  | "tiktok"
  | "instagram"
  | "facebook"
  | "pinterest"
  | "youtube"
  | "gsa"
  | "android_webview"
  | null;

export function detectInAppBrowser(ua: string = navigator.userAgent || ""): InAppApp {
  const U = ua.toLowerCase();

  if (U.includes("tiktok") || U.includes("ttwebview") || U.includes("musically")) return "tiktok";
  if (U.includes("instagram") || U.includes(" ig ") || U.includes("ig/")) return "instagram";
  if (U.includes("fban") || U.includes("fbav") || U.includes("fb_iab")) return "facebook";
  if (U.includes("pinterest")) return "pinterest";
  if (U.includes("youtube")) return "youtube";
  if (U.includes("gsa")) return "gsa";
  if (U.includes("; wv;")) return "android_webview";

  return null;
}

export function inAppPrettyName(app: InAppApp): string {
  switch (app) {
    case "tiktok": return "TikTok";
    case "instagram": return "Instagram";
    case "facebook": return "Facebook";
    case "pinterest": return "Pinterest";
    case "youtube": return "YouTube";
    case "gsa": return "Google app";
    case "android_webview": return "this in-app browser";
    default: return "this app";
  }
}

export function inAppHelpMessage(app: InAppApp): string {
  switch (app) {
    case "tiktok":
      return "Google sign-in doesn’t work in TikTok’s browser. Tap the ••• menu and choose “Open in Safari/Chrome”.";
    case "instagram":
      return "Google sign-in doesn’t work in Instagram’s browser. Open this page in Safari or Chrome.";
    case "facebook":
      return "Google sign-in doesn’t work in Facebook’s browser. Open this page in Safari or Chrome.";
    case "pinterest":
      return "Google sign-in doesn’t work in Pinterest’s browser. Open this page in Safari or Chrome.";
    case "youtube":
      return "Google sign-in may be blocked in YouTube’s in-app browser. Open this page in Safari or Chrome.";
    case "gsa":
      return "Google sign-in may be blocked in the Google app’s browser. Open this page in Safari or Chrome.";
    case "android_webview":
      return "Google sign-in is blocked in this in-app browser. Open this page in Safari or Chrome.";
    default:
      return "Open this page in Safari (iPhone) or Chrome (Android) to continue with Google.";
  }
}
