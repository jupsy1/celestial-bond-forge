import { useState } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { ServiceCard } from "@/components/ui/service-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Sparkles, Moon, Calendar, Users, Zap, Crown, Gift } from "lucide-react";

const Services = () => {
  const [filter, setFilter] = useState<"all" | "free" | "premium" | "subscription">("all");

  const allServices = [
    // FREE SERVICES (2)
    {
      id: 1,
      title: "Daily Love Horoscope",
      description: "Start your day with cosmic guidance about your love life and romantic opportunities.",
      price: "FREE",
      type: "free",
      isFree: true,
      icon: "heart" as const,
      rating: 4.9,
      features: [
        "Personalized daily predictions",
        "Love and relationship insights", 
        "Best times for romance",
        "Weekly compatibility highlights"
      ]
    },
    {
      id: 2,
      title: "Basic Compatibility Score",
      description: "Quick compatibility check between any two zodiac signs. Get instant insights into your relationship potential.",
      price: "FREE",
      type: "free", 
      isFree: true,
      icon: "sparkles" as const,
      rating: 4.8,
      badge: "3 per day",
      features: [
        "Zodiac sign compatibility percentage",
        "Basic element harmony analysis",
        "Instant compatibility score",
        "3 free checks daily"
      ]
    },

    // PREMIUM ONE-TIME SERVICES ($2.99-$6.99)
    {
      id: 3,
      title: "Soul Mate Analysis",
      description: "Deep dive into your cosmic connection with detailed compatibility insights and relationship guidance.",
      price: "$4.99",
      type: "premium",
      isPopular: true,
      icon: "heart" as const,
      rating: 4.9,
      features: [
        "Complete astrological compatibility",
        "Relationship strengths & challenges", 
        "Communication style analysis",
        "Long-term potential assessment",
        "Downloadable PDF report"
      ]
    },
    {
      id: 4,
      title: "Weekly Love Forecast",
      description: "Seven days of detailed romantic predictions covering love, dates, and relationship milestones.",
      price: "$2.99",
      type: "premium",
      icon: "star" as const,
      rating: 4.7,
      badge: "per week",
      features: [
        "7-day detailed predictions",
        "Best days for dates & conversations",
        "Emotional energy patterns",
        "Weekly relationship goals"
      ]
    },
    {
      id: 5,
      title: "Birth Chart Compatibility",
      description: "Advanced astrological matching using Sun, Moon, and Rising signs for deeper romantic insights.",
      price: "$6.99",
      type: "premium",
      icon: "star" as const,
      rating: 4.8,
      features: [
        "Sun, Moon, Rising sign analysis",
        "Venus and Mars compatibility",
        "Advanced astrological matching",
        "Detailed compatibility report"
      ]
    },
    {
      id: 6,
      title: "Zodiac Personality Profile",
      description: "Complete personality breakdown based on your zodiac sign with relationship and career insights.",
      price: "$3.99",
      type: "premium",
      icon: "sparkles" as const,
      rating: 4.6,
      features: [
        "Complete personality breakdown",
        "Strengths and weaknesses analysis",
        "Career and relationship insights",
        "Personal growth recommendations"
      ]
    },

    // SUBSCRIPTION SERVICES ($4.99-$14.99/month)
    {
      id: 7,
      title: "Moon Phase Love Guide",
      description: "Monthly moon cycle guidance for romance. Learn when to start relationships and have important conversations.",
      price: "$4.99",
      type: "subscription",
      icon: "moon" as const,
      rating: 4.8,
      badge: "per month",
      features: [
        "Monthly moon cycle tracking",
        "Best times for romance by moon phase",
        "Manifestation guidance",
        "Monthly ritual suggestions"
      ]
    },
    {
      id: 8,
      title: "Monthly Astro Calendar",
      description: "30-day personalized calendar with daily romantic guidance and cosmic event tracking.",
      price: "$7.99",
      type: "subscription",
      icon: "calendar" as const,
      rating: 4.7,
      badge: "per month",
      features: [
        "30-day personalized calendar",
        "Daily best times for love/decisions",
        "Mercury retrograde warnings",
        "Venus transit opportunities"
      ]
    },
    {
      id: 9,
      title: "Relationship Timeline Planner",
      description: "6-month relationship roadmap for couples with milestone predictions and compatibility cycles.",
      price: "$9.99",
      type: "premium",
      icon: "users" as const,
      rating: 4.9,
      badge: "per couple",
      features: [
        "6-month relationship roadmap",
        "Best times for major decisions",
        "Compatibility cycles tracking",
        "Milestone predictions"
      ]
    },
    {
      id: 10,
      title: "Couple's Dashboard",
      description: "Joint account for couples with shared compatibility tracking and daily couple's horoscope.",
      price: "$14.99",
      type: "subscription",
      icon: "crown" as const,
      rating: 4.9,
      badge: "per month",
      isPopular: true,
      features: [
        "Joint compatibility tracking",
        "Daily couple's horoscope",
        "Relationship health metrics",
        "Communication timing advice",
        "Shared calendar integration"
      ]
    }
  ];

  const filteredServices = allServices.filter(service => {
    if (filter === "all") return true;
    return service.type === filter;
  });

  const bundleDeals = [
    {
      title: "Complete Reading Package",
      description: "Soul Mate Analysis + Birth Chart + Personality Profile",
      originalPrice: "$29.95",
      price: "$19.99",
      savings: "Save 30%",
      icon: "gift" as const
    },
    {
      title: "Monthly Unlimited",
      description: "All premium services + monthly subscriptions",
      price: "$24.99",
      badge: "per month",
      savings: "Best Value",
      icon: "zap" as const
    }
  ];

  const handleServiceSelect = (serviceId: number) => {
    console.log("Selected service:", serviceId);
    // Handle service selection - will integrate with auth/payment
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center space-y-6 mb-16">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground">
              Celestial Services
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Choose from our complete collection of mystical offerings to unlock the secrets of your cosmic love story. From free daily guidance to premium soul mate analysis.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { key: "all", label: "All Services", count: allServices.length },
              { key: "free", label: "Free", count: allServices.filter(s => s.type === "free").length },
              { key: "premium", label: "Premium", count: allServices.filter(s => s.type === "premium").length },
              { key: "subscription", label: "Monthly", count: allServices.filter(s => s.type === "subscription").length }
            ].map(({ key, label, count }) => (
              <Button
                key={key}
                variant={filter === key ? "default" : "outline"}
                onClick={() => setFilter(key as any)}
                className={`${filter === key ? 'cosmic-button' : 'cosmic-card border-primary/30 hover:border-primary/50'}`}
              >
                {label} ({count})
              </Button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredServices.map((service) => (
              <div key={service.id} className="relative">
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  price={service.badge ? `${service.price}/${service.badge}` : service.price}
                  isFree={service.isFree}
                  isPopular={service.isPopular}
                  icon={service.icon}
                  features={service.features}
                  onSelect={() => handleServiceSelect(service.id)}
                />
                
                {/* Rating Badge */}
                <div className="absolute top-4 right-4 cosmic-card px-3 py-1 flex items-center space-x-1">
                  <Star className="h-3 w-3 text-secondary fill-current" />
                  <span className="text-xs font-medium">{service.rating}</span>
                </div>

                {/* Additional Badge */}
                {service.badge && !service.isPopular && (
                  <Badge className="absolute -top-2 left-4 bg-accent text-accent-foreground">
                    {service.badge}
                  </Badge>
                )}
              </div>
            ))}
          </div>

          {/* Bundle Deals Section */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                Bundle Deals
              </h2>
              <p className="text-lg text-muted-foreground">
                Save more with our carefully curated service packages
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {bundleDeals.map((bundle, index) => {
                const IconComponent = bundle.icon === "gift" ? Gift : Zap;
                return (
                  <div key={index} className="cosmic-card p-8 space-y-6 text-center pulse-glow">
                    <div className="w-20 h-20 mx-auto bg-gradient-aurora rounded-full flex items-center justify-center">
                      <IconComponent className="h-10 w-10 text-primary-foreground" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-2xl font-display font-bold text-foreground">{bundle.title}</h3>
                      <p className="text-muted-foreground">{bundle.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      {bundle.originalPrice && (
                        <div className="text-lg text-muted-foreground line-through">{bundle.originalPrice}</div>
                      )}
                      <div className="text-3xl font-display font-bold text-primary">
                        {bundle.price}{bundle.badge && `/${bundle.badge}`}
                      </div>
                      <Badge className="bg-secondary text-secondary-foreground">
                        {bundle.savings}
                      </Badge>
                    </div>
                    
                    <Button className="cosmic-button w-full">
                      Get Bundle Deal
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-20 space-y-6">
            <div className="cosmic-card p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-display font-bold text-foreground mb-4">
                Ready to Begin Your Cosmic Journey?
              </h3>
              <p className="text-muted-foreground mb-6">
                Start with our free services and discover the power of celestial guidance in your love life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="cosmic-button">
                  Start Free Today
                </Button>
                <Button variant="outline" className="cosmic-card border-primary/30 hover:border-primary/50">
                  Create Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Services;