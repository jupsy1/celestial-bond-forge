import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, Sparkles, Moon, Calendar, Users, Crown } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  price: string;
  isFree?: boolean;
  isPopular?: boolean;
  features: string[];
  icon?: "star" | "heart" | "sparkles" | "moon" | "calendar" | "users" | "crown";
  badge?: string;
  type?: "free" | "premium" | "subscription";
  onSelect: () => void;
}

const icons = {
  star: Star,
  heart: Heart,
  sparkles: Sparkles,
  moon: Moon,
  calendar: Calendar,
  users: Users,
  crown: Crown,
};

export function ServiceCard({
  title,
  description,
  price,
  isFree = false,
  isPopular = false,
  features,
  icon = "sparkles",
  badge,
  type = "premium",
  onSelect,
}: ServiceCardProps) {
  const IconComponent = icons[icon];

  return (
    <div className={`cosmic-card p-6 space-y-6 relative ${isPopular ? 'ring-2 ring-secondary pulse-glow' : ''} floating-animation`}>
      {isPopular && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-aurora text-primary-foreground">
          Most Popular
        </Badge>
      )}
      
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto bg-gradient-cosmic rounded-full flex items-center justify-center">
          <IconComponent className="h-8 w-8 text-primary-foreground" />
        </div>
        
        <div>
          <h3 className="text-xl font-display font-bold text-foreground">{title}</h3>
          <p className="text-muted-foreground mt-2">{description}</p>
        </div>
        
        <div className="space-y-1">
          <div className="text-3xl font-display font-bold text-primary">
            {isFree ? "FREE" : price}
          </div>
          {badge && (
            <Badge variant="secondary" className="text-xs">{badge}</Badge>
          )}
          {!isFree && (
            <div className="text-sm text-muted-foreground">
              {type === "subscription" ? "Monthly subscription" : "One-time purchase"}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-foreground">What you'll get:</h4>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-2 text-sm">
              <Sparkles className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button 
        onClick={onSelect}
        className={`w-full ${isFree ? 'cosmic-button' : 'cosmic-button'}`}
      >
        {isFree ? "Try Free Now" : type === "subscription" ? "Start Subscription" : "Get Reading"}
      </Button>
    </div>
  );
}