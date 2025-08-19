import { useEffect, useState } from "react";
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

  // Read from Netlify env first, then from index.html fallback
  const GOOGLE_CLIENT_ID =
    (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) ||
    window.APP_CONFIG?.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    setInApp(detectInApp());
  }, []);

  // Load Google Identity Services script
  useEffect(() => {
    if (window.google) { setGisReady(true); return; }
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.defer = true;
    s.onload = () => setGisReady(true);
    document.head.appendChild(s);
  }, []);

  // Google (GIS) ID-token login — no supabase.co redirect/branding
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

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (resp: any) => {
        const idToken = resp?.credential;
        if (!idToken) return;
        const { error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: idToken,
        });
        if (error) { alert(error.message); return; }
        window.location.href = "/dashboard";
      },
      ux_mode: "popup",
      auto_select: false,
      itp_support: true,
    });

    // Open Google chooser
    window.google.accounts.id.prompt();
  };

  // Facebook unchanged (redirect flow)
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
