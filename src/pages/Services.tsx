import { useState, useEffect } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { ServiceCard } from "@/components/ui/service-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Sparkles, Moon, Calendar, Users, Zap, Crown, Gift } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const Services = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [filter, setFilter] = useState<"all" | "free" | "premium">("all");
  const [services, setServices] = useState<any[]>([]);
  const [allServices, setAllServices] = useState<any[]>([]); // Store all services for counting
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []); // Only fetch once on mount

  useEffect(() => {
    applyFilter(filter);
  }, [filter, allServices]); // Apply filter when filter changes or when services are loaded

  const applyFilter = (filterType: string) => {
    if (allServices.length === 0) return;
    
    console.log('Applying filter:', filterType);
    console.log('All services count:', allServices.length);
    
    let filteredData = allServices;
    if (filterType === "free") {
      filteredData = allServices.filter((s: any) => s.isFree === true);
      console.log('Free services filtered:', filteredData.length);
    } else if (filterType === "premium") {
      filteredData = allServices.filter((s: any) => s.isFree === false);
      console.log('Premium services filtered:', filteredData.length);
    }
    
    console.log('Setting services to:', filteredData.length);
    setServices(filteredData);
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching services...');

      const { data, error } = await supabase.functions.invoke('get-services', {
        method: 'GET'
      });

      if (error) throw error;

      if (data?.success) {
        console.log('Raw services data received:', data.data.length);
        setAllServices(data.data);
      } else {
        throw new Error(data?.error || 'Failed to fetch services');
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services; // Services are already filtered by applyFilter function

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

  const handleServiceSelect = async (service: any) => {
    console.log('Selected service:', service.title);
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to purchase services",
        variant: "destructive",
      });
      return;
    }

    if (service.isFree) {
      // Handle free services - could navigate to a reading page or generate content
      toast({
        title: "Free Service",
        description: "This feature will be available soon!",
      });
      return;
    }

    // Determine payment type based on service
    const isSubscription = service.badge === "per month" || service.title.toLowerCase().includes("monthly");
    
    try {
      if (isSubscription) {
        // Handle subscription services
        const { data, error } = await supabase.functions.invoke('create-checkout', {
          body: { 
            plan: service.title.toLowerCase().includes("unlimited") ? "premium" : "basic",
            priceId: service.stripe_price_id // You'll need to add this to your services
          }
        });
        
        if (error) throw error;
        window.open(data.url, '_blank');
      } else {
        // Handle one-time payments
        const priceInCents = Math.round(parseFloat(service.price.replace(/[^0-9.]/g, '')) * 100);
        
        const { data, error } = await supabase.functions.invoke('create-payment', {
          body: {
            serviceId: service.id,
            amount: priceInCents,
            credits: 0
          }
        });
        
        if (error) throw error;
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
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
              { key: "all", label: "All Services", count: allServices.length },
              { key: "free", label: "Free", count: allServices.filter(s => s.isFree).length },
              { key: "premium", label: "Premium", count: allServices.filter(s => !s.isFree).length }
            ].map(({ key, label, count }) => (
              <Button
                key={key}
                variant={filter === key ? "default" : "outline"}
                onClick={() => {
                  console.log('Filter button clicked:', key, 'Current filter:', filter);
                  setFilter(key as any);
                  applyFilter(key);
                }}
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
                  price={service.price}
                  isFree={service.isFree}
                  isPopular={service.isPopular}
                  features={service.features}
                  icon={service.icon}
                  badge={service.badge}
                  type={service.badge === "per month" || service.title.toLowerCase().includes("monthly") ? "subscription" : service.isFree ? "free" : "premium"}
                  onSelect={() => handleServiceSelect(service)}
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