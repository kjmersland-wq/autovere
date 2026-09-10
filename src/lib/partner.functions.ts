import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { getAdminSupabaseContext } from "@/lib/admin-auth.functions";

const applicationSchema = z.object({
  organisation: z.string().trim().min(2).max(200),
  country: z.string().trim().min(2).max(120),
  website: z.string().trim().url().max(300).optional().or(z.literal("")),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  description: z.string().trim().max(5000).optional(),
  locale: z.string().trim().min(2).max(12).default("en"),
});

const codeSchema = z.string().trim().min(8).max(160);

function randomCode(prefix: string, bytes = 9) {
  const data = crypto.getRandomValues(new Uint8Array(bytes));
  const body = Array.from(data, (n) => n.toString(36).padStart(2, "0")).join("").toUpperCase();
  return `${prefix}-${body.slice(0, 16)}`;
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value.trim());
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

function slugify(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50) || "partner";
}

export const submitPartnerApplication = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => applicationSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("partner_applications").upsert(
      {
        organisation_name: data.organisation,
        country: data.country,
        website: data.website || null,
        contact_name: data.name,
        contact_email: data.email.toLowerCase(),
        description: data.description || null,
        locale: data.locale,
        status: "pending",
      },
      { onConflict: "contact_email", ignoreDuplicates: false },
    );
    if (error) {
      if (error.code === "23505") throw new Error("An application for this email is already awaiting review.");
      throw new Error("We could not save the application.");
    }
    return { ok: true as const };
  });

export const listPartnerApplications = createServerFn({ method: "GET" }).handler(async () => {
  const ctx = await getAdminSupabaseContext();
  if (!ctx.ok) return ctx.result;
  const { data, error } = await ctx.supabase.from("partner_applications").select("*").order("created_at", { ascending: false });
  if (error) return { status: "error" as const, message: "Kunne ikke hente partnersøknader." };
  return { status: "ok" as const, data: data ?? [] };
});

export const reviewPartnerApplication = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid(), decision: z.enum(["approved", "rejected"]), note: z.string().trim().max(1000).optional() }).parse(input))
  .handler(async ({ data }) => {
    const ctx = await getAdminSupabaseContext();
    if (!ctx.ok) return ctx.result;
    const { data: application } = await ctx.supabase.from("partner_applications").select("*").eq("id", data.id).single();
    if (!application) return { status: "error" as const, message: "Søknaden finnes ikke." };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.decision === "rejected") {
      await supabaseAdmin.from("partner_applications").update({ status: "rejected", review_note: data.note ?? null, reviewed_by: ctx.userId, reviewed_at: new Date().toISOString() }).eq("id", data.id);
      return { status: "ok" as const, decision: "rejected" as const };
    }

    const suffix = application.id.slice(0, 6);
    const slug = `${slugify(application.organisation_name)}-${suffix}`;
    const { data: partner, error: partnerError } = await supabaseAdmin.from("partners").upsert({
      application_id: application.id,
      organisation_name: application.organisation_name,
      slug,
      country: application.country,
      website: application.website,
      contact_name: application.contact_name,
      contact_email: application.contact_email,
      status: "active",
    }, { onConflict: "application_id" }).select("id").single();
    if (partnerError || !partner) return { status: "error" as const, message: "Kunne ikke opprette partneren." };

    const accessCode = randomCode("AVP");
    const referralCode = `AUTOVERE-${slugify(application.organisation_name).replace(/-/g, "").slice(0, 10).toUpperCase()}-${suffix.toUpperCase()}`;
    await supabaseAdmin.from("partner_access_codes").insert({ partner_id: partner.id, email: application.contact_email.toLowerCase(), code_hash: await sha256(accessCode), expires_at: new Date(Date.now() + 30 * 86400000).toISOString() });
    await supabaseAdmin.from("partner_referral_codes").upsert({ partner_id: partner.id, code: referralCode, discount_percent: 25, active: true }, { onConflict: "code" });
    await supabaseAdmin.from("partner_applications").update({ status: "approved", review_note: data.note ?? null, reviewed_by: ctx.userId, reviewed_at: new Date().toISOString() }).eq("id", data.id);

    try {
      const { sendMail } = await import("@/lib/smtp.server");
      await sendMail({
        to: application.contact_email,
        subject: "Your AutoVere Partner access is approved",
        text: `Welcome to the AutoVere Partner Programme.\n\nOpen https://www.autovere.com/partners/dashboard and activate access with this one-time code:\n\n${accessCode}\n\nYour customer code is:\n${referralCode}\n\nThe activation code expires in 30 days.`,
        fromName: "AutoVere Partner Programme",
        replyTo: "kjell@autovere.com",
      });
    } catch {
      return { status: "ok" as const, decision: "approved" as const, accessCode, referralCode, emailSent: false };
    }
    return { status: "ok" as const, decision: "approved" as const, accessCode, referralCode, emailSent: true };
  });

export const activatePartnerAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ code: codeSchema }).parse(input))
  .handler(async ({ data, context }) => {
    const email = typeof context.claims.email === "string" ? context.claims.email : "";
    if (!email) throw new Error("Your signed-in account has no verified email address.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.rpc("activate_partner_access_for_user", { _code_hash: await sha256(data.code), _user_id: context.userId, _email: email });
    if (error) throw new Error(error.message.includes("email_mismatch") ? "Sign in with the email address used in your application." : "This activation code is invalid, expired, or already used.");
    return { ok: true as const };
  });

export const getPartnerDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: memberships, error } = await context.supabase.from("partner_users").select("partner_id, role").eq("user_id", context.userId).limit(1);
    if (error || !memberships?.[0]) return { status: "no_access" as const };
    const partnerId = memberships[0].partner_id;
    const [{ data: partner }, { data: codes }] = await Promise.all([
      context.supabase.from("partners").select("id, organisation_name, country, website, logo_url, contact_name, contact_email, status").eq("id", partnerId).single(),
      context.supabase.from("partner_referral_codes").select("id, code, active, discount_percent, redemption_count, created_at").eq("partner_id", partnerId),
    ]);
    if (!partner) return { status: "no_access" as const };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data: events }, { count: redemptions }] = await Promise.all([
      supabaseAdmin.from("partner_events").select("event_type, created_at").eq("partner_id", partnerId).gte("created_at", new Date(Date.now() - 90 * 86400000).toISOString()),
      supabaseAdmin.from("partner_redemptions").select("id", { count: "exact", head: true }).eq("partner_id", partnerId),
    ]);
    const totals = { link_click: 0, signup: 0, conversion: 0 };
    for (const event of events ?? []) totals[event.event_type] += 1;
    let logoUrl: string | null = null;
    if (partner.logo_url) {
      const { data } = await context.supabase.storage.from("partner-logos").createSignedUrl(partner.logo_url, 3600);
      logoUrl = data?.signedUrl ?? null;
    }
    return { status: "ok" as const, data: { partner: { ...partner, logo_url: logoUrl }, codes: codes ?? [], totals, redemptions: redemptions ?? 0 } };
  });

export const updatePartnerProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ organisationName: z.string().trim().min(2).max(200), website: z.string().trim().url().max(300).optional().or(z.literal("")), contactName: z.string().trim().min(2).max(120) }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: membership } = await context.supabase.from("partner_users").select("partner_id").eq("user_id", context.userId).limit(1).single();
    if (!membership) throw new Error("Partner access is required.");
    const { error } = await context.supabase.from("partners").update({ organisation_name: data.organisationName, website: data.website || null, contact_name: data.contactName }).eq("id", membership.partner_id);
    if (error) throw new Error("The profile could not be saved.");
    return { ok: true as const };
  });

export const uploadPartnerLogo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ dataUrl: z.string().max(2_900_000), mime: z.enum(["image/png", "image/jpeg", "image/webp"]) }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: membership } = await context.supabase.from("partner_users").select("partner_id").eq("user_id", context.userId).limit(1).single();
    if (!membership) throw new Error("Partner access is required.");
    const encoded = data.dataUrl.split(",")[1];
    if (!encoded) throw new Error("The logo file is invalid.");
    const binary = Uint8Array.from(atob(encoded), (character) => character.charCodeAt(0));
    if (binary.byteLength > 2_000_000) throw new Error("The logo must be smaller than 2 MB.");
    const extension = data.mime === "image/png" ? "png" : data.mime === "image/webp" ? "webp" : "jpg";
    const path = `${membership.partner_id}/logo.${extension}`;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.storage.from("partner-logos").upload(path, binary, { contentType: data.mime, upsert: true });
    if (error) throw new Error("The logo could not be uploaded.");
    await supabaseAdmin.from("partners").update({ logo_url: path }).eq("id", membership.partner_id);
    return { ok: true as const };
  });

export const redeemPartnerCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ code: z.string().trim().min(6).max(80) }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: result, error } = await supabaseAdmin.rpc("redeem_partner_referral_for_user", { _code: data.code, _user_id: context.userId });
    if (error || !result?.[0]) throw new Error("This partner code is not valid.");
    return { ok: true as const, discountPercent: result[0].discount_percent };
  });