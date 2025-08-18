import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Detect the main in-app browsers that block Google
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
  const [log, setLog] = useState<string[]>([]);

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  const addLog = (m: string) => setLog((prev) => [...prev, m]);

  useEffect(() => {
    const detected = detectInApp();
    setInApp(detected);
    addLog(`UA: ${navigator.userAgent}`);
    addLog(`Detected in-app: ${detected ?? "none"}`);
  }, []);

  // Load Google Identity Services script
  useEffect(() => {
    if (window.google) {
      setGisReady(true);
      addLog("GIS already on window");
      return;
    }
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.defer = true;
    s.onload = () => {
      setGisReady(true);
      addLog("GIS script loaded");
    };
    s.onerror = () => addLog("GIS script failed to load");
    document.head.appendChild(s);
  }, []);

  const fallbackSupabaseRedirect = async () => {
    // Last-resort: classic redirect (shows supabase.co but guarantees a flow)
    addLog("FALLBACK: Supabase OAuth redirect");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/dashboard" },
    });
    if (error) {
      addLog(`Supabase redirect error: ${error.message}`);
      alert(error.message);
    }
  };

  const handleGoogle = async () => {
    if (inApp) {
      alert(
        `Google sign-in is blocked inside ${inApp}’s in-app browser.\n` +
        `Please open this page in Safari/Chrome and try again.`
      );
      return;
    }

    if (!GOOGLE_CLIENT_ID) {
      addLog("Missing VITE_GOOGLE_CLIENT_ID");
      // No client id in env → fallback so user can still login
      await fallbackSupabaseRedirect();
      return;
    }

    if (!gisReady || !window.google) {
      addLog("GIS not ready, using fallback redirect");
      await fallbackSupabaseRedirect();
      return;
    }

    try {
      addLog("Initializing GIS");
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response: any) => {
          const idToken = response?.credential;
          if (!idToken) {
            addLog("No credential returned from GIS");
            // If user closed the popup or nothing returned, try fallback
            await fallbackSupabaseRedirect();
            return;
          }
          addLog("Got GIS id_token, logging into Supabase");
          const { error } = await supabase.auth.signInWithIdToken({
            provider: "google",
            token: idToken,
          });
          if (error) {
            addLog(`Supabase signInWithIdToken error: ${error.message}`);
            alert(error.message);
            return;
          }
          window.location.href = "/dashboard";
        },
        ux_mode: "popup",
        auto_select: false,
        itp_support: true,
      });

      // Show account chooser / prompt
      window.google.accounts.id.prompt((notification: any) => {
        // If the one-tap/prompt is suppressed, go to fallback
        if (notification?.isNotDisplayed() || notification?.isSkippedMoment()) {
          addLog(`GIS prompt suppressed: ${notification?.getNotDisplayedReason?.() ?? "unknown"}`);
          fallbackSupabaseRedirect();
        }
      });
    } catch (e: any) {
      addLog(`GIS exception: ${e?.message ?? e}`);
      await fallbackSupabaseRedirect();
    }
  };

  const handleFacebook = async () => {
    if (inApp) {
      // FB often works in-app, but warn just in case
      // You can remove this alert if you prefer
      // alert(`If Facebook doesn’t open, please open in Safari/Chrome and try again.`);
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: { redirectTo: window.location.origin + "/dashboard" },
    });
    if (error) {
      addLog(`Facebook error: ${error.message}`);
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
            Google blocks sign-in here. Please open <b>www.starsignstudio.com</b> in <b>Safari</b> or <b>Chrome</b>.
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoogle}
            disabled={!!inApp}
            className="w-full py-2 rounded-md bg-white text-black border hover:bg-gray-100 disabled:opacity-60"
          >
            Continue with Google
          </button>

          <button
            onClick={handleFacebook}
            className="w-full py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Continue with Facebook
          </button>
        </div>

        {/* Developer diagnostics (optional). Remove if you don’t want logs shown. */}
        <details className="text-xs opacity-70 mt-4">
          <summary>diagnostics</summary>
          <pre className="whitespace-pre-wrap break-words">
{`gisReady=${gisReady}
hasGoogle=${!!window.google}
VITE_GOOGLE_CLIENT_ID set=${!!GOOGLE_CLIENT_ID}
inApp=${inApp ?? "none"}

`}{log.join("\n")}
          </pre>
        </details>
      </div>
    </main>
  );
}
