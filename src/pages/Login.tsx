import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Detect major in-app browsers that often break OAuth / Google GIS */
function detectInApp():
  | "TikTok"
  | "YouTube"
  | "Instagram"
  | "FacebookApp"
  | "Pinterest"
  | "GoogleApp"
  | "AndroidWebView"
  | null {
  if (typeof navigator === "undefined") return null;
  const ua = (navigator.userAgent || navigator.vendor || "").toLowerCase();

  if (ua.includes("tiktok")) return "TikTok";
  if (ua.includes("youtube")) return "YouTube";
  if (ua.includes("instagram") || ua.includes("ig/")) return "Instagram";
  if (ua.includes("fbav") || ua.includes("facebook") || ua.includes("fb_iab")) return "FacebookApp";
  if (ua.includes("pinterest")) return "Pinterest";
  if (ua.includes("gsa")) return "GoogleApp";        // Google Search App webview
  if (ua.includes("; wv;")) return "AndroidWebView"; // Generic Android WebView
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

/** Policy matrix: which providers are blocked in which in-app browsers */
function providerPolicy(inApp: ReturnType<typeof detectInApp>) {
  // Default: everything allowed in real browsers (Safari/Chrome)
  const allowAll = { googleBlocked: false, facebookBlocked: false };

  if (!inApp) return allowAll;

  switch (inApp) {
    case "Instagram":
      // Your report: Facebook works, Google does not
      return { googleBlocked: true, facebookBlocked: false };
    case "Pinterest":
      // Your report: Facebook works, Google should show warning
      return { googleBlocked: true, facebookBlocked: false };
    case "TikTok":
    case "YouTube":
    case "FacebookApp":
    case "GoogleApp":
    case "AndroidWebView":
      // These are the flakiest: block both to avoid dead clicks
      return { googleBlocked: true, facebookBlocked: true };
    default:
      return allowAll;
  }
}

export default function Login() {
  const [inApp, setInApp] = useState<ReturnType<typeof detectInApp>>(null);
  const [gisReady, setGisReady] = useState(false);

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

  const { googleBlocked, facebookBlocked } = providerPolicy(inApp);

  // Wait for GIS only when Google is allowed (not in in-app) and script is present (loaded in index.html)
  useEffect(() => {
    if (googleBlocked) return;
    let tries = 0;
    const maxTries = 40; // ~4s
    const t = setInterval(() => {
      tries++;
      if (window.google) {
        setGisReady(true);
        clearInterval(t);
      } else if (tries >= maxTries) {
        clearInterval(t);
      }
    }, 100);
    return () => clearInterval(t);
  }, [googleBlocked]);

  // Initialize GIS & render official Google button (only when not blocked)
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
      if (error) {
        alert(error.message);
        return;
      }
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
      // Try One Tap too; if suppressed, the rendered button still works
      window.google.accounts.id.prompt((n: any) => {
        if (n?.isNotDisplayed?.()) {
          console.warn("[GIS] prompt not displayed:", n?.getNotDisplayedReason?.());
        }
        if (n?.isSkippedMoment?.()) {
          console.warn("[GIS] prompt skipped");
        }
      });
    }
  }, [googleBlocked, gisReady, GOOGLE_CLIENT_ID]);

  // Facebook (hide when blocked, otherwise show)
  const handleFacebook = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: { redirectTo: window.location.origin + "/dashboard" },
    });
    if (error) alert(error.message);
  };

  // Helpers in warning box
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied! Open Safari/Chrome and paste to continue.");
    } catch {
      alert("Copy failed. Long-press the address bar to copy the link.");
    }
  };
  const openInBrowser = () => {
    window.open(window.location.href, "_blank", "noopener,noreferrer");
  };
  const openInstructions = isIOS()
    ? "Tap the ••• (or aA) menu and choose “Open in Safari”."
    : isAndroid()
    ? "Tap the ⋮ menu and choose “Open in Chrome”."
    : "Open this page in your default browser.";

  // Compose the warning message based on which providers are blocked
  const warningLines: string[] = [];
  if (googleBlocked) warningLines.push("Google login doesn’t work inside this app’s browser.");
  if (facebookBlocked) warningLines.push("Facebook login may not work reliably here.");
  const showWarning = !!warningLines.length;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Sign in to Star Sign Studio ✨</h1>

        {showWarning && (
          <div className="rounded-md border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-center space-y-3">
            <div>
              {inApp ? <>You’re inside <b>{inApp}</b>’s in-app browser.</> : null}
              <br />
              {warningLines.map((l, i) => (
                <div key={i}>⚠️ {l}</div>
              ))}
              {googleBlocked && (
                <div>
                  👉 To use <b>Google</b> login, open <b>www.starsignstudio.com</b> in Safari or Chrome.
                </div>
              )}
              {facebookBlocked && (
                <div>
                  👉 If <b>Facebook</b> login fails, open in Safari/Chrome and try again.
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-center">
              <button
                onClick={copyLink}
                className="py-2 px-3 rounded-md border bg-white text-black hover:bg-gray-100"
              >
                Copy link
              </button>
              <button
                onClick={openInBrowser}
                className="py-2 px-3 rounded-md border bg-white text-black hover:bg-gray-100"
              >
                Open in browser
              </button>
            </div>

            <div className="text-xs opacity-80">{openInstructions}</div>
          </div>
        )}

        {/* Buttons area */}
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

        {/* (Optional) Small status line – remove when happy */}
        <div style={{ fontSize: 12, opacity: 0.75 }}>
          Google blocked: {googleBlocked ? "yes" : "no"}
          <br />
          Facebook blocked: {facebookBlocked ? "yes" : "no"}
          <br />
          In-app: {inApp ?? "none"}
          <br />
          GIS ready: {gisReady ? "yes" : "no"}
          <br />
          Client ID present: {(import.meta.env.VITE_GOOGLE_CLIENT_ID || window.APP_CONFIG?.VITE_GOOGLE_CLIENT_ID) ? "yes" : "no"}
        </div>
      </div>
    </main>
  );
}
