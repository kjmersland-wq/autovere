import type { IncomingMessage, ServerResponse } from "node:http";

type Request = IncomingMessage;
type Response = ServerResponse & {
  status: (code: number) => Response;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => Response;
};

export default async function handler(request: Request, response: Response) {
  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }
  response.setHeader("Set-Cookie", "autovere_user=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax");
  response.status(200).json({ ok: true });
}
