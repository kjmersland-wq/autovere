import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const contactSchema = z.object({
  kind: z.enum(["partner", "message"]),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().max(200).optional(),
  organisation: z.string().trim().max(200).optional(),
  country: z.string().trim().max(120).optional(),
  website: z.string().trim().max(300).optional(),
  message: z.string().trim().max(5000).optional(),
  locale: z.string().trim().min(2).max(12).optional(),
});

export type ContactPayload = z.infer<typeof contactSchema>;

export const sendContactMessage = createServerFn({ method: "POST" })
  .validator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.kind === "partner") {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error } = await supabaseAdmin.from("partner_applications").insert({
        organisation_name: data.organisation ?? data.name,
        country: data.country ?? "Not specified",
        website: data.website || null,
        contact_name: data.name,
        contact_email: data.email.toLowerCase(),
        description: data.message || null,
        locale: data.locale ?? "en",
      });
      if (error) {
        if (error.code === "23505") throw new Error("An application for this email is already awaiting review.");
        throw new Error("We could not save the application.");
      }
    }
    const { sendMail } = await import("@/lib/smtp.server");
    const to = "kjell@autovere.com";

    const isPartner = data.kind === "partner";
    const subject = isPartner
      ? `Partnersøknad — ${data.organisation ?? data.name}`
      : `Kontaktskjema — ${data.subject ?? "AutoVere"}`;

    const lines = [
      `Type: ${isPartner ? "Partnersøknad" : "Melding"}`,
      `Navn: ${data.name}`,
      `E-post: ${data.email}`,
      data.organisation ? `Organisasjon: ${data.organisation}` : null,
      data.country ? `Land: ${data.country}` : null,
      data.website ? `Nettside: ${data.website}` : null,
      data.subject ? `Emne: ${data.subject}` : null,
      "",
      data.message ?? "",
      "",
      "—",
      "Sendt fra autovere.com",
    ].filter((l) => l !== null);

    await sendMail({
      to,
      subject,
      text: lines.join("\n"),
      replyTo: data.email,
      fromName: "AutoVere",
    });

    return { ok: true as const };
  });
