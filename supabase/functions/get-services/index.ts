import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GET-SERVICES] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");
    
    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    const type = url.searchParams.get("type");
    
    logStep("Query parameters", { category, type });

    let query = supabaseClient
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("price_credits", { ascending: true });

    if (category) {
      query = query.eq("category", category);
    }

    if (type === "free") {
      query = query.eq("is_premium", false);
    } else if (type === "premium") {
      query = query.eq("is_premium", true);
    }

    const { data: services, error } = await query;

    if (error) {
      logStep("Database error", { error: error.message });
      throw error;
    }

    logStep("Services fetched successfully", { count: services?.length || 0 });

    // Transform services to match frontend expectations
    const transformedServices = services?.map(service => ({
      id: service.id,
      title: service.name,
      description: service.description,
      price: service.is_premium ? `$${(service.price_credits / 100).toFixed(2)}` : "FREE",
      type: service.is_premium ? "premium" : "free",
      category: service.category,
      isFree: !service.is_premium,
      isPopular: service.price_credits === 499 || service.price_credits === 1499, // Soul Mate Analysis and Couples Dashboard
      icon: getIconForCategory(service.category),
      rating: Math.round((4.6 + Math.random() * 0.4) * 10) / 10, // Random rating between 4.6-5.0
      features: getFeaturesForService(service.name),
      badge: service.category === "monthly" ? "per month" : undefined
    })) || [];

    return new Response(JSON.stringify({
      success: true,
      data: transformedServices,
      count: transformedServices.length
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in get-services", { message: errorMessage });
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

function getIconForCategory(category: string): string {
  const iconMap: Record<string, string> = {
    daily: "heart",
    compatibility: "sparkles", 
    forecasts: "star",
    profiles: "sparkles",
    monthly: "moon",
    planning: "users",
    premium: "crown"
  };
  return iconMap[category] || "sparkles";
}

function getFeaturesForService(serviceName: string): string[] {
  const featuresMap: Record<string, string[]> = {
    "Daily Love Horoscope": [
      "Personalized daily predictions",
      "Love and relationship insights",
      "Best times for romance",
      "Weekly compatibility highlights"
    ],
    "Basic Compatibility Score": [
      "Zodiac sign compatibility percentage",
      "Basic element harmony analysis", 
      "Instant compatibility score",
      "3 free checks daily"
    ],
    "Soul Mate Analysis": [
      "Complete astrological compatibility",
      "Relationship strengths & challenges",
      "Communication style analysis",
      "Long-term potential assessment",
      "Downloadable PDF report"
    ],
    "Weekly Love Forecast": [
      "7-day detailed predictions",
      "Best days for dates & conversations",
      "Emotional energy patterns",
      "Weekly relationship goals"
    ],
    "Birth Chart Compatibility": [
      "Sun, Moon, Rising sign analysis",
      "Venus and Mars compatibility",
      "Advanced astrological matching",
      "Detailed compatibility report"
    ],
    "Zodiac Personality Profile": [
      "Complete personality breakdown",
      "Strengths and weaknesses analysis",
      "Career and relationship insights", 
      "Personal growth recommendations"
    ],
    "Moon Phase Love Guide": [
      "Monthly moon cycle tracking",
      "Best times for romance by moon phase",
      "Manifestation guidance",
      "Monthly ritual suggestions"
    ],
    "Monthly Astro Calendar": [
      "30-day personalized calendar",
      "Daily best times for love/decisions",
      "Mercury retrograde warnings",
      "Venus transit opportunities"
    ],
    "Relationship Timeline Planner": [
      "6-month relationship roadmap",
      "Best times for major decisions",
      "Compatibility cycles tracking",
      "Milestone predictions"
    ],
    "Couples Dashboard": [
      "Joint compatibility tracking",
      "Daily couple's horoscope", 
      "Relationship health metrics",
      "Communication timing advice",
      "Shared calendar integration"
    ]
  };
  return featuresMap[serviceName] || ["Premium service", "Expert guidance", "Detailed insights"];
}