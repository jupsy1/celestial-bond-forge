import { useEffect, useState } from "react";
import { detectInAppBrowser } from "@/utils/inAppDetector";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const [inApp, setInApp] = useState<string | null>(null);

  useEffect(() => {
    setInApp(detectInAppBrowser());
  }, []);

  const handleLogin = async (provider: "google" | "facebook") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
    if (error) alert(error.message);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Login to StarSignStudio</h1>

      {inApp ? (
        // 🔴 Show warning if inside TikTok / Instagram / Facebook in-app browser
        <div className="rounded-md border border-yellow-500/40 bg-yellow-500/10 px-3 py-2 text-sm text-yellow-100 mb-4 text-center">
          You’re using <b>{inApp}</b>’s in-app browser.  
          Login with Google or Facebook will not work here.  
          <br />
          👉 Please open this page in <b>Safari</b> or <b>Chrome</b> instead.
        </div>
      ) : (
        // 🟢 Show real login buttons in normal browsers
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button
            onClick={() => handleLogin("google")}
            className="w-full py-2 px-4 rounded-md bg-red-500 text-white font-semibold hover:bg-red-600"
          >
            Continue with Google
          </button>
          <button
            onClick={() => handleLogin("facebook")}
            className="w-full py-2 px-4 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Continue with Facebook
          </button>
        </div>
      )}
    </div>
  );
}
