import { createClient } from 'npm:@supabase/supabase-js@2';
import { stripeEnvironment } from './stripe.ts';

export type PremiumAuthContext = {
  requestId: string;
  userId: string;
  email: string | null;
};

export class PremiumAuthError extends Error {
  status: number;
  code: string;
  details?: string;

  constructor(status: number, code: string, message: string, details?: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const premiumJsonError = (
  status: number,
  code: string,
  message: string,
  requestId: string,
  details?: string,
  extraHeaders?: Record<string, string>
) =>
  new Response(JSON.stringify({ error: { code, message, details, requestId } }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...(extraHeaders ?? {}),
    },
  });

export const requirePremiumUser = async (
  req: Request,
  requestId = crypto.randomUUID()
): Promise<PremiumAuthContext> => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    throw new PremiumAuthError(401, 'unauthenticated', 'Authentication is required.');
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new PremiumAuthError(401, 'unauthenticated', 'Authentication is required.');
  }

  let env: 'live' | 'sandbox' | null = null;
  try {
    env = stripeEnvironment();
  } catch {
    env = null;
  }

  const { data: hasActive, error: subscriptionError } = await supabase.rpc('has_active_subscription', {
    user_uuid: user.id,
    check_env: env,
  });

  if (subscriptionError) {
    throw new PremiumAuthError(
      500,
      'subscription_check_failed',
      'Could not verify premium subscription.',
      subscriptionError.message
    );
  }

  if (!hasActive) {
    throw new PremiumAuthError(403, 'premium_required', 'Premium subscription required.');
  }

  return {
    requestId,
    userId: user.id,
    email: user.email ?? null,
  };
};
