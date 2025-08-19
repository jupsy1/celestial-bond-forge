import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Detect major in-app browsers (Google SSO blocked)
function detectInApp(): "TikTok" | "Instagram" | "Facebook" | null {
  if (typeof navigator === "undefined") return null;
  const ua = (navigator.userAgent || navigator.vendor || "").toLowerCase();
  if (ua.includes("tiktok")) return "TikTok";
  if (ua.includes("instagram") || ua.includes("ig/")) return "Instagram";
  if (ua.includes("fbav") || ua.includes("fb_iab") || ua.includes("facebook")) return "Facebook";
  return null;
}

declare global {
  interface Window { google?: any; __ENV__?: any }
}

export default function Login() {
  const [inApp, setInApp] = useState<ReturnType<typeof detectInApp>>(null);
  const [gisReady, setGisReady] = useState(false);

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const HAS_ANON = !!import.meta.env.VITE_SUPABASE_ANON_KEY;

  // expose envs for easy console check
  useEffect(() => {
    window.__ENV__ = {
      GOOGLE: GOOGLE_CLIENT_ID,
      SUPABASE_URL,
      ANON: HAS_ANON,
    };
    // eslint-disable-next-line no-console
    console.log("ENV at runtime:", window.__ENV__);
  }, [GOOGLE_CLIENT_ID, SUPABASE_URL, HAS_ANON]);

  useEffect(() => setInApp(detectInApp()), []);

  // Load Google Identity Services
  useEffect(() => {
    if (window.google) { setGisReady(true); return; }
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.defer = true;
    s.onload = () => setGisReady(true);
    s.onerror = () => console.warn("[GIS] failed to load script");
    document.head.appendChild(s);
  }, []);

  // Google with GIS (ID-token) — no supabase.co redirect
  const handleGoogle = () => {
    if (inApp) {
      alert(`Google sign-in is blocked inside ${inApp}’s in-app browser.\nOpen in Safari/Chrome and try again.`);
      return;
    }
    if (!GOOGLE_CLIENT_ID) { alert("Missing VITE_GOOGLE_CLIENT_ID"); return; }
    if (!gisReady || !window.google) { alert("Google sign-in isn’t ready yet. Try again."); return; }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (resp: any) => {
        const idToken = resp?.credential;
        if (!idToken) return;
        const { error } = await supabase.auth.signInWithIdToken({ provider: "google", token: idToken });
        if (error) { alert(error.message); return; }
        window.location.href = "/dashboard";
      },
      ux_mode: "popup",
      auto_select: false,
      itp_support: true,
    });
    window.google.accounts.id.prompt();
  };

  // Facebook unchanged
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

        {inApp && (
          <div className="rounded-md border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm">
            🚫 You’re inside <b>{inApp}</b>’s in-app browser.<br />
            Google login is blocked here. Open <b>www.starsignstudio.com</b> in <b>Safari</b> or <b>Chrome</b>.
          </div>
        )}

        <div className="flex flex-col gap-3">
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

        {/* TEMP diagnostics — remove after testing */}
        <div id="envDiag" style={{fontSize:12, opacity:0.7, marginTop:16, textAlign:"left"}}>
          <div>VITE_GOOGLE_CLIENT_ID set: {GOOGLE_CLIENT_ID ? "yes" : "no"}</div>
          <div>VITE_SUPABASE_URL set: {SUPABASE_URL ? "yes" : "no"}</div>
          <div>VITE_SUPABASE_ANON_KEY set: {HAS_ANON ? "yes" : "no"}</div>
          <div>window.google loaded: {typeof window !== "undefined" && (window as any).google ? "yes" : "no"}</div>
          <div style={{wordBreak:"break-all"}}>UA: {typeof navigator !== "undefined" ? navigator.userAgent : "n/a"}</div>
        </div>
      </div>
    </main>
  );
}
