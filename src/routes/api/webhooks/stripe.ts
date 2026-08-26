import { createFileRoute } from "@tanstack/react-router";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import { authBaseUrl, createMagicToken } from "@/lib/auth";

export const Route = createFileRoute("/api/webhooks/stripe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.STRIPE_SECRET_KEY;
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        const signature = request.headers.get("stripe-signature");
        if (!secret || !webhookSecret || !signature) return Response.json({ error: "Webhook is not configured." }, { status: 400 });
        const stripe = new Stripe(secret);
        let event: Stripe.Event;
        try {
          event = stripe.webhooks.constructEvent(await request.text(), signature, webhookSecret);
        } catch (error) {
          console.error("Stripe webhook signature verification failed", error);
          return Response.json({ error: "Invalid webhook signature." }, { status: 400 });
        }
        if (event.type === "checkout.session.completed") {
          const session = event.data.object as Stripe.Checkout.Session;
          const email = session.customer_details?.email;
          if (email && process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD && process.env.AUTH_TOKEN_SECRET) {
            const link = `${authBaseUrl(request)}/api/auth/verify?token=${encodeURIComponent(createMagicToken(email))}`;
            try {
              await nodemailer.createTransport({ service: "gmail", auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD } }).sendMail({
                from: process.env.GMAIL_USER,
                to: email,
                subject: "Your AutoVere access link",
                text: `Thank you for subscribing to AutoVere. Sign in here (valid for 15 minutes):\n\n${link}`,
                html: `<p>Thank you for subscribing to AutoVere.</p><p><a href="${link}">Open your AutoVere account</a></p><p>This link is valid for 15 minutes.</p>`,
              });
            } catch (error) {
              console.error("Subscription access email failed", error);
              return Response.json({ error: "Could not send subscription access email." }, { status: 500 });
            }
          }
        }
        return Response.json({ received: true });
      },
    },
  },
});
