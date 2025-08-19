import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Broad in-app / webview detection */
function detectInApp():
  | "TikTok"
  | "YouTube"
  | "Instagram"
  | "FacebookApp"
  | "Pinterest"
  | "GoogleApp"
  | "AndroidWebView"
  | "iOSWebView"
  | null {
  if (typeof navigator === "undefined") return null;
  const ua = (navigator.userAgent || navigator.vendor || "").toLowerCase();

  if (ua.includes("tiktok")) return "TikTok";
  if (ua.includes("youtube")) return "YouTube";
  if (ua.includes("instagram") || ua.includes("ig/")) return "Instagram";
  if (ua.includes("fbav") || ua.includes("fb_iab") || ua.includes("facebook")) return "FacebookApp";
  if (ua.includes("pinterest")) return "Pinterest";
  if (ua.includes("gsa")) return "GoogleApp";            // Google Search App
  if (ua.includes("; wv;")) return "AndroidWebView";     // Android WebView

  const isiOS = /iphone|ipad|ipod/.test(ua);
  const isSafari = ua.includes("safari");
  if (isiOS && !isSafari) return "iOSWebView";           // iOS WebView heuristic

  return null;
}

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}
function isAndroid() {
  if (typeof navigator === "undefined") return false;
  return /android/i.test(navigator.userAgent);
}

declare global {
  interface Window {
    google?: any;
    APP_CONFIG?: { VITE_GOOGLE_CLIENT_ID?: string };
  }
}

/** Provider policy per environment */
function providerPolicy(inApp: ReturnType<typeof detectInApp>) {
  const allowAll = { googleBlocked: false, facebookBlocked: false };
  if (!inApp) return allowAll;

  switch (inApp) {
    case "Instagram":
    case "Pinterest":
      // Your report: Google blocked, Facebook OK
      return { googleBlocked: true, facebookBlocked: false };
    case "TikTok":
    case "YouTube":
    case "FacebookApp":
    case "GoogleApp":
    case "AndroidWebView":
    case "iOSWebView":
      // Flakiest: block both to avoid dead clicks
      return { googleBlocked: true, facebookBlocked: true };
    default:
      return allowAll;
  }
}

