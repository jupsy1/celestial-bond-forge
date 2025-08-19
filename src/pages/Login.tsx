import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Broad in-app / webview detection */
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
  if (ua.includes("gsa")) return "GoogleApp";            // Google Search App
  if (ua.includes("; wv;")) return "AndroidWebView";     // Android WebView

  const isiOS = /iphone|ipad|ipod/.test(ua);
  const isSafari = ua.includes("safari");
  if (isiOS && !isSafari) return "iOSWebView";           // iOS WebView heuristic

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

/** Provider policy per environment */
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

export default function Login() {
  const [inApp, setInApp] = useState<ReturnType<typeof detectInApp>>(null);
  const [gisReady, setGisReady] = useState(false);
  const [gisTimeoutFired, setGisTimeoutFired] = useState(false); // safety-net if GIS fails to load

  // Email/password UI state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Prefer Netlify env; fall back to index.html APP_CONFIG
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

  // Poll for GIS; if it doesn't appear in ~3s, assume blocked (webview/CSP)
  useEffect(() => {
    if (blockedByUA) return;
    let tries = 0;
    const maxTries = 40; // ~4s
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

  // Initialize GIS & render official Google button (ID-token; no Supabase branding)
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
      window.google.accounts.id.prompt(); // optional One Tap
    }
  }, [googleBlocked, gisReady, GOOGLE_CLIENT_ID]);

  // Facebook via redirect (keep)
  const handleFacebook = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: { redirectTo: window.location.origin + "/dashboard" },
    });
    if (error) alert(error.message);
  };

  // Email/password handlers
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      alert(error.message);
      return;
    }
    window.location.href = "/dashboard";
  };

  const handleResetPassword = async () => {
    if (!email) {
      alert("Enter your email first.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    if (error) alert(error.message);
    else alert("If an account exists for that email, a reset link has been sent.");
  };

  // “Open in browser / Copy link / Share” helpers for warning box
  const [copied, setCopied] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const externalHref = "https://www.starsignstudio.com/login";
  const canShare = typeof navigator !== "undefined" && !!navigator.share;

  const copyLink = async () => {
    const url = window.location.href;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      alert("Copy failed. Long-press the address bar to copy the link.");
    }
  };
  const shareLink = async () => {
    setShareError(null);
    try {
      await navigator.share({
        title: "Star Sign Studio",
        text: "Open this in your browser to sign in:",
        url: window.location.href,
      });
    } catch (e: any) {
      if (e && e.name !== "AbortError") setShareError("Share unavailable here. Try Copy link instead.");
    }
  };

  const openInstructions = isIOS()
    ? "Tap the ••• (or aA) menu and choose “Open in Safari”."
    : isAndroid()
    ? "Tap the ⋮ menu and choose “Open in Chrome”."
    : "Open this page in your default browser.";

  const warningLines: string[] = [];
  const { googleBlocked: _gB, facebookBlocked: _fB } = providerPolicy(inApp);
  if (_gB || gisTimeoutFired) warningLines.push("Google login doesn’t work inside this app’s browser.");
  if (_fB) warningLines.push("Facebook login doesn’t work reliably inside this app’s browser.");
  const showWarning = (_gB || gisTimeoutFired) || _fB;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Sign in to Star Sign Studio ✨</h1>

        {showWarning && (
          <div className="rounded-md border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-center space-y-3">
            <div>
              {inApp ? <>You’re inside <b>{inApp}</b>’s in-app browser.</> : null}
              <br />
              {warningLines.map((l, i) => (<div key={i}>⚠️ {l}</div>))}
              {(_gB || gisTimeoutFired) && (
                <div>👉 To use <b>Google</b> login, open <b>www.starsignstudio.com</b> in Safari or Chrome.</div>
              )}
              {_fB && (
                <div>👉 If <b>Facebook</b> login fails, open in Safari/Chrome and try again.</div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              <button onClick={copyLink} className="py-2 px-3 rounded-md border bg-white text-black hover:bg-gray-100">
                {copied ? "Link copied ✓" : "Copy link"}
              </button>

              <a
                href={externalHref}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 rounded-md border bg-white text-black hover:bg-gray-100 inline-flex items-center justify-center"
              >
                Open in browser
              </a>

              {canShare && (
                <button
                  onClick={shareLink}
                  className="py-2 px-3 rounded-md border bg-white text-black hover:bg-gray-100"
                >
                  Share…
                </button>
              )}
            </div>

            <div className="text-xs opacity-80">{openInstructions}</div>
            {!copied && shareError && <div className="text-xs text-red-600">{shareError}</div>}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {/* Google button only when not blocked */}
          {!googleBlocked && <div id="googleBtnMount" />}

          {/* Facebook button only when not blocked */}
          {!facebookBlocked && (
            <button
              onClick={handleFacebook}
              className="w-full py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Continue with Facebook
            </button>
          )}

          {/* Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div>

          {/* Toggle email form */}
          <button
            onClick={() => setShowEmailForm((s) => !s)}
            className="w-full py-2 rounded-md border bg-white text-black hover:bg-gray-100"
          >
            {showEmailForm ? "Hide email login" : "Use email instead"}
          </button>

          {showEmailForm && (
            <form onSubmit={handleEmailLogin} className="space-y-3 mt-1">
              <input
                type="email"
                placeholder="Email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border px-3 py-2"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border px-3 py-2"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-md bg-black text-white hover:bg-gray-900 disabled:opacity-60"
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>
              <button
                type="button"
                onClick={handleResetPassword}
                className="w-full py-2 rounded-md border bg-white text-black hover:bg-gray-100"
              >
                Forgot password?
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
