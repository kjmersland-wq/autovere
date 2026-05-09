import Stripe from "npm:stripe@16";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Not authenticated");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { interval, locale } = await req.json();

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2024-06-20",
    });

    const priceId = interval === "year"
      ? Deno.env.get("STRIPE_PRICE_PREMIUM_YEARLY")!
      : Deno.env.get("STRIPE_PRICE_PREMIUM_MONTHLY")!;

    const origin = req.headers.get("origin") ?? "";
    const localePart = locale && locale !== "en" ? `/${locale}` : "";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: user.email,
      client_reference_id: user.id,
      success_url: `${origin}${localePart}/pricing?checkout=success`,
      cancel_url: `${origin}${localePart}/pricing`,
      metadata: { userId: user.id },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Checkout failed';
    const safeMsg = msg === 'Not authenticated' ? msg : 'Checkout failed';
    return new Response(JSON.stringify({ error: safeMsg }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
