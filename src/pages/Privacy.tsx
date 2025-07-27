import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Shield, Eye, Lock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-starfield">
      <Header />
      
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Shield className="h-12 w-12 text-secondary" />
              <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground">
                Privacy Policy
              </h1>
            </div>
            <p className="text-xl text-primary-foreground/80 leading-relaxed">
              Your cosmic journey deserves the highest level of privacy protection.
            </p>
          </div>

          {/* Quick Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Eye className="h-8 w-8 text-secondary mx-auto mb-3" />
                <h3 className="font-display font-bold text-primary-foreground mb-2">Transparency</h3>
                <p className="text-sm text-primary-foreground/80">Clear about what we collect and why</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Lock className="h-8 w-8 text-secondary mx-auto mb-3" />
                <h3 className="font-display font-bold text-primary-foreground mb-2">Security</h3>
                <p className="text-sm text-primary-foreground/80">Your data is encrypted and protected</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-secondary mx-auto mb-3" />
                <h3 className="font-display font-bold text-primary-foreground mb-2">No Sharing</h3>
                <p className="text-sm text-primary-foreground/80">We never sell your personal information</p>
              </CardContent>
            </Card>
          </div>

          {/* Policy Content */}
          <div className="prose prose-invert max-w-none">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-display font-bold text-primary-foreground mb-4">Information We Collect</h2>
                <div className="text-primary-foreground/80 space-y-3">
                  <p>At Star Sign Studio, we collect only the information necessary to provide you with accurate astrological insights:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Birth date, time, and location for accurate chart calculations</li>
                    <li>Email address for account management and service delivery</li>
                    <li>Payment information (processed securely through encrypted channels)</li>
                    <li>Service preferences and interaction history to personalize your experience</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-primary-foreground mb-4">How We Use Your Information</h2>
                <div className="text-primary-foreground/80 space-y-3">
                  <p>Your information helps us deliver personalized cosmic guidance:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Generate accurate birth charts and compatibility reports</li>
                    <li>Provide personalized daily horoscopes and insights</li>
                    <li>Process payments and manage your subscription</li>
                    <li>Send important service updates and cosmic event notifications</li>
                    <li>Improve our services based on usage patterns (anonymized data only)</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-primary-foreground mb-4">Data Protection</h2>
                <div className="text-primary-foreground/80 space-y-3">
                  <p>We employ industry-standard security measures to protect your cosmic data:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>All data is encrypted in transit and at rest</li>
                    <li>Access is limited to authorized personnel only</li>
                    <li>Regular security audits and updates</li>
                    <li>Secure payment processing through trusted providers</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-primary-foreground mb-4">Your Rights</h2>
                <div className="text-primary-foreground/80 space-y-3">
                  <p>You have complete control over your personal information:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access and download your data at any time</li>
                    <li>Request corrections to inaccurate information</li>
                    <li>Delete your account and associated data</li>
                    <li>Opt out of non-essential communications</li>
                    <li>Export your birth chart and reading history</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-primary-foreground mb-4">Contact Us</h2>
                <div className="text-primary-foreground/80">
                  <p>Questions about your privacy? We're here to help:</p>
                  <p className="mt-2">Email: privacy@starsignstudio.com</p>
                  <p className="text-sm mt-4">Last updated: December 2024</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}