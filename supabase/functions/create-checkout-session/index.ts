import { createClient } from 'npm:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function getStripe(): Stripe {
  const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
  if (!stripeKey) throw new Error('STRIPE_SECRET_KEY not configured');
  return new Stripe(stripeKey, {
    apiVersion: '2024-11-20.acacia',
    httpClient: Stripe.createFetchHttpClient(),
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Not authenticated');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { priceId, successUrl, cancelUrl, customerEmail } = await req.json();
    
    if (!priceId) throw new Error('priceId is required');

    const stripe = getStripe();

    // Check if customer exists in Stripe
    let customerId: string | undefined;
    const customers = await stripe.customers.list({
      email: customerEmail || user.email!,
      limit: 1,
    });

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      // Create new customer
      const customer = await stripe.customers.create({
        email: customerEmail || user.email!,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;
    }

    // Get or create price in Stripe based on priceId
    let stripePriceId: string;
    
    // Map internal price IDs to Stripe price IDs
    // You'll need to create these prices in Stripe dashboard first
    const priceMapping: Record<string, string> = {
      'premium_monthly': Deno.env.get('STRIPE_PRICE_MONTHLY') || 'price_monthly',
      'premium_yearly': Deno.env.get('STRIPE_PRICE_YEARLY') || 'price_yearly',
    };

    stripePriceId = priceMapping[priceId];
    if (!stripePriceId) throw new Error(`Unknown price ID: ${priceId}`);

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${req.headers.get('origin')}/pricing?checkout=success`,
      cancel_url: cancelUrl || `${req.headers.get('origin')}/pricing`,
      metadata: {
        user_id: user.id,
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
        },
      },
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'Content-Type': 'application/json' },
      }
    );
  } catch (e) {
    console.error('Checkout session error:', e);
    return new Response(
      JSON.stringify({ error: String(e) }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
