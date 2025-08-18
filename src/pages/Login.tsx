import { useState, useEffect } from "react";
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

// Detect in-app browsers
function detectInAppBrowser(ua: string = navigator.userAgent || "") {
  if (/TikTok/i.test(ua)) return "tiktok";
  if (/Pinterest/i.test(ua)) return "pinterest";
  if (/YouTube|GSA/i.test(ua)) return "youtube";
  if (/FBAN|FBAV|FB_IAB|Instagram|IG/i.test(ua)) return "facebook";
  return null;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [inApp, setInApp] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Detect in-app browser on load
  useEffect(() => {
    const detected = detectInAppBrowser();
    setInApp(detected);
  }, []);

  // Load Google Identity Services script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      cleanupAuthState();
      try {
        await supabase.auth.signOut({ scope: "global" });
      } catch {}

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Welcome back!",
          description: "You've been signed in successfully.",
        });
        window.location.href = "/dashboard";
      }
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (inApp) {
      return; // block handled below
    }

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response: any) => {
        const { credential } = response;
        if (!credential) return;

        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: credential,
        });

        if (error) {
          console.error("Supabase login error:", error.message);
          toast({
            title: "Google sign in failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          window.location.href = "/dashboard";
        }
      },
    });

    window.google.accounts.id.prompt();
  };

  // 🚨 Show full page blocker for TikTok (and optionally Pinterest/YouTube)
  if (inApp) {
    let message = "";
    if (inApp === "tiktok") {
      message = "Google sign-in isn’t supported inside TikTok’s browser. Please tap the ⋮ menu (top-right) and choose 'Open in Safari' or 'Chrome' to continue.";
    } else if (inApp === "pinterest") {
      message = "Google sign-in isn’t supported inside Pinterest’s browser. Please open this page in Safari or Chrome.";
    } else if (inApp === "youtube") {
      message = "Google sign-in isn’t supported inside YouTube’s in-app browser. Please open this page in Safari or Chrome.";
    } else if (inApp === "facebook") {
      message = "Google sign-in isn’t supported inside Facebook/Instagram’s browser. Please open this page in Safari or Chrome.";
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-black text-white text-center">
        <div className="max-w-md space-y-4">
          <Sparkles className="h-12 w-12 mx-auto text-yellow-400" />
          <h1 className="text-2xl font-bold">Heads up!</h1>
          <p>{message}</p>
        </div>
      </div>
    );
  }

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
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
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
              <Button
                variant="outline"
                className="cosmic-card border-primary/30"
                onClick={handleGoogleLogin}
              >
                Google
              </Button>

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
