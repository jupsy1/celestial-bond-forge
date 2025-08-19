import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Beefed-up detector for in-app browsers that block Google SSO
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
  if (ua.includes("youtube")) return "YouTube";    // YouTube in-app
  if (ua.includes("gsa")) return "GoogleApp";      // Google Search App webview
  if (ua.includes("; wv;")) return "AndroidWebView"; // generic Android WebView
  return null;
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
  const [gisError, setGisError] = useState<string | null>(null);

  // Read from Netlify env first, then from index.html fallback
  const GOOGLE_CLIENT_ID = useMemo(
    () =>
      (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) ||
      window.APP_CONFIG?.VITE_GOOGLE_CLIENT_ID,
    []
  );

  useEffect(() => {
    setInApp(detectInApp());
  }, []);

  // Wait for the GIS script (we load it in index.html)
  useEffect(() => {
    let tries = 0;
    const maxTries = 40; // ~4s
    const t = setInterval(() => {
      tries++;
      if (window.google) {
        setGisReady(true);
        clearInterval(t);
      } else if (tries >= maxTries) {
        setGisError("Google script didn’t load. Check CSP/ad-blockers/network.");
        clearInterval(t);
      }
    }, 100);
    return () => clearInterval(t);
  }, []);

  // Initialize GIS + render official Google button
  useEffect(() => {
    if (inApp) return;                   // hide Google in in-app browsers
    if (!gisReady || !window.google) return;
    if (!GOOGLE_CLIENT_ID) return;

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
      // Render the official button (this is the ONLY Google button we show)
      window.google.accounts.id.renderButton(mount, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
        logo_alignment: "left",
      });
      // Also try One Tap; if suppressed, the button still works
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

  const handleFacebook = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: { redirectTo: window.location.origin + "/dashboard" },
    });
    if (error) alert(error.message);
  };

  const inAppHelp = inApp
    ? `You’re inside ${inApp}’s in-app browser. Google login is blocked here by Google’s policies. Please open www.starsignstudio.com in Safari or Chrome.`
    : "";

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Sign in to Star Sign Studio ✨</h1>

        {inApp && (
          <div className="rounded-md border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm">
            🚫 {inAppHelp}
          </div>
        )}

        {/* Buttons */}
        {!inApp && (
          <div className="flex flex-col gap-3">
            {/* OFFICIAL Google button mount (no duplicate custom button) */}
            <div id="googleBtnMount" />

            <button
              onClick={handleFacebook}
              className="w-full py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Continue with Facebook
            </button>
          </div>
        )}

        {/* Tiny diagnostics (you can remove later) */}
        <div style={{ fontSize: 12, opacity: 0.75 }}>
          GIS ready: {gisReady ? "yes" : "no"} {gisError ? `— ${gisError}` : ""}
          <br />
          Client ID present: {GOOGLE_CLIENT_ID ? "yes" : "no"}
          <br />
          In-app: {inApp ?? "none"}
        </div>
      </div>
    </main>
  );
}
