import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Detect major in-app browsers that block Google SSO
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

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  useEffect(() => {
    setInApp(detectInApp());
  }, []);

  // Load Google Identity Services (GIS) script
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
    document.head.appendChild(s);
  }, []);

  // Google with GIS (ID token) — NO redirect to supabase.co
  const handleGoogle = () => {
    if (inApp) {
      alert(
        `Google sign-in is blocked inside ${inApp}’s in-app browser.\n` +
        `Please open this page in Safari or Chrome and try again.`
      );
      return;
    }
    if (!gisReady || !window.google || !GOOGLE_CLIENT_ID) {
      alert("Google sign-in isn’t ready (missing script or client ID). Please try again in a moment.");
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
        if (error) {
          alert(error.message);
          return;
        }
        window.location.href = "/dashboard";
      },
      ux_mode: "popup",
      auto_select: false,
      itp_support: true,
    });

    window.google.accounts.id.prompt();
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

        {/* In-app browser warning (Google is blocked here) */}
        {inApp && (
          <div className="rounded-md border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm">
            🚫 You’re inside <b>{inApp}</b>’s in-app browser.<br />
            Google login is blocked here by Google’s policies.<br />
            👉 Please open <b>www.starsignstudio.com</b> in <b>Safari</b> or <b>Chrome</b> to sign in with Google.
          </div>
        )}

        <div className="flex flex-col gap-3">
          {/* Google (GIS) — only show if not in an in-app browser */}
          {!inApp && (
            <button
              onClick={handleGoogle}
              disabled={!gisReady || !GOOGLE_CLIENT_ID}
              className="w-full py-2 rounded-md bg-white text-black border hover:bg-gray-100 disabled:opacity-60"
            >
              Continue with Google
            </button>
          )}

          {/* Facebook left as redirect (works for you) */}
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
