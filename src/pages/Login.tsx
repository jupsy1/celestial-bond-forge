import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { redirectIfInApp } from "@/utils/inAppDetector";

export default function Login() {
  useEffect(() => {
    redirectIfInApp(); // auto-redirect if inside TikTok/Instagram/FB
  }, []);

  const handleLogin = async (provider: "google" | "facebook") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
    if (error) console.error("Auth error:", error.message);
  };

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
