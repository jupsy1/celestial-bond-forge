// src/pages/SignUp.tsx
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { detectInAppBrowser } from "@/utils/inAppDetector";

declare global {
  interface Window {
    google?: any;
    APP_CONFIG?: { VITE_GOOGLE_CLIENT_ID?: string };
  }
}

export default function SignUp() {
  const [inApp, setInApp] = useState<string | null>(null);
  const [gisReady, setGisReady] = useState(false);
  const [gisTimeout, setGisTimeout] = useState(false);

  // Email fallback
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  // Prefer Netlify env; fall back to index.html APP_CONFIG
  const GOOGLE_CLIENT_ID = useMemo(
    () =>
      (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) ||
      window.APP_CONFIG?.VITE_GOOGLE_CLIENT_ID,
    []
  );

  useEffect(() => {
    setInApp(detectInAppBrowser());
  }, []);

  // Only try to use GIS in real browsers (not in-app)
  useEffect(() => {
    if (inApp) return; // don’t attempt GIS inside in-app browsers
    let tries = 0;
    const max = 40;
    const poll = setInterval(() => {
      tries++;
      if (window.google) {
        setGisReady(true);
        clearInterval(poll);
      } else if (tries >= max) {
        clearInterval(poll);
      }
    }, 100);

    const t = setTimeout(() => {
      if (!window.google) setGisTimeout(true);
    }, 3000);

    return () => {
      clearInterval(poll);
      clearTimeout(t);
    };
  }, [inApp]);

  // Render the official Google button (GIS ID-token, NO Supabase branding)
  useEffect(() => {
    if (inApp) return;
    if (!gisReady || !window.google || !GOOGLE_CLIENT_ID) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (resp: any) => {
        const token = resp?.credential;
        if (!token) return;
        const { error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token,
        });
        if (error) { alert(error.message); return; }
        window.location.href = "/dashboard";
      },
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
      // optional one-tap: window.google.accounts.id.prompt();
    }
  }, [inApp, gisReady, GOOGLE_CLIENT_ID]);

  // Facebook via Supabase OAuth (keep for real browsers only)
  const handleFacebook = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: { redirectTo: window.location.origin + "/dashboard" },
    });
    if (error) alert(error.message);
  };

  // Email sign-up (works everywhere)
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password: pw,
      options: { emailRedirectTo: window.location.origin + "/dashboard" },
    });
    setLoading(false);
    if (error) { alert(error.message); return; }
    alert("Check your email to confirm your account, then continue.");
  };

  // “Open in browser / Copy link” helpers for in-app warning
  const copyLink = async () => {
    const url = "https://www.starsignstudio.com/signup";
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      alert("Link copied. Open in Safari/Chrome to continue.");
    } catch {
      alert("Copy failed. Long-press the address bar to copy.");
    }
  };

  const WarningCard = () => (
    <div className="rounded-md border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-100 space-y-3 text-center">
      <div>
        You’re inside <b>{inApp}</b>’s in-app browser.<br />
        Google & Facebook sign-up are blocked or unreliable here.
      </div>
      <div className="flex gap-2 justify-center">
        <a
          href="https://www.starsignstudio.com/signup"
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 px-3 rounded-md border bg-white text-black hover:bg-gray-100 inline-flex items-center justify-center"
        >
          Open in browser
        </a>
        <button
          onClick={copyLink}
          className="py-2 px-3 rounded-md border bg-white text-black hover:bg-gray-100"
        >
          Copy link
        </button>
      </div>

      {/* Email fallback so users aren’t stuck */}
      <form onSubmit={handleEmailSignup} className="space-y-2 text-left">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-md border px-3 py-2 text-black"
        />
        <input
          type="password"
          placeholder="Password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          required
          className="w-full rounded-md border px-3 py-2 text-black"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-md bg-black text-white hover:bg-gray-900 disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Sign up with Email"}
        </button>
      </form>
    </div>
  );

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-5">
        <h1 className="text-2xl font-bold text-center">Sign up for Star Sign Studio ✨</h1>

        {/* In-app browsers: show warning + email fallback only */}
        {inApp ? (
          <WarningCard />
        ) : (
          // Real browsers: show Google (GIS), Facebook, and email
          <div className="flex flex-col gap-3">
            {/* Google via GIS (never says “Supabase”) */}
            {!gisTimeout && <div id="googleSignupBtnMount" />}

            {/* If GIS was blocked by CSP/ad-block, show graceful info */}
            {gisTimeout && (
              <button
                onClick={() =>
                  alert("Google sign-up couldn’t load here. Try Safari/Chrome or use email below.")
                }
                className="w-full py-2 rounded-md border bg-white text-black hover:bg-gray-100"
              >
                Sign up with Google
              </button>
            )}

            {/* Facebook (only in real browsers) */}
            <button
              onClick={handleFacebook}
              className="w-full py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Sign up with Facebook
            </button>

            {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">or</span>
              </div>
            </div>

            {/* Email sign-up (always available) */}
            <form onSubmit={handleEmailSignup} className="space-y-2">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border px-3 py-2 text-black"
              />
              <input
                type="password"
                placeholder="Password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                required
                className="w-full rounded-md border px-3 py-2 text-black"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-md bg-black text-white hover:bg-gray-900 disabled:opacity-60"
              >
                {loading ? "Creating account…" : "Sign up with Email"}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
