import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Scale, FileText, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-starfield">
      <Header />
      
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Scale className="h-12 w-12 text-secondary" />
              <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground">
                Terms of Service
              </h1>
            </div>
            <p className="text-xl text-primary-foreground/80 leading-relaxed">
              The cosmic guidelines for your journey with Star Sign Studio.
            </p>
          </div>

          {/* Quick Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 text-secondary mx-auto mb-3" />
                <h3 className="font-display font-bold text-primary-foreground mb-2">Clear Terms</h3>
                <p className="text-sm text-primary-foreground/80">Straightforward guidelines for service use</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-secondary mx-auto mb-3" />
                <h3 className="font-display font-bold text-primary-foreground mb-2">Fair Billing</h3>
                <p className="text-sm text-primary-foreground/80">Transparent pricing and cancellation</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <AlertCircle className="h-8 w-8 text-secondary mx-auto mb-3" />
                <h3 className="font-display font-bold text-primary-foreground mb-2">Your Rights</h3>
                <p className="text-sm text-primary-foreground/80">Protected experience with clear recourse</p>
              </CardContent>
            </Card>
          </div>

          {/* Terms Content */}
          <div className="prose prose-invert max-w-none">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-display font-bold text-primary-foreground mb-4">Service Agreement</h2>
                <div className="text-primary-foreground/80 space-y-3">
                  <p>By using Star Sign Studio, you agree to these terms of service. Our platform provides astrological insights and compatibility guidance for entertainment and self-reflection purposes.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-primary-foreground mb-4">Account Responsibilities</h2>
                <div className="text-primary-foreground/80 space-y-3">
                  <p>When creating your cosmic profile:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide accurate birth information for precise readings</li>
                    <li>Keep your login credentials secure and confidential</li>
                    <li>Use the service respectfully and in accordance with its intended purpose</li>
                    <li>Notify us immediately of any unauthorized account access</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-primary-foreground mb-4">Service Availability</h2>
                <div className="text-primary-foreground/80 space-y-3">
                  <p>Star Sign Studio strives to provide consistent service:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Services are available 24/7 with minimal planned maintenance</li>
                    <li>Daily horoscopes are updated each morning</li>
                    <li>Premium readings are delivered within 24 hours</li>
                    <li>We reserve the right to update features and improve services</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-primary-foreground mb-4">Payment and Subscriptions</h2>
                <div className="text-primary-foreground/80 space-y-3">
                  <p>Our billing practices are transparent and fair:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Free services remain free with optional premium upgrades</li>
                    <li>Subscription charges are clearly disclosed before purchase</li>
                    <li>Cancel anytime through your account settings</li>
                    <li>Refunds considered on a case-by-case basis within 30 days</li>
                    <li>No hidden fees or surprise charges</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-primary-foreground mb-4">Content and Accuracy</h2>
                <div className="text-primary-foreground/80 space-y-3">
                  <p>Our astrological guidance is provided with care:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Readings are for entertainment and self-reflection purposes</li>
                    <li>We strive for accuracy but cannot guarantee specific outcomes</li>
                    <li>Content should not replace professional advice for serious decisions</li>
                    <li>All intellectual property remains with Star Sign Studio</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-primary-foreground mb-4">Prohibited Uses</h2>
                <div className="text-primary-foreground/80 space-y-3">
                  <p>To maintain a positive cosmic community:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Do not share account credentials or circumvent payment systems</li>
                    <li>Avoid using the service for any illegal or harmful purposes</li>
                    <li>Respect other users and our team members</li>
                    <li>Do not attempt to reverse engineer or copy our algorithms</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-primary-foreground mb-4">Contact and Disputes</h2>
                <div className="text-primary-foreground/80">
                  <p>We're committed to resolving any concerns:</p>
                  <p className="mt-2">Email: support@starsignstudio.com</p>
                  <p className="mt-2">Most issues are resolved within 2 business days.</p>
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