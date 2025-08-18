import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// --- Simple detector: catch TikTok / Instagram / Facebook in-app browsers
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
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

  // Detect in-app once
  useEffect(() => {
    setInApp(detectInApp());
  }, []);

  // Load Google Identity Services script
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

  // Google via GIS (ID token) — branded to your domain/app
  const handleGoogle = () => {
    if (!gisReady || !window.google || !GOOGLE_CLIENT_ID) {
      alert("Google sign-in is not ready. Please try again in a moment.");
      return;
    }
    // Initialize one-off flow
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
          console.error("Supabase Google error:", error.message);
          alert(error.message);
        } else {
          window.location.href = "/dashboard";
        }
      },
      // Optional UX tuning:
      ux_mode: "popup",            // keep users on your page
      auto_select: false,
      itp_support: true,
    });

    // Show account chooser / one-tap prompt
    window.google.accounts.id.prompt();
  };

  // Facebook (keep as-is; works for you)
  const handleFacebook = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: { redirectTo: window.location.origin + "/dashboard" },
    });
    if (error) {
      console.error("Facebook error:", error.message);
      alert(error.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white/5 border border-white/10 p-6 text-white">
        <h1 className="text-center text-2xl font-bold mb-6">
          Sign in to <span className="text-purple-300">Star Sign Studio</span>
        </h1>

        <div className="space-y-3">
          {/* Facebook works for you everywhere; keep it visible */}
          <button
            onClick={handleFacebook}
            className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700"
          >
            Continue with Facebook
          </button>

          {/* Google: hide inside in-app browsers that will be blocked */}
          {inApp ? (
            <div className="rounded-md border border-yellow-500/40 bg-yellow-500/10 px-3 py-2 text-sm text-yellow-100 text-center">
              Google sign-in doesn’t work inside <b>{inApp}</b>’s in-app browser.
              <br />
              Please open this page in <b>Safari</b> or <b>Chrome</b> and try again.
            </div>
          ) : (
            <button
              onClick={handleGoogle}
              className="w-full py-2 rounded-md bg-white text-black hover:bg-gray-200"
              disabled={!gisReady}
            >
              Continue with Google
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
