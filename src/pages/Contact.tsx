import { useState } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Mail, MessageCircle, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate form submission - replace with actual email service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. We'll get back to you within 24 hours.",
      });
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "Failed to send",
        description: "Please try again or contact us directly at hello@starsignstudio.com",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-starfield">
      <Header />
      
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <MessageCircle className="h-12 w-12 text-secondary" />
              <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground">
                Contact Us
              </h1>
            </div>
            <p className="text-xl text-primary-foreground/80 leading-relaxed">
              Ready to connect with the cosmos? We're here to guide your journey.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-display font-bold text-primary-foreground mb-6">
                    Send Us a Message
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-primary-foreground mb-2">
                          First Name
                        </label>
                        <Input 
                          value={formData.firstName}
                          onChange={(e) => updateFormData("firstName", e.target.value)}
                          className="bg-white/10 border-white/20 text-primary-foreground"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary-foreground mb-2">
                          Last Name
                        </label>
                        <Input 
                          value={formData.lastName}
                          onChange={(e) => updateFormData("lastName", e.target.value)}
                          className="bg-white/10 border-white/20 text-primary-foreground"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary-foreground mb-2">
                        Email Address
                      </label>
                      <Input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                        className="bg-white/10 border-white/20 text-primary-foreground"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary-foreground mb-2">
                        Subject
                      </label>
                      <Input 
                        value={formData.subject}
                        onChange={(e) => updateFormData("subject", e.target.value)}
                        className="bg-white/10 border-white/20 text-primary-foreground"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary-foreground mb-2">
                        Message
                      </label>
                      <Textarea 
                        rows={6} 
                        value={formData.message}
                        onChange={(e) => updateFormData("message", e.target.value)}
                        className="bg-white/10 border-white/20 text-primary-foreground"
                        placeholder="Tell us about your cosmic questions..."
                        required
                      />
                    </div>
                    <Button 
                      type="submit"
                      className="w-full cosmic-button"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Send Your Message to the Stars"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <Mail className="h-8 w-8 text-secondary" />
                    <h3 className="text-xl font-display font-bold text-primary-foreground">
                      Email Support
                    </h3>
                  </div>
                  <p className="text-primary-foreground/80 mb-3">
                    For general inquiries and cosmic guidance questions
                  </p>
                  <p className="text-secondary font-medium">hello@starsignstudio.com</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <Clock className="h-8 w-8 text-secondary" />
                    <h3 className="text-xl font-display font-bold text-primary-foreground">
                      Response Times
                    </h3>
                  </div>
                  <div className="space-y-2 text-primary-foreground/80">
                    <p>General Inquiries: Within 24 hours</p>
                    <p>Technical Support: Within 12 hours</p>
                    <p>Premium Support: Within 6 hours</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <MapPin className="h-8 w-8 text-secondary" />
                    <h3 className="text-xl font-display font-bold text-primary-foreground">
                      Our Cosmic Location
                    </h3>
                  </div>
                  <p className="text-primary-foreground/80">
                    While our team works from around the globe, our hearts are always 
                    aligned with the stars above. We're available 24/7 to help guide 
                    your cosmic journey, no matter where you are in the universe.
                  </p>
                </CardContent>
              </Card>

              {/* FAQ Quick Links */}
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h3 className="text-xl font-display font-bold text-primary-foreground mb-4">
                    Quick Help
                  </h3>
                  <div className="space-y-3">
                    <p className="text-primary-foreground/80">
                      <strong>Account Issues:</strong> Check your email for confirmation links
                    </p>
                    <p className="text-primary-foreground/80">
                      <strong>Birth Time Unknown:</strong> We can still provide accurate readings
                    </p>
                    <p className="text-primary-foreground/80">
                      <strong>Compatibility Questions:</strong> Try our free compatibility checker
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}