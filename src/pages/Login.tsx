import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Minimal in-app detector (TikTok / IG / FB block Google SSO)
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
  }
}

export default function Login() {
  const [inApp, setInApp] = useState<ReturnType<typeof detectInApp>>(null);
  const [gisReady, setGisReady] = useState(false);

  // MUST be set in Netlify env vars
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  useEffect(() => {
    setInApp(detectInApp());
  }, []);

  // Load Google Identity Services
  useEffect(() => {
    if (window.google) {
      setGisReady(true);
      return;
    }
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.defer = true;
    s.onload = () => setGisReady(true);
    s.onerror = () => console.warn("[GIS] failed to load script");
    document.head.appendChild(s);
  }, []);

  // GOOGLE via GIS (no supabase.co redirect, no “Supabase” branding)
  const handleGoogle = () => {
    if (inApp) {
      alert(
        `Google sign-in is blocked inside ${inApp}’s in-app browser.\n` +
        `Please open this page in Safari or Chrome and try again.`
      );
      return;
    }
    if (!GOOGLE_CLIENT_ID) {
      alert("Google sign-in isn’t configured (missing VITE_GOOGLE_CLIENT_ID).");
      console.warn("VITE_GOOGLE_CLIENT_ID is undefined at runtime.");
      return;
    }
    if (!gisReady || !window.google) {
      alert("Google sign-in isn’t ready yet. Please try again in a moment.");
      console.warn("GIS not ready:", { gisReady, hasGoogle: !!window.google });
      return;
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (resp: any) => {
        const idToken = resp?.credential;
        if (!idToken) {
          console.warn("[GIS] no credential returned");
          return;
        }
        // Supabase: requires “Skip nonce checks” ON (you have it enabled)
        const { error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: idToken,
        });
        if (error) {
          console.error("[Supabase] signInWithIdToken error:", error);
          alert(error.message);
          return;
        }
        window.location.href = "/dashboard";
      },
      ux_mode: "popup",
      auto_select: false,
      itp_support: true,
    });

    // Show the Google prompt / account chooser
    window.google.accounts.id.prompt((n: any) => {
      if (n?.isNotDisplayed?.() || n?.isSkippedMoment?.()) {
        console.warn("[GIS] prompt suppressed:", n?.getNotDisplayedReason?.());
      }
    });
  };

  // Facebook unchanged (works for you)
  const handleFacebook = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: { redirectTo: window.location.origin + "/dashboard" },
    });
    if (error) {
      console.error("[Supabase] Facebook error:", error);
      alert(error.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Sign in to Star Sign Studio ✨</h1>

        {inApp && (
          <div className="rounded-md border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm">
            🚫 You’re inside <b>{inApp}</b>’s in-app browser.<br />
            Google login is blocked here by Google’s policies.<br />
            👉 Please open <b>www.starsignstudio.com</b> in <b>Safari</b> or <b>Chrome</b>.
          </div>
        )}

        <div className="flex flex-col gap-3">
          {/* Google (GIS) — only show outside in-app browsers */}
          {!inApp && (
            <button
              onClick={handleGoogle}
              disabled={!gisReady || !GOOGLE_CLIENT_ID}
              className="w-full py-2 rounded-md bg-white text-black border hover:bg-gray-100 disabled:opacity-60"
            >
              Continue with Google
            </button>
          )}

          <button
            onClick={handleFacebook}
            className="w-full py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Continue with Facebook
          </button>
        </div>
      </div>
    </main>
  );
}
