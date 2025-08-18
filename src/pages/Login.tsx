import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, cleanupAuthState } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    google: any;
  }
}

/** Robust in-app detection (covers when one app "wraps" another) */
function detectInAppBrowser(
  ua: string = navigator.userAgent || "",
  ref: string = document.referrer || ""
):
  | "tiktok"
  | "youtube"
  | "pinterest"
  | "instagram"
  | "facebook"
  | null {
  const U = ua.toLowerCase();
  const R = ref.toLowerCase();

  if (U.includes("tiktok") || U.includes("musically") || U.includes("ttwebview") || R.includes("tiktok")) return "tiktok";
  if (U.includes("instagram") || U.includes(" ig ") || U.includes("ig/") || R.includes("instagram")) return "instagram";
  if (U.includes("fban") || U.includes("fbav") || U.includes("fb_iab") || R.includes("facebook")) return "facebook";
  if (U.includes("pinterest") || R.includes("pinterest")) return "pinterest";
  if (U.includes("youtube") || U.includes("gsa") || R.includes("youtube")) return "youtube";

  // Generic Android webview hint (common with in-app browsers)
  if (U.includes("; wv;")) return "tiktok"; // most frequent source

  return null;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inApp, setInApp] = useState<ReturnType<typeof detectInAppBrowser>>(null);
  const [showWebviewHelp, setShowWebviewHelp] = useState(false);

  const fallbackTimerRef = useRef<number | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  // Detect in-app browser
  useEffect(() => {
    setInApp(detectInAppBrowser());
  }, []);

  // Load Google Identity Services & render official button
  useEffect(() => {
    // Don’t bother loading GIS inside blocked webviews
    if (inApp) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (!window.google) return;

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async (response: any) => {
          // Cancel fallback if a response arrives
          if (fallbackTimerRef.current) {
            clearTimeout(fallbackTimerRef.current);
            fallbackTimerRef.current = null;
          }

          try {
            const token = response?.credential;
            if (!token) return;

            const { error } = await supabase.auth.signInWithIdToken({
              provider: "google",
              token,
            });
            if (error) throw error;

            window.location.href = "/dashboard";
          } catch (err: any) {
            console.error("GIS sign-in error:", err);
            toast({
              title: "Google sign in failed",
              description: err?.message || "Please try again.",
              variant: "destructive",
            });
          }
        },
      });

      const container = document.getElementById("google-signin-container");
      if (container) {
        window.google.accounts.id.renderButton(container, {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "signin_with",
          logo_alignment: "left",
        });
      }
    };

    document.body.appendChild(script);
  }, [inApp, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      cleanupAuthState();
      try {
        await supabase.auth.signOut({ scope: "global" });
      } catch {}

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data.user) {
        toast({ title: "Welcome back!", description: "You've been signed in successfully." });
        window.location.href = "/dashboard";
      }
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error?.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /** On Google click:
   *  - If in-app → show help panel immediately (don’t even try GIS)
   *  - Else → start 3s fallback; if no callback, show help panel
   */
  const onGoogleClick = () => {
    if (inApp) {
      setShowWebviewHelp(true);
      return;
    }

    // Start fallback timer in case popup is blocked
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    fallbackTimerRef.current = window.setTimeout(() => {
      setShowWebviewHelp(true);
    }, 3000);

    // Trigger GIS prompt (works in real Safari/Chrome)
    window.google?.accounts.id.prompt();
  };

  // Optional: explicit messages if you want per-app copy in the panel header
  const appName =
    inApp === "tiktok"
      ? "TikTok"
      : inApp === "instagram"
      ? "Instagram"
      : inApp === "facebook"
      ? "Facebook"
      : inApp === "pinterest"
      ? "Pinterest"
      : inApp === "youtube"
      ? "YouTube"
      : "this app";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 starfield-bg">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-8">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-2xl font-display font-bold text-primary-foreground">
              Star Sign Studio
            </span>
          </Link>
        </div>

        {/* If we detect in-app, show a clear banner */}
        {inApp && (
          <div className="rounded-md border border-yellow-500/40 bg-yellow-500/10 px-3 py-2 text-sm text-yellow-100">
            You’re viewing this inside <b>{appName}</b>’s in-app browser. Google login is blocked here.
            Please open this page in <b>Safari</b> (iPhone) or <b>Chrome</b> (Android) to continue.
          </div>
        )}

        {/* Login Card */}
        <Card className="cosmic-card p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-display font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to continue your cosmic journey</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="cosmic-card border-primary/20 focus:border-primary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="cosmic-card border-primary/20 focus:border-primary/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded border-border" />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:text-primary-glow">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="cosmic-button w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Google (triggers GIS + fallback if blocked) */}
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className={`cosmic-card border-primary/30 w-full ${inApp ? "opacity-50 pointer-events-none" : ""}`}
                  onClick={onGoogleClick}
                  aria-disabled={!!inApp}
                >
                  Google
                </Button>
                {/* Hidden container where GIS renders the official button */}
                <div id="google-signin-container" className="hidden" />
              </div>

              {/* Facebook stays via Supabase OAuth */}
              <Button
                variant="outline"
                className="cosmic-card border-primary/30"
                onClick={async () => {
                  try {
                    const { error } = await supabase.auth.signInWithOAuth({
                      provider: "facebook",
                      options: { redirectTo: `${window.location.origin}/dashboard` },
                    });
                    if (error) throw error;
                  } catch (error: any) {
                    toast({
                      title: "Facebook sign in failed",
                      description: "Please try again or use email/password.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                Facebook
              </Button>
            </div>

            {/* Help panel appears if GIS is blocked or we detected in-app */}
            {(showWebviewHelp || inApp) && (
              <div className="rounded-md border border-yellow-500/40 bg-yellow-500/10 p-3 text-sm text-yellow-100 space-y-2">
                <p className="font-medium">
                  Google sign-in didn’t open {inApp ? `(blocked by ${appName})` : ""}.
                </p>
                <p>
                  Please open this page in a real browser:
                  <br />
                  <b>Safari (iPhone) or Chrome (Android)</b>
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      toast({ title: "Link copied", description: "Paste it into Safari/Chrome" });
                    }}
                  >
                    Copy link
                  </Button>
                  {/* Android Chrome deep-link (tries to break out of webview) */}
                  <a
                    href={`intent://${window.location.host}${window.location.pathname}${window.location.search}#Intent;package=com.android.chrome;scheme=https;end;`}
                    className="inline-flex items-center rounded-md border px-3 py-2"
                  >
                    Open in Chrome
                  </a>
                  {!inApp && (
                    <Button variant="outline" onClick={() => setShowWebviewHelp(false)}>
                      Dismiss
                    </Button>
                  )}
                </div>
                <div className="text-xs opacity-80">
                  iPhone: tap the Share icon → <b>Open in Safari</b>
                  <br />
                  Android: tap the ⋮ menu → <b>Open in Chrome</b>
                </div>
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-primary hover:text-primary-glow font-medium">
                Sign up free
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
