import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  if (ua.includes("youtube")) return "YouTube";
  if (ua.includes("gsa")) return "GoogleApp";
  if (ua.includes("; wv;")) return "AndroidWebView";
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

  const GOOGLE_CLIENT_ID = useMemo(
    () =>
      (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) ||
      window.APP_CONFIG?.VITE_GOOGLE_CLIENT_ID,
    []
  );

  useEffect(() => {
    setInApp(detectInApp());
  }, []);

  useEffect(() => {
    if (inApp) return; // don’t load GIS inside in-app browsers
    let tries = 0;
    const maxTries = 40;
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
    });

    const mount = document.getElementById("googleBtnMount");
    if (mount) {
      window.google.accounts.id.renderButton(mount, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
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

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Sign in to Star Sign Studio ✨</h1>

        {inApp ? (
          <div className="rounded-md border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-center">
            🚫 You’re inside <b>{inApp}</b>’s in-app browser.<br />
            Google login is blocked here by Google’s policies.<br />
            👉 Please open <b>www.starsignstudio.com</b> in Safari or Chrome to continue.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div id="googleBtnMount" />
            <button
              onClick={handleFacebook}
              className="w-full py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Continue with Facebook
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
