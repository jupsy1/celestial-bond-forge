export function detectInAppBrowser(): string | null {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent || navigator.vendor || "";

  if (/FBAN|FBAV/i.test(ua)) return "Facebook";
  if (/Instagram/i.test(ua)) return "Instagram";
  if (/TikTok/i.test(ua)) return "TikTok";
  if (/Line/i.test(ua)) return "LINE";
  if (/Messenger/i.test(ua)) return "Messenger";

  return null; // normal browser
}
