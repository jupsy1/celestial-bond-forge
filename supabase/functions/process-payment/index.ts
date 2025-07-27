import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PROCESS-PAYMENT] ${step}${detailsStr}`);
};

// Reading content generators
const generateMonthlyAstroCalendar = (userEmail: string) => {
  const currentDate = new Date();
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  
  return `# ${month} ${year} Astro Calendar for ${userEmail}

## This Month's Cosmic Highlights

Welcome to your personalized ${month} astro calendar! The stars have aligned some powerful energies for you this month.

### Key Dates to Watch:

**Week 1 (${getWeekRange(1)})**
- New Moon Energy: Fresh starts in love and career
- Best days for important conversations: Monday & Wednesday
- Mercury influence: Clear communication in relationships

**Week 2 (${getWeekRange(2)})**
- Venus Transit: Romance and creativity peak
- Ideal time for first dates or rekindling romance
- Financial opportunities may present themselves

**Week 3 (${getWeekRange(3)})**
- Full Moon Manifestation: Your intentions reach peak power
- Best time for major decisions and commitments
- Past relationships may resurface for closure

**Week 4 (${getWeekRange(4)})**
- Reflection and Planning: Prepare for next month's energies
- Perfect time for self-care and spiritual practices
- Career opportunities may emerge toward month's end

### Daily Affirmations for ${month}:
- "I am aligned with cosmic abundance"
- "Love flows to me effortlessly"
- "I trust the universe's perfect timing"

### Monthly Ritual Suggestion:
Light a white candle on the New Moon and set three intentions for love, career, and personal growth. Keep this energy alive throughout the month.

*Your astro calendar has been personally crafted based on current planetary movements and your purchase date.*`;
};

const getWeekRange = (week: number) => {
  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startWeek = new Date(startOfMonth.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000);
  const endWeek = new Date(startWeek.getTime() + 6 * 24 * 60 * 60 * 1000);
  
  return `${startWeek.getDate()}-${endWeek.getDate()}`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const { sessionId } = await req.json();
    if (!sessionId) throw new Error("Session ID is required");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Get the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    logStep("Retrieved session", { sessionId, status: session.payment_status });

    if (session.payment_status !== 'paid') {
      throw new Error("Payment not completed");
    }

    // Get the order details
    const { data: orders, error: orderError } = await supabaseClient
      .from('orders')
      .select('*, services(name, category)')
      .eq('stripe_session_id', sessionId)
      .single();

    if (orderError) throw new Error(`Order not found: ${orderError.message}`);
    logStep("Found order", { orderId: orders.id, serviceName: orders.services?.name });

    // Update order status
    await supabaseClient
      .from('orders')
      .update({ status: 'paid' })
      .eq('id', orders.id);

    // Generate reading content based on service
    let readingContent = '';
    let readingTitle = '';

    if (orders.services?.name === 'Monthly Astro Calendar') {
      readingContent = generateMonthlyAstroCalendar(session.customer_email || 'Valued Customer');
      readingTitle = `${new Date().toLocaleString('default', { month: 'long' })} Astro Calendar`;
    } else {
      // Default reading for other services
      readingContent = `# Your ${orders.services?.name} Reading

Thank you for your purchase! Your personalized reading has been generated.

## Your Reading

Based on your purchase of ${orders.services?.name}, here is your personalized cosmic guidance:

*This is a personalized reading generated specifically for you. The content reflects the cosmic energies at the time of your purchase.*

Your reading includes detailed insights tailored to your current cosmic profile. Please save this reading for future reference.

**Note:** For the most accurate readings, please ensure your birth information is complete in your profile.`;
      readingTitle = `Your ${orders.services?.name} Reading`;
    }

    // Create the reading record
    const { error: readingError } = await supabaseClient
      .from('readings')
      .insert({
        user_id: orders.user_id,
        service_id: orders.service_id,
        title: readingTitle,
        content: readingContent,
        reading_type: orders.services?.category || 'general',
        metadata: {
          order_id: orders.id,
          session_id: sessionId,
          generated_at: new Date().toISOString()
        }
      });

    if (readingError) throw new Error(`Failed to create reading: ${readingError.message}`);
    logStep("Reading created successfully");

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Payment processed and reading delivered" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in process-payment", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});