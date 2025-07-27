import { useState, useEffect } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { ServiceCard } from "@/components/ui/service-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Sparkles, Moon, Calendar, Users, Zap, Crown, Gift } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Services = () => {
  const [filter, setFilter] = useState<"all" | "free" | "premium" | "subscription">("all");
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, [filter]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filter !== "all") {
        params.append("type", filter);
      }

      const { data, error } = await supabase.functions.invoke('get-services', {
        body: { filter }
      });

      if (error) throw error;

      if (data?.success) {
        setServices(data.data);
      } else {
        throw new Error(data?.error || 'Failed to fetch services');
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services. Please try again.');
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services;

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

  const handleServiceSelect = async (serviceId: number) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    try {
      if (service.type === "subscription") {
        // Handle subscription checkout
        let stripePlan = "premium";
        if (service.title.includes("Moon Phase")) stripePlan = "credits_50";
        if (service.title.includes("Monthly Astro")) stripePlan = "credits_100";
        if (service.title.includes("Couple's Dashboard")) stripePlan = "premium";
        
        const { data, error } = await supabase.functions.invoke('create-checkout', {
          body: { plan: stripePlan }
        });
        
        if (error) throw error;
        if (data?.url) {
          window.open(data.url, '_blank');
        }
      } else if (service.type === "premium") {
        // Handle one-time payment
        const priceInCents = parseFloat(service.price.replace('$', '')) * 100;
        const { data, error } = await supabase.functions.invoke('create-payment', {
          body: { 
            serviceId: service.id, 
            amount: priceInCents,
            credits: 0
          }
        });
        
        if (error) throw error;
        if (data?.url) {
          window.open(data.url, '_blank');
        }
      } else {
        // Free service - just log for now
        toast.success("Free service selected! This will redirect to the service page.");
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    }
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
              { key: "all", label: "All Services", count: services.length },
              { key: "free", label: "Free", count: services.filter(s => s.type === "free").length },
              { key: "premium", label: "Premium", count: services.filter(s => s.type === "premium").length },
              { key: "subscription", label: "Monthly", count: services.filter(s => s.type === "subscription").length }
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
          {loading ? (
            <div className="text-center py-12">
              <div className="cosmic-card p-8">
                <p className="text-muted-foreground">Loading celestial services...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="cosmic-card p-8">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={fetchServices} className="cosmic-button">
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
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
          )}

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