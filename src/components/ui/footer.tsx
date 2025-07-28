import { Sparkles, Heart, Mail, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-starfield text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-secondary" />
              <span className="text-2xl font-display font-bold">Star Sign Studio</span>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              Illuminating love stories through the wisdom of the stars. 
              Your cosmic journey to romance begins here.
            </p>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-display font-semibold">Services</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="/services#daily-horoscope" className="hover:text-secondary transition-colors">Daily Horoscope</a></li>
              <li><a href="/services#compatibility" className="hover:text-secondary transition-colors">Compatibility Reading</a></li>
              <li><a href="/services#soul-mate" className="hover:text-secondary transition-colors">Soul Mate Analysis</a></li>
              <li><a href="/services#birth-chart" className="hover:text-secondary transition-colors">Birth Chart</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-lg font-display font-semibold">Company</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="/about" className="hover:text-secondary transition-colors">About Us</a></li>
              <li><a href="/privacy" className="hover:text-secondary transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-secondary transition-colors">Terms of Service</a></li>
              <li><a href="/data-deletion" className="hover:text-secondary transition-colors">Data Deletion</a></li>
              <li><a href="/contact" className="hover:text-secondary transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-display font-semibold">Connect</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-secondary" />
                <span className="text-primary-foreground/80">hello@starsignstudio.com</span>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-primary-foreground/60 text-sm">
            © 2024 Star Sign Studio. All rights reserved.
          </div>
          <div className="flex items-center space-x-2 text-primary-foreground/60 text-sm mt-4 md:mt-0">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-secondary fill-current" />
            <span>and cosmic energy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}