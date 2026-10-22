import { resolvePaddlePrice } from "@/utils/payments.functions";

const clientToken = import.meta.env["VITE_PAYMENTS_CLIENT_TOKEN"];

declare global {
  interface Window {
    Paddle: any;
  }
}

export type PaddleEnv = "sandbox" | "live";

// Single source of truth for which environment the client is in, derived from
// the token prefix so it stays correct after the build-time token swap.
export function getPaddleEnvironment(): PaddleEnv {
  if (clientToken?.startsWith("test_")) return "sandbox";
  if (clientToken?.startsWith("live_")) return "live";
  throw new Error("Payments are not configured. Complete go-live in the Payments tab to enable production checkout.");
}

let paddleInitialized = false;

export async function initializePaddle() {
  if (paddleInitialized) return;
  if (!clientToken) throw new Error("VITE_PAYMENTS_CLIENT_TOKEN is not set");

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.onload = () => {
      window.Paddle.Environment.set(getPaddleEnvironment() === "sandbox" ? "sandbox" : "production");
      window.Paddle.Initialize({ token: clientToken });
      paddleInitialized = true;
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export async function getPaddlePriceId(priceId: string): Promise<string> {
  return resolvePaddlePrice({ data: { priceId, environment: getPaddleEnvironment() } });
}
