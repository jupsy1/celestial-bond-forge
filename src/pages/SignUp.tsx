import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Same in-app detection as Login */
function detectInApp():
  | "TikTok"
  | "YouTube"
  | "Instagram"
  | "FacebookApp"
  | "Pinterest"
  | "GoogleApp"
  | "AndroidWebView"
  | "iOSWebView"
  | null {
  if (typeof navigator === "undefined") return null;
  const ua = (navigator.userAgent || navigator.vendor || "").toLowerCase();

  if (ua.includes("tiktok")) return "TikTok";
  if (ua.includes("youtube")) return "YouTube";
  if (ua.includes("instagram") || ua.includes("ig/")) return "Instagram";
  if (ua.includes("fbav") || ua.includes("fb_iab") || ua.includes("facebook")) return "FacebookApp";
  if (ua.includes("pinterest")) return "Pinterest";
  if (ua.includes("gsa")) return "GoogleApp";
  if (ua.includes("; wv;")) return "AndroidWebView";

  const isiOS = /iphone|ipad|ipod/.test(ua);
  const isSafari = ua.includes("safari");
  if (isiOS && !isSafari) return "iOSWebView";

  return null;
}

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}
function isAndroid() {
  if (typeof navigator === "undefined") return false;
  return /android/i.test(navigator.userAgent);
}

declare global {
  interface Window {
    google?: any;
    APP_CONFIG?: { VITE_GOOGLE_CLIENT_ID?: string };
  }
}

function providerPolicy(inApp: ReturnType<typeof detectInApp>) {
  const allowAll = { googleBlocked: false, facebookBlocked: false };
  if (!inApp) return allowAll;

  switch (inApp) {
    case "Instagram":
    case "Pinterest":
      return { googleBlocked: true, facebookBlocked: false };
    case "TikTok":
    case "YouTube":
    case "FacebookApp":
    case "GoogleApp":
    case "AndroidWebView":
    case "iOSWebView":
      return { googleBlocked: true, facebookBlocked: true };
    default:
      return allowAll;
  }
}

export default function SignUp() {
  const [inApp, setInApp] = useState<ReturnType<typeof detectInApp>>(null);
  const [gisReady, setGisReady] = useState(false);
  const [gisTimeoutFired, setGisTimeoutFired] = useState(false);

  const GOOGLE_CLIENT_ID = useMemo(
    () =>
      (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) ||
      window.APP_CONFIG?.VITE_GOOGLE_CLIENT_ID,
    []
  );

  useEffect(() => {
    setInApp(detectInApp());
  }, []);

  const { googleBlocked: blockedByUA, facebookBlocked } = providerPolicy(inApp);
  const googleBlocked = blockedByUA || gisTimeoutFired;

  useEffect(() => {
    if (blockedByUA) return;
    let tries = 0;
    const maxTries = 40;
    const poll = setInterval(() => {
      tries++;
      if (window.google) {
        setGisReady(true);
        clearInterval(poll);
      } else if (tries >= maxTries) {
        clearInterval(poll);
      }
    }, 100);

    const timeout = setTimeout(() => {
      if (!window.google) setGisTimeoutFired(true);
    }, 3000);

    return () => {
      clearInterval(poll);
      clearTimeout(timeout);
    };
  }, [blockedByUA]);

  useEffect(() => {
    if (googleBlocked) return;
    if (!gisReady || !window.google || !GOOGLE_CLIENT_ID) return;

    const onCredential = async (resp: any) => {
      const idToken = resp?.credential;
      if (!idToken) return;
      const { error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: idToken,
      });
      if (error) { alert(error.message); return; }
      window.location.href = "/dashboard";
    };

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: onCredential,
      ux_mode: "popup",
      auto_select: false,
      itp_support: true,
    });

    const mount = document.getElementById("googleSignupBtnMount");
    if (mount) {
      window.google.accounts.id.renderButton(mount, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "signup_with",
        shape: "pill",
        logo_alignment: "left",
      });
      window.google.accounts.id.prompt();
    }
  }, [googleBlocked, gisReady, GOOGLE_CLIENT_ID]);

  const handleFacebook = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: { redirectTo: window.location.origin + "/dashboard" },
    });
    if (error) alert(error.message);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied! Open Safari/Chrome and paste to continue.");
    } catch {
      alert("Copy failed. Long-press the address bar to copy the link.");
    }
  };
  const openInBrowser = () => {
    window.open(window.location.href, "_blank", "noopener,noreferrer");
  };
  const openInstructions = isIOS()
    ? "Tap the ••• (or aA) menu and choose “Open in Safari”."
    : isAndroid()
    ? "Tap the ⋮ menu and choose “Open in Chrome”."
    : "Open this page in your default browser.";

  const warningLines: string[] = [];
  if (googleBlocked) warningLines.push("Google sign up doesn’t work inside this app’s browser.");
  if (facebookBlocked) warningLines.push("Facebook sign up doesn’t work reliably inside this app’s browser.");
  const showWarning = googleBlocked || facebookBlocked;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Create your Star Sign Studio account ✨</h1>

        {showWarning && (
          <div className="rounded-md border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-center space-y-3">
            <div>
              {inApp ? <>You’re inside <b>{inApp}</b>’s in-app browser.</> : null}
              <br />
              {warningLines.map((l, i) => (<div key={i}>⚠️ {l}</div>))}
              {googleBlocked && (
                <div>👉 To use <b>Google</b> sign up, open <b>www.starsignstudio.com</b> in Safari or Chrome.</div>
              )}
              {facebookBlocked && (
                <div>👉 If <b>Facebook</b> sign up fails, open in Safari/Chrome and try again.</div>
              )}
            </div>

            <div className="flex gap-2 justify-center">
              <button onClick={copyLink} className="py-2 px-3 rounded-md border bg-white text-black hover:bg-gray-100">
                Copy link
              </button>
              <button onClick={openInBrowser} className="py-2 px-3 rounded-md border bg-white text-black hover:bg-gray-100">
                Open in browser
              </button>
            </div>

            <div className="text-xs opacity-80">{openInstructions}</div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {!googleBlocked && <div id="googleSignupBtnMount" />}
          {!facebookBlocked && (
            <button
              onClick={handleFacebook}
              className="w-full py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Continue with Facebook
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
