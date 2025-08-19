import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Detect in-app browsers that break Google SSO
function detectInApp(): "TikTok" | "Instagram" | "Facebook" | null {
  if (typeof navigator === "undefined") return null;
  const ua = (navigator.userAgent || navigator.vendor || "").toLowerCase();
  if (ua.includes("tiktok")) return "TikTok";
  if (ua.includes("instagram") || ua.includes("ig/")) return "Instagram";
  if (ua.includes("fbav") || ua.includes("fb_iab") || ua.includes("facebook")) return "Facebook";
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

  // Wait for the GIS script that index.html loads
  useEffect(() => {
    let tries = 0;
    const maxTries = 40; // ~4s total
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

  const handleGoogle = () => {
    if (inApp) {
      alert(
        `Google sign-in is blocked inside ${inApp}’s in-app browser.\n` +
          `Please open this page in Safari or Chrome and try again.`
      );
      return;
    }
    if (!GOOGLE_CLIENT_ID) {
      alert("Google sign-in isn’t configured (missing Client ID).");
      return;
    }
    if (!gisReady || !window.google) {
      alert("Google sign-in isn’t ready yet. Please try again in a moment.");
      return;
    }

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

    // Initialize + try One Tap prompt
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: onCredential,
      ux_mode: "popup",
      auto_select: false,
      itp_support: true,
    });

    // Render Google button as a fallback (often needed on iOS)
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
    }

    window.google.accounts.id.prompt((n: any) => {
      // If prompt can’t show, the rendered button still works
      if (n?.isNotDisplayed?.()) {
        console.warn("[GIS] prompt not displayed:", n?.getNotDisplayedReason?.());
      }
      if (n?.isSkippedMoment?.()) {
        console.warn("[GIS] prompt skipped");
      }
    });
  };

  const handleFacebook = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: { redirectTo: window.location.origin + "/dashboard" },
    });
    if (error) alert(error.message);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Sign in to Star Sign Studio ✨</h1>

        {/* In-app browsers (TikTok/IG/FB) — show warning instead of a broken Google flow */}
        {inApp && (
          <div className="rounded-md border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm">
            🚫 You’re inside <b>{inApp}</b>’s in-app browser.<br />
            Google login is blocked here by Google’s policies.<br />
            👉 Please open <b>www.starsignstudio.com</b> in <b>Safari</b> or <b>Chrome</b>.
          </div>
        )}

        {!inApp && (
          <div className="flex flex-col gap-3">
            <button
              onClick={handleGoogle}
              disabled={!GOOGLE_CLIENT_ID || !gisReady}
              className="w-full py-2 rounded-md bg-white text-black border hover:bg-gray-100 disabled:opacity-60"
            >
              Continue with Google
            </button>

            {/* Google official button mount (fallback/assist) */}
            <div id="googleBtnMount" />

            <button
              onClick={handleFacebook}
              className="w-full py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Continue with Facebook
            </button>
          </div>
        )}

        {/* Tiny diagnostics (optional) */}
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