export default function Login() {
  const [inApp, setInApp] = useState<ReturnType<typeof detectInApp>>(null);
  const [gisReady, setGisReady] = useState(false);
  const [gisTimeoutFired, setGisTimeoutFired] = useState(false); // safety‑net if GIS fails to load
  const [copied, setCopied] = useState(false);                   // ✅ show “Copied ✓”
  const [shareError, setShareError] = useState<string | null>(null);

  // Prefer Netlify env; fall back to index.html APP_CONFIG
  const GOOGLE_CLIENT_ID = useMemo(
    () =>
      (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) ||
      window.APP_CONFIG?.VITE_GOOGLE_CLIENT_ID,
    []
  );

  useEffect(() => {
    setInApp(detectInApp());
  }, []);

  const { googleBlocked: blockedByUA, facebookBlocked } = providerPolicy(inApp);
  const googleBlocked = blockedByUA || gisTimeoutFired;

  // Poll for GIS; if it doesn't appear in ~3s, assume blocked (webview/CSP)
  useEffect(() => {
    if (blockedByUA) return;
    let tries = 0;
    const maxTries = 40; // ~4s
    const poll = setInterval(() => {
      tries++;
      if (window.google) {
        setGisReady(true);
        clearInterval(poll);
      } else if (tries >= maxTries) {
        clearInterval(poll);
      }
    }, 100);
    const timeout = setTimeout(() => {
      if (!window.google) setGisTimeoutFired(true);
    }, 3000);
    return () => {
      clearInterval(poll);
      clearTimeout(timeout);
    };
  }, [blockedByUA]);

  // Initialize GIS & render official Google button (ID‑token; no Supabase branding)
  useEffect(() => {
    if (googleBlocked) return;
    if (!gisReady || !window.google || !GOOGLE_CLIENT_ID) return;

    const onCredential = async (resp: any) => {
      const idToken = resp?.credential;
      if (!idToken) return;
      const { error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: idToken,
      });
      if (error) { alert(error.message); return; }
      window.location.href = "/dashboard";
    };

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: onCredential,
      ux_mode: "popup",
      auto_select: false,
      itp_support: true,
    });

    const mount = document.getElementById("googleBtnMount");
    if (mount) {
      window.google.accounts.id.renderButton(mount, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
        logo_alignment: "left",
      });
      window.google.accounts.id.prompt(); // optional One Tap
    }
  }, [googleBlocked, gisReady, GOOGLE_CLIENT_ID]);

  // Facebook via redirect (keep)
  const handleFacebook = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: { redirectTo: window.location.origin + "/dashboard" },
    });
    if (error) alert(error.message);
  };

  // ✅ Better “Copy link” with visible confirmation + fallback
  const copyLink = async () => {
    const url = window.location.href;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for older in‑app browsers
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      alert("Copy failed. Long‑press the address bar to copy the link.");
    }
  };

  // ✅ Use native share sheet when available (often better than window.open)
  const canShare = typeof navigator !== "undefined" && !!navigator.share;
  const shareLink = async () => {
    setShareError(null);
    try {
      await navigator.share({
        title: "Star Sign Studio",
        text: "Open this in your browser to sign in:",
        url: window.location.href,
      });
    } catch (e: any) {
      // User cancelled or share not available
      if (e && e.name !== "AbortError") setShareError("Share unavailable here. Try Copy link instead.");
    }
  };

  // ✅ Render an actual anchor styled as a button (more reliable in webviews)
  const externalHref = "https://www.starsignstudio.com/login";

  // Helpers for warning box
  const openInstructions = isIOS()
    ? "Tap the ••• (or aA) menu and choose “Open in Safari”."
    : isAndroid()
    ? "Tap the ⋮ menu and choose “Open in Chrome”."
    : "Open this page in your default browser.";

  // Always show a warning if ANY provider is blocked
  const warningLines: string[] = [];
  if (googleBlocked) warningLines.push("Google login doesn’t work inside this app’s browser.");
  if (facebookBlocked) warningLines.push("Facebook login doesn’t work reliably inside this app’s browser.");
  const showWarning = googleBlocked || facebookBlocked;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Sign in to Star Sign Studio ✨</h1>

        {showWarning && (
          <div className="rounded-md border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-center space-y-3">
            <div>
              {inApp ? <>You’re inside <b>{inApp}</b>’s in‑app browser.</> : null}
              <br />
              {warningLines.map((l, i) => (<div key={i}>⚠️ {l}</div>))}
              {googleBlocked && (
                <div>👉 To use <b>Google</b> login, open <b>www.starsignstudio.com</b> in Safari or Chrome.</div>
              )}
              {facebookBlocked && (
                <div>👉 If <b>Facebook</b> login fails, open in Safari/Chrome and try again.</div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={copyLink}
                className="py-2 px-3 rounded-md border bg-white text-black hover:bg-gray-100"
              >
                Copy link
              </button>

              {/* Visible anchor as button */}
              <a
                href={externalHref}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 rounded-md border bg-white text-black hover:bg-gray-100 inline-flex items-center justify-center"
              >
                Open in browser
              </a>

              {canShare && (
                <button
                  onClick={shareLink}
                  className="py-2 px-3 rounded-md border bg-white text-black hover:bg-gray-100"
                >
                  Share…
                </button>
              )}
            </div>

            <div className="text-xs opacity-80">{openInstructions}</div>

            {/* Small confirmations/errors */}
            <div className="text-xs">
              {copied && <span className="text-green-600">Link copied ✓</span>}
              {!copied && shareError && <span className="text-red-600">{shareError}</span>}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {/* Google button only when not blocked */}
          {!googleBlocked && <div id="googleBtnMount" />}

          {/* Facebook button only when not blocked */}
          {!facebookBlocked && (
            <button
              onClick={handleFacebook}
              className="w-full py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Continue with Facebook
            </button>
          )}
        </div>

        {/* Diagnostics (optional, remove when done) */}
        <div style={{ fontSize: 12, opacity: 0.75 }}>
          In-app: {inApp ?? "none"} | GIS ready: {gisReady ? "yes" : "no"} | GIS timeout: {gisTimeoutFired ? "yes" : "no"}
        </div>
      </div>
    </main>
  );
}
