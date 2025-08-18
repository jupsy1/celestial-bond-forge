import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { detectInApp, redirectIfInApp } from "@/utils/inAppDetector";

export default function Login() {
  const [inApp, setInApp] = useState<string | null>(null);

  useEffect(() => {
    const detected = detectInApp();
    setInApp(detected);

    if (detected) {
      // try deep-link redirect immediately
      redirectIfInApp();
    }
  }, []);

  const handleLogin = async (provider: "google" | "facebook") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
    if (error) console.error("Auth error:", error.message);
  };

  if (inApp) {
    // fallback message if still stuck in TikTok/Instagram
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4">
        <div className="w-full max-w-sm rounded-xl bg-red-900/30 border border-red-400 p-6 text-center text-white">
          <h2 className="text-lg font-semibold mb-3">
            Open in Safari or Chrome
          </h2>
          <p className="text-sm mb-4">
            It looks like you’re using {inApp}’s in-app browser.  
            Google login is blocked here.  
            Please tap the **three dots** (⋮) and choose  
            <b> “Open in Safari”</b> (iPhone) or <b>“Open in Chrome”</b> (Android).
          </p>
        </div>
      </div>
    );
  }

  // Normal login UI
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-purple-900 via-black to-purple-950 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-black/60 p-8 shadow-xl border border-white/10">
        <h1 className="text-center text-2xl font-bold text-white mb-6">
          Sign in to <span className="text-purple-400">StarSign Studio</span>
        </h1>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => handleLogin("google")}
            className="w-full bg-white text-black hover:bg-gray-200"
          >
            Continue with Google
          </Button>

          <Button
            onClick={() => handleLogin("facebook")}
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
          >
            Continue with Facebook
          </Button>
        </div>
      </div>
    </div>
  );
}
