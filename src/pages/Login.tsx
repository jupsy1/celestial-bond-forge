import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { detectInAppBrowser } from "@/utils/inAppDetector";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [inApp, setInApp] = useState<string | null>(null);

  useEffect(() => {
    setInApp(detectInAppBrowser());
  }, []);

  const handleLogin = async (provider: "google" | "facebook") => {
    setLoading(true);
    try {
      const { error } = await window.supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const openExternally = () => {
    const url = window.location.href;
    // Force open in default browser
    window.open(url, "_blank");
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Sign in to StarSignStudio ✨
      </h1>

      {inApp ? (
        <div className="rounded-md border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-100 space-y-3">
          <p>
            🚫 You’re opening this page inside <b>{inApp}</b>’s in-app browser.
          </p>
          <p>
            👉 Google & Facebook sign-in won’t work here.  
            Please tap the <b>⋮</b> or <b>•••</b> menu and select{" "}
            <b>“Open in Safari/Chrome”</b>.
          </p>
          <button
            onClick={openExternally}
            className="w-full rounded-md bg-yellow-500 text-black px-4 py-2 hover:bg-yellow-400 transition"
          >
            Open in Safari / Chrome
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleLogin("google")}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-md bg-white text-black px-4 py-2 hover:bg-gray-200 transition"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Continue with Google
          </button>

          <button
            onClick={() => handleLogin("facebook")}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Continue with Facebook
          </button>
        </div>
      )}
    </div>
  );
}
