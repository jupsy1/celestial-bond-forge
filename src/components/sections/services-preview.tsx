import { ServiceCard } from "@/components/ui/service-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function ServicesPreview() {
  const featuredServices = [
    {
      title: "Daily Love Horoscope",
      description: "Start your day with cosmic guidance about your love life and romantic opportunities.",
      price: "FREE",
      isFree: true,
      icon: "heart" as const,
      features: [
        "Personalized daily predictions",
        "Love and relationship insights",
        "Best times for romance",
        "Weekly compatibility highlights"
      ]
    },
    {
      title: "Soul Mate Analysis",
      description: "Deep dive into your cosmic connection with detailed compatibility insights.",
      price: "£4.99",
      isPopular: true,
      icon: "sparkles" as const,
      features: [
        "Complete astrological compatibility",
        "Relationship strengths & challenges",
        "Communication style analysis",
        "Long-term potential assessment"
      ]
    },
    {
      title: "Weekly Love Forecast",
      description: "Seven days of detailed predictions covering love, romance, and relationships.",
      price: "£4.99",
      icon: "star" as const,
      features: [
        "7-day detailed predictions",
        "Best dates for romance",
        "Relationship advice",
        "Lucky colors and numbers"
      ]
    }
  ];

  const handleServiceSelect = (serviceTitle: string) => {
    console.log("Selected service:", serviceTitle);
    // Handle service selection logic here
  };

  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
            Celestial Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our mystical offerings to unlock the secrets of your cosmic love story
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredServices.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              price={service.price}
              isFree={service.isFree}
              isPopular={service.isPopular}
              icon={service.icon}
              features={service.features}
              onSelect={() => handleServiceSelect(service.title)}
            />
          ))}
        </div>

        <div className="text-center">
          <Link to="/services">
            <Button size="lg" variant="outline" className="cosmic-card border-primary/30 hover:border-primary/50">
              View All Services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}