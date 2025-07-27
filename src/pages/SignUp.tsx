import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ZodiacSelector } from "@/components/ui/zodiac-selector";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, cleanupAuthState } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    zodiacSign: "",
    birthDate: "",
    marketingOptIn: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.zodiacSign) {
      toast({
        title: "Zodiac sign required",
        description: "Please select your zodiac sign to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Clean up existing state
      cleanupAuthState();
      
      const redirectUrl = `${window.location.origin}/`;
      
      // Sign up with email/password
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: formData.email,
            zodiac_sign: formData.zodiacSign,
            birth_date: formData.birthDate || null,
            marketing_opt_in: formData.marketingOptIn
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast({
          title: "Account created!",
          description: "Welcome to Star Sign Studio! Check your email to confirm your account.",
        });
        // Force page reload for clean state
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 starfield-bg">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-8">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-2xl font-display font-bold text-primary-foreground">Star Sign Studio</span>
          </Link>
        </div>

        {/* Sign Up Card */}
        <Card className="cosmic-card p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-display font-bold text-foreground">Join the Stars</h1>
            <p className="text-muted-foreground">Create your account and start your cosmic love journey</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
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
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                    required
                    className="cosmic-card border-primary/20 focus:border-primary/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Your Zodiac Sign</Label>
                <ZodiacSelector
                  selectedSign={formData.zodiacSign}
                  onSignSelect={(sign) => updateFormData("zodiacSign", sign)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Birth Date (Optional)</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => updateFormData("birthDate", e.target.value)}
                  className="cosmic-card border-primary/20 focus:border-primary/50"
                />
                <p className="text-xs text-muted-foreground">
                  For more accurate readings and personalized guidance
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-start space-x-3">
                <input 
                  type="checkbox" 
                  checked={formData.marketingOptIn}
                  onChange={(e) => updateFormData("marketingOptIn", e.target.checked)}
                  className="rounded border-border mt-1" 
                />
                <span className="text-sm text-muted-foreground leading-relaxed">
                  I'd like to receive daily horoscopes, cosmic insights, and special offers via email.
                </span>
              </label>

              <p className="text-xs text-muted-foreground">
                By creating an account, you agree to our{" "}
                <Link to="/terms" className="text-primary hover:text-primary-glow">Terms of Service</Link>
                {" "}and{" "}
                <Link to="/privacy" className="text-primary hover:text-primary-glow">Privacy Policy</Link>
              </p>
            </div>

            <Button 
              type="submit" 
              className="cosmic-button w-full"
              disabled={isLoading || !formData.zodiacSign}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">Or sign up with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="cosmic-card border-primary/30">
                Google
              </Button>
              <Button variant="outline" className="cosmic-card border-primary/30">
                Facebook
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:text-primary-glow font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;