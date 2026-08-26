import { createFileRoute } from "@tanstack/react-router";
import { verifyMagicToken } from "@/lib/auth";

export const Route = createFileRoute("/api/auth/verify")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const token = new URL(request.url).searchParams.get("token") ?? "";
        let email: string | null = null;
        try { email = verifyMagicToken(token); } catch { email = null; }
        if (!email) return Response.json({ error: "This login link is invalid or has expired." }, { status: 401 });
        return new Response(null, { status: 302, headers: { "Location": "/?login=success", "Set-Cookie": `autovere_user=${encodeURIComponent(email)}; Path=/; Max-Age=2592000; HttpOnly; Secure; SameSite=Lax` } });
      },
    },
  },
});