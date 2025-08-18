import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { detectInAppBrowser } from "@/utils/inAppDetector";

declare global {
  interface Window {
    google?: any;
  }
}

export default function Login() {
  const [inApp, setInApp] = useState<ReturnType<typeof detectInAppBrowser>>(null);
  const [gisReady, setGisReady] = useState(false);

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

  useEffect(() => {
    setInApp(detectInAppBrowser());
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

  // Google via GIS (ID-token) — no supabase.co branding
  const handleGoogle = () => {
    if (inApp) return; // blocked in in-app browsers
    if (!gisReady || !window.google || !GOOGLE_CLIENT_ID) {
      alert("Google sign-in isn’t ready yet. Please try again.");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (response: any) => {
        const idToken = response?.credential;
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
      ux_mode: "popup",
      auto_select: false,
      itp_support: true,
    });

    window.google.accounts.id.prompt();
  };

  // Facebook keeps using redirect (works for you)
  const handleFacebook = async () => {
    if (inApp) {
      alert(`Facebook login may not work reliably inside ${inApp}. Open in Safari/Chrome for best results.`);
      return;
    }
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
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Sign in to Star Sign Studio ✨</h1>

        {inApp && (
          <div className="rounded-md border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-900">
            🚫 You’re inside <b>{inApp}</b>’s in-app browser.<br/>
            Google login is blocked here by Google’s policies.<br/>
            👉 Please open <b>www.starsignstudio.com</b> in <b>Safari</b> or <b>Chrome</b> to sign in with Google.
          </div>
        )}

        <div className="flex flex-col gap-3">
          {/* Google (GIS) — hidden/disabled in in-app browsers */}
          <button
            onClick={handleGoogle}
            disabled={!!inApp || !gisReady}
            className="w-full py-2 rounded-md bg-white text-black border hover:bg-gray-100 disabled:opacity-60"
          >
            Continue with Google
          </button>

          {/* Facebook (redirect) */}
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
