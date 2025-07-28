import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card } from "@/components/ui/card";
import { Shield, Trash2, Clock, Mail } from "lucide-react";

export default function DataDeletion() {
  return (
    <div className="min-h-screen bg-gradient-starfield">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
              Data Deletion Request
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              We respect your right to control your personal data. Request deletion of your account and associated data here.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="cosmic-card border-primary/30 p-6 text-center">
              <Shield className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-display font-semibold text-primary-foreground mb-2">
                Your Rights
              </h3>
              <p className="text-primary-foreground/80 text-sm">
                Complete control over your personal data and privacy
              </p>
            </Card>

            <Card className="cosmic-card border-primary/30 p-6 text-center">
              <Clock className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-display font-semibold text-primary-foreground mb-2">
                30-Day Process
              </h3>
              <p className="text-primary-foreground/80 text-sm">
                Complete deletion within 30 days of verified request
              </p>
            </Card>

            <Card className="cosmic-card border-primary/30 p-6 text-center">
              <Trash2 className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-display font-semibold text-primary-foreground mb-2">
                Permanent Removal
              </h3>
              <p className="text-primary-foreground/80 text-sm">
                All personal data permanently deleted from our systems
              </p>
            </Card>
          </div>

          <Card className="cosmic-card border-primary/30 p-8">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-display font-bold text-primary-foreground mb-6">
                Data Deletion Information
              </h2>

              <div className="space-y-6 text-primary-foreground/80">
                <section>
                  <h3 className="text-xl font-display font-semibold text-primary-foreground mb-3">
                    What Data Will Be Deleted
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Personal profile information (name, email, birth details)</li>
                    <li>Account preferences and settings</li>
                    <li>Reading history and compatibility reports</li>
                    <li>Payment information and transaction history</li>
                    <li>Communication records and support tickets</li>
                    <li>Any uploaded content or custom birth chart data</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-display font-semibold text-primary-foreground mb-3">
                    How to Request Deletion
                  </h3>
                  <p className="mb-4">
                    To request deletion of your account and all associated data, please send an email to our data protection team with the following information:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Subject line: "Data Deletion Request"</li>
                    <li>Your full name associated with the account</li>
                    <li>Email address used for the account</li>
                    <li>Date of birth (for verification purposes)</li>
                    <li>Reason for deletion (optional)</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-display font-semibold text-primary-foreground mb-3">
                    Verification Process
                  </h3>
                  <p className="mb-4">
                    To protect your privacy and prevent unauthorized deletion requests, we will:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Verify your identity using the information provided</li>
                    <li>Send a confirmation email to your registered address</li>
                    <li>Require confirmation within 7 days to proceed</li>
                    <li>Process the deletion within 30 days of verification</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-display font-semibold text-primary-foreground mb-3">
                    Important Considerations
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Irreversible:</strong> Data deletion is permanent and cannot be undone</li>
                    <li><strong>Access Loss:</strong> You will lose access to all premium features and content</li>
                    <li><strong>Legal Retention:</strong> Some data may be retained for legal compliance (anonymized)</li>
                    <li><strong>Third Parties:</strong> Data shared with payment processors follows their deletion policies</li>
                  </ul>
                </section>

                <section className="bg-primary/10 p-6 rounded-lg border border-primary/20">
                  <h3 className="text-xl font-display font-semibold text-primary-foreground mb-3 flex items-center">
                    <Mail className="h-6 w-6 text-secondary mr-2" />
                    Contact for Data Deletion
                  </h3>
                  <p className="mb-2">
                    <strong>Email:</strong> privacy@starsignstudio.com
                  </p>
                  <p className="mb-2">
                    <strong>Subject:</strong> Data Deletion Request
                  </p>
                  <p className="text-sm">
                    We typically respond to deletion requests within 3-5 business days.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-display font-semibold text-primary-foreground mb-3">
                    Alternative Options
                  </h3>
                  <p className="mb-4">
                    Before requesting complete deletion, consider these alternatives:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Account Deactivation:</strong> Temporarily disable your account</li>
                    <li><strong>Data Export:</strong> Download your data before deletion</li>
                    <li><strong>Privacy Settings:</strong> Adjust what data we collect and use</li>
                    <li><strong>Selective Deletion:</strong> Remove specific data categories only</li>
                  </ul>
                </section>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}