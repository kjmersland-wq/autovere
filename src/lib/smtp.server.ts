/**
 * Minimal SMTP-over-TLS client (implicit TLS, port 465).
 * Works both on the edge runtime (cloudflare:sockets) and in Node dev (node:tls).
 * Server-only — never import from browser code.
 */

type Stream = {
  readable: ReadableStream<Uint8Array>;
  writable: WritableStream<Uint8Array>;
  close: () => void;
};

async function openTlsStream(host: string, port: number): Promise<Stream> {
  const cfModule = "cloudflare:sockets";
  try {
    const { connect } = (await import(/* @vite-ignore */ cfModule)) as {
      connect: (a: { hostname: string; port: number }, o?: { secureTransport?: string }) => {
        readable: ReadableStream<Uint8Array>;
        writable: WritableStream<Uint8Array>;
        close: () => void;
      };
    };
    const socket = connect({ hostname: host, port }, { secureTransport: "on" });
    return { readable: socket.readable, writable: socket.writable, close: () => socket.close() };
  } catch {
    const tls = await import(/* @vite-ignore */ "node:tls");
    const streamMod = await import(/* @vite-ignore */ "node:stream");
    const socket = tls.connect({ host, port, servername: host });
    await new Promise<void>((resolve, reject) => {
      socket.once("secureConnect", () => resolve());
      socket.once("error", reject);
    });
    return {
      readable: streamMod.Readable.toWeb(socket) as unknown as ReadableStream<Uint8Array>,
      writable: streamMod.Writable.toWeb(socket) as unknown as WritableStream<Uint8Array>,
      close: () => socket.destroy(),
    };
  }
}

class SmtpSession {
  private decoder = new TextDecoder();
  private encoder = new TextEncoder();
  private buffer = "";

  constructor(
    private reader: ReadableStreamDefaultReader<Uint8Array>,
    private writer: WritableStreamDefaultWriter<Uint8Array>,
  ) {}

  private async readReply(): Promise<{ code: number; text: string }> {
    for (;;) {
      const lines = this.buffer.split("\r\n");
      for (let i = 0; i < lines.length - 1; i++) {
        // a reply is complete when a line has "NNN " (space, not dash)
        if (/^\d{3} /.test(lines[i]!)) {
          const complete = lines.slice(0, i + 1).join("\r\n");
          this.buffer = lines.slice(i + 1).join("\r\n");
          return { code: Number(lines[i]!.slice(0, 3)), text: complete };
        }
      }
      const { value, done } = await this.reader.read();
      if (done) throw new Error("SMTP connection closed unexpectedly");
      this.buffer += this.decoder.decode(value, { stream: true });
    }
  }

  async expect(codes: number[], label: string) {
    const reply = await this.readReply();
    if (!codes.includes(reply.code)) {
      throw new Error(`SMTP ${label} failed: ${reply.text.trim()}`);
    }
    return reply;
  }

  async send(line: string) {
    await this.writer.write(this.encoder.encode(`${line}\r\n`));
  }

  async command(line: string, codes: number[], label: string) {
    await this.send(line);
    return this.expect(codes, label);
  }
}

function b64(input: string) {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function encodeHeader(value: string) {
  // RFC 2047 for non-ASCII subjects / names
  // eslint-disable-next-line no-control-regex
  return /^[\x00-\x7F]*$/.test(value) ? value : `=?UTF-8?B?${b64(value)}?=`;
}

function dotStuff(body: string) {
  return body.replace(/\r?\n/g, "\r\n").replace(/\r\n\./g, "\r\n..");
}

export type MailOptions = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
  fromName?: string;
};

export async function sendMail({ to, subject, text, replyTo, fromName }: MailOptions) {
  const user = process.env["GMAIL_USER"];
  const pass = process.env["GMAIL_APP_PASSWORD"];
  if (!user || !pass) throw new Error("Gmail credentials are not configured");

  const stream = await openTlsStream("smtp.gmail.com", 465);
  const reader = stream.readable.getReader();
  const writer = stream.writable.getWriter();
  const smtp = new SmtpSession(reader, writer);

  try {
    await smtp.expect([220], "greeting");
    await smtp.command("EHLO autovere.com", [250], "EHLO");
    await smtp.command("AUTH LOGIN", [334], "AUTH");
    await smtp.command(b64(user), [334], "username");
    await smtp.command(b64(pass.replace(/\s+/g, "")), [235], "password");
    await smtp.command(`MAIL FROM:<${user}>`, [250], "MAIL FROM");
    await smtp.command(`RCPT TO:<${to}>`, [250, 251], "RCPT TO");
    await smtp.command("DATA", [354], "DATA");

    const headers = [
      `From: ${encodeHeader(fromName ?? "AutoVere")} <${user}>`,
      `To: <${to}>`,
      replyTo ? `Reply-To: <${replyTo}>` : null,
      `Subject: ${encodeHeader(subject)}`,
      `Date: ${new Date().toUTCString()}`,
      "MIME-Version: 1.0",
      'Content-Type: text/plain; charset="UTF-8"',
      "Content-Transfer-Encoding: 8bit",
    ]
      .filter(Boolean)
      .join("\r\n");

    await smtp.send(`${headers}\r\n\r\n${dotStuff(text)}\r\n.`);
    await smtp.expect([250], "message body");
    await smtp.command("QUIT", [221], "QUIT");
  } finally {
    try {
      await writer.close();
    } catch {
      /* ignore */
    }
    try {
      reader.releaseLock();
    } catch {
      /* ignore */
    }
    try {
      stream.close();
    } catch {
      /* ignore */
    }
  }
}
