import { createFileRoute } from "@tanstack/react-router";
import { verifyMagicToken } from "@/lib/auth";

export const Route = createFileRoute("/api/verify-login")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        let email: string | null = null;
        try { email = verifyMagicToken(new URL(request.url).searchParams.get("token") ?? ""); } catch { email = null; }
        if (!email) return Response.json({ error: "This login link is invalid or has expired." }, { status: 401 });
        return new Response(null, { status: 302, headers: { Location: "/?login=success", "Set-Cookie": `autovere_user=${encodeURIComponent(email)}; Path=/; Max-Age=2592000; HttpOnly; Secure; SameSite=Lax` } });
      },
    },
  },
});
