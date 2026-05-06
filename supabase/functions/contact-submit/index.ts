import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Payload {
  name: string;
  email: string;
  subject: string;
  message: string;
  country?: string;
  vehicle_of_interest?: string;
}

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = (await req.json()) as Payload;
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const subject = String(body.subject ?? "").trim();
    const message = String(body.message ?? "").trim();
    const country = body.country ? String(body.country).trim().slice(0, 80) : null;
    const vehicle = body.vehicle_of_interest ? String(body.vehicle_of_interest).trim().slice(0, 120) : null;

    if (!name || name.length > 120) return bad("Please enter your name.");
    if (!isEmail(email) || email.length > 254) return bad("Please enter a valid email.");
    if (!subject || subject.length > 200) return bad("Please add a subject.");
    if (!message || message.length > 5000) return bad("Please write a message.");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { error } = await supabase.from("contact_messages").insert({
      name, email, subject, message, country, vehicle_of_interest: vehicle,
    });
    if (error) throw error;

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("contact-submit error", e);
    return new Response(JSON.stringify({ ok: false, error: "Something went wrong. Please try again." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function bad(msg: string) {
  return new Response(JSON.stringify({ ok: false, error: msg }), {
    status: 400,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
