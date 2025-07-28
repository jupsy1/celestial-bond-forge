import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      
      if (error) throw error;
      
      setEmailSent(true);
      toast({
        title: "Reset link sent!",
        description: "Check your email for the password reset link.",
      });
    } catch (error: any) {
      toast({
        title: "Reset failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 starfield-bg">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center space-x-2 mb-8">
              <Sparkles className="h-8 w-8 text-primary" />
              <span className="text-2xl font-display font-bold text-primary-foreground">Star Sign Studio</span>
            </Link>
          </div>

          <Card className="cosmic-card p-8 space-y-6 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-display font-bold text-foreground">Check Your Email</h1>
              <p className="text-muted-foreground">
                We've sent a password reset link to <span className="font-medium">{email}</span>
              </p>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Click the link in your email to reset your password. 
                If you don't see it, check your spam folder.
              </p>
              
              <Link to="/login" className="inline-flex items-center space-x-2 text-primary hover:text-primary-glow">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 starfield-bg">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-8">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-2xl font-display font-bold text-primary-foreground">Star Sign Studio</span>
          </Link>
        </div>

        <Card className="cosmic-card p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-display font-bold text-foreground">Reset Password</h1>
            <p className="text-muted-foreground">Enter your email to receive a reset link</p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
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

            <Button 
              type="submit" 
              className="cosmic-button w-full"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <div className="text-center">
            <Link to="/login" className="inline-flex items-center space-x-2 text-primary hover:text-primary-glow">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;