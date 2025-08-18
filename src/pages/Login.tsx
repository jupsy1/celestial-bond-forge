import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { isInApp, inAppPrettyName, inAppHelpMessage } from "@/utils/inAppDetector"

export default function Login() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleOAuthLogin = async (provider: "google" | "facebook") => {
    setLoading(provider)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    })
    if (error) {
      console.error(error.message)
      setLoading(null)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-purple-900 via-indigo-900 to-black px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-black/40 p-8 shadow-lg backdrop-blur">
        
        {/* 🚨 In-app browser warning */}
        {isInApp() && (
          <div className="rounded-md border border-yellow-500/40 bg-yellow-500/10 px-3 py-2 text-sm text-yellow-100 mb-4">
            You’re viewing this inside <b>{inAppPrettyName(isInApp())}</b>’s in-app browser.{" "}
            {inAppHelpMessage(isInApp())}
          </div>
        )}

        <h1 className="text-center text-3xl font-bold text-white">Sign in</h1>
        <p className="text-center text-gray-400">Choose a login method below</p>

        <div className="space-y-3">
          {/* Google */}
          <Button
            onClick={() => handleOAuthLogin("google")}
            className="w-full bg-red-600 hover:bg-red-700"
            disabled={loading === "google"}
          >
            {loading === "google" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Continue with Google"
            )}
          </Button>

          {/* Facebook */}
          <Button
            onClick={() => handleOAuthLogin("facebook")}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading === "facebook"}
          >
            {loading === "facebook" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Continue with Facebook"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
