import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Sparkles, Heart, Users, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-starfield">
      <Header />
      
      <main className="container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Sparkles className="h-12 w-12 text-secondary" />
            <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground">
              About Star Sign Studio
            </h1>
          </div>
          <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
            We illuminate love stories through the ancient wisdom of the stars, 
            helping souls discover their cosmic connections and romantic destiny.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <Heart className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-display font-bold text-primary-foreground mb-4">
                Our Mission
              </h3>
              <p className="text-primary-foreground/80">
                To guide hearts to their perfect cosmic match through personalized astrological insights and celestial wisdom.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-display font-bold text-primary-foreground mb-4">
                Our Community
              </h3>
              <p className="text-primary-foreground/80">
                A thriving community of star-crossed lovers and cosmic seekers finding their path to authentic romance.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <Award className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-display font-bold text-primary-foreground mb-4">
                Our Expertise
              </h3>
              <p className="text-primary-foreground/80">
                Years of astrological study combined with modern relationship psychology to deliver accurate cosmic guidance.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Story Section */}
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-display font-bold text-primary-foreground mb-8">
            Our Cosmic Story
          </h2>
          <div className="space-y-6 text-lg text-primary-foreground/80 leading-relaxed">
            <p>
              Star Sign Studio was born from a simple belief: that the universe conspires to bring 
              soulmates together, and the stars hold the keys to understanding these divine connections.
            </p>
            <p>
              Founded by passionate astrologers and relationship experts, we've dedicated ourselves 
              to translating the ancient language of the cosmos into modern love guidance that 
              resonates with today's romantic seekers.
            </p>
            <p>
              Every reading, every compatibility report, and every cosmic insight we provide is 
              crafted with love, precision, and a deep understanding of both celestial mechanics 
              and human hearts.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}