// src/pages/SignUp.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { detectInAppBrowser } from "@/utils/inAppDetector";

export default function SignUp() {
  const [inApp, setInApp] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    setInApp(detectInAppBrowser());
  }, []);

  const handleSignUp = async (provider: "google" | "facebook") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) alert(error.message);
  };

  const handleEmailSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) alert(error.message);
    else alert("Check your email for the confirmation link!");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied! Open in Safari or Chrome to continue.");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Create your account</h1>

      {inApp ? (
        <div className="rounded-md border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-100 mb-6 text-center w-full max-w-sm">
          You’re using <b>{inApp}</b>’s in-app browser.  
          Google and Facebook sign-up may not work here.  
          <br />
          👉 Please open this page in <b>Safari</b> or <b>Chrome</b>.
          
          {/* Open in browser + copy link */}
          <div className="mt-3 flex gap-3 justify-center">
            <a
              href={window.location.href}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm"
            >
              Open in Browser
            </a>
            <button
              onClick={copyLink}
              className="px-3 py-2 bg-gray-700 text-white rounded-md text-sm"
            >
              Copy Link
            </button>
          </div>

          {/* Email sign-up fallback */}
          <div className="mt-4 text-left">
            <p className="mb-2 text-yellow-200">Or sign up with your email:</p>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md mb-2 text-black"
            />
            <button
              onClick={handleEmailSignUp}
              className="w-full py-2 px-4 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700"
            >
              Sign up with Email
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full max-w-xs">
          {/* Google */}
          <button
            onClick={() => handleSignUp("google")}
            className="w-full py-2 px-4 rounded-md bg-red-500 text-white font-semibold hover:bg-red-600"
          >
            Sign up with Google
          </button>

          {/* Facebook */}
          <button
            onClick={() => handleSignUp("facebook")}
            className="w-full py-2 px-4 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Sign up with Facebook
          </button>

          {/* Email */}
          <div className="mt-4">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md mb-2 text-black"
            />
            <button
              onClick={handleEmailSignUp}
              className="w-full py-2 px-4 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700"
            >
              Sign up with Email
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
