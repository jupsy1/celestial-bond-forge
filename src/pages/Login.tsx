import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Detect major in-app browsers that break Google GIS */
function detectInApp():
  | "TikTok"
  | "Instagram"
  | "Facebook"
  | "YouTube"
  | "GoogleApp"
  | "AndroidWebView"
  | null {
  if (typeof navigator === "undefined") return null;
  const ua = (navigator.userAgent || navigator.vendor || "").toLowerCase();

  if (ua.includes("tiktok")) return "TikTok";
  if (ua.includes("instagram") || ua.includes("ig/")) return "Instagram";
  if (ua.includes("fbav") || ua.includes("fb_iab") || ua.includes("facebook")) return "Facebook";
  if (ua.includes("youtube")) return "YouTube";      // YouTube app webview
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

  // Wait for GIS (loaded globally in index.html). Don’t even try inside in-app browsers.
  useEffect(() => {
    if (inApp) return;
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
  }, [inApp]);

  // Initialize GIS & render the official Google button (only outside in-app)
  useEffect(() => {
    if (inApp) return;
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
  }, [inApp, gisReady, GOOGLE_CLIENT_ID]);

  // Facebook (works for you even in in-app)
  const handleFacebook = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: { redirectTo: window.location.origin + "/dashboard" },
    });
    if (error) alert(error.message);
  };

  // Helpers for the warning box
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied! Open Safari/Chrome and paste to continue.");
    } catch {
      alert("Copy failed. Long-press the address bar to copy the link.");
    }
  };

  const openInBrowser = () => {
    // This will open a new tab – some in-app browsers still keep you inside.
    // The message below tells users how to open in the real browser if needed.
    window.open(window.location.href, "_blank", "noopener,noreferrer");
  };

  const openInstructions = isIOS()
    ? "Tap the ••• (or aA) menu and choose “Open in Safari”."
    : isAndroid()
    ? "Tap the ⋮ menu and choose “Open in Chrome”."
    : "Open this page in your default browser.";

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Sign in to Star Sign Studio ✨</h1>

        {/* In-app browsers: explain Google, keep Facebook available */}
        {inApp ? (
          <div className="rounded-md border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-center space-y-3">
            <div>
              ⚠️ Google login doesn’t work inside <b>{inApp}</b>’s in-app browser.
              <br />
              👉 Please open <b>www.starsignstudio.com</b> in Safari or Chrome to use Google login.
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

            <div className="pt-2">
              ✅ You can still log in with Facebook below.
            </div>
          </div>
        ) : null}

        {/* Buttons area */}
        <div className="flex flex-col gap-3">
          {/* Google button only outside in-app */}
          {!inApp && <div id="googleBtnMount" />}

          {/* Facebook always visible */}
          <button
            onClick={handleFacebook}
            className="w-full py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Continue with Facebook
          </button>
        </div>

        {/* (Optional) Small status line – remove once happy */}
        <div style={{ fontSize: 12, opacity: 0.75 }}>
          GIS ready: {gisReady ? "yes" : "no"}
          <br />
          Client ID present: {GOOGLE_CLIENT_ID ? "yes" : "no"}
          <br />
          In-app: {inApp ?? "none"}
        </div>
      </div>
    </main>
  );
}
