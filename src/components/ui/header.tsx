import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-2xl font-display font-bold text-primary">Celestial</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/services" className="text-foreground hover:text-primary transition-colors">
              Services
            </Link>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">
              About
            </a>
            <a href="#testimonials" className="text-foreground hover:text-primary transition-colors">
              Reviews
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="cosmic-button">
                Sign Up Free
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <nav className="flex flex-col space-y-4">
              <Link to="/services" className="text-foreground hover:text-primary transition-colors">
                Services
              </Link>
              <a href="#about" className="text-foreground hover:text-primary transition-colors">
                About
              </a>
              <a href="#testimonials" className="text-foreground hover:text-primary transition-colors">
                Reviews
              </a>
              <div className="flex flex-col space-y-2 pt-4 border-t border-border/50">
                <Link to="/login">
                  <Button variant="ghost" className="justify-start w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="cosmic-button justify-start w-full">
                    Sign Up Free
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}