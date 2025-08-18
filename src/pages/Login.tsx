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

// Detect if user is inside Pinterest, YouTube, TikTok
function detectInAppBrowser(ua: string = navigator.userAgent || "") {
  if (/Pinterest/i.test(ua)) return "pinterest";
  if (/YouTube|GSA/i.test(ua)) return "youtube";
  if (/TikTok/i.test(ua)) return "tiktok";
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

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Load Google Identity Services
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (!window.google) return;

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
            console.log("Logged in:", data);
            window.location.href = "/dashboard";
          }
        },
      });

      // Render Google button into container
      const btn = document.getElementById("google-login-btn");
      if (btn) {
        window.google.accounts.id.renderButton(btn, {
          theme: "outline",
          size: "large",
          width: "100%",
        });
      }
    };
    document.body.appendChild(script);
  }, [toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      cleanupAuthState();
      try {
        await supabase.auth.signOut({ scope: "global" });
      } catch (err) {}

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
        description:
          error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleGuard = () => {
    const inApp = detectInAppBrowser();
    if (inApp === "pinterest") {
      alert("Google sign-in isn’t supported inside Pinterest’s browser. Please open in Safari or Chrome.");
      return;
    }
    if (inApp === "youtube") {
      alert("Google sign-in isn’t supported inside YouTube’s browser. Please open in Safari or Chrome.");
      return;
    }
    if (inApp === "tiktok") {
      alert("Google sign-in isn’t supported inside TikTok’s browser. Please open in Safari or Chrome.");
      return;
    }
    // If safe browser, click the official button programmatically
    document.querySelector<HTMLDivElement>("#google-login-btn button")?.click();
  };

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
