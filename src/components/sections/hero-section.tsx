import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ZodiacSelector } from "@/components/ui/zodiac-selector";
import { Sparkles } from "lucide-react";
import cosmicHero from "@/assets/cosmic-hero.jpg";

export function HeroSection() {
  const [selectedSign, setSelectedSign] = useState<string>("");

  const handleGetReading = () => {
    if (selectedSign) {
      // Navigate to reading or show modal
      console.log("Getting reading for:", selectedSign);
    } else {
      // Show sign selection prompt
      alert("Please select your zodiac sign first!");
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img 
          src={cosmicHero} 
          alt="Cosmic background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background/80" />
      </div>

      {/* Floating celestial elements */}
      <div className="absolute inset-0 starfield-bg opacity-40" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main headline */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground leading-tight">
              Discover Your{" "}
              <span className="bg-gradient-cosmic bg-clip-text text-transparent">
                Cosmic Love Story
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground/90 max-w-2xl mx-auto leading-relaxed font-medium">
              Daily horoscopes, compatibility readings, and celestial guidance to illuminate your romantic journey
            </p>
          </div>

          {/* Zodiac selector */}
          <div className="max-w-md mx-auto space-y-4 mb-60">
            <ZodiacSelector
              selectedSign={selectedSign}
              onSignSelect={setSelectedSign}
            />
            <Button 
              onClick={handleGetReading}
              size="lg"
              className="cosmic-button w-full text-lg h-14"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Get My Free Love Reading
            </Button>
          </div>

          {/* Social proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-foreground/80">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-cosmic border-2 border-background"
                  />
                ))}
              </div>
              <span className="text-sm font-medium">10,000+ readings delivered</span>
            </div>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Sparkles key={i} className="h-4 w-4 text-secondary fill-current" />
              ))}
              <span className="text-sm ml-2 font-medium">4.9/5 rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative celestial orb */}
      <div className="absolute bottom-10 right-10 w-32 h-32 celestial-glow rounded-full opacity-30 floating-animation" />
    </section>
  );
}