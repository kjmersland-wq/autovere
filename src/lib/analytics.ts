type PremiumAnalyticsEvent =
  | 'pricing_view'
  | 'checkout_started'
  | 'checkout_completed'
  | 'premium_activated'
  | 'subscription_cancelled';

export const trackAnalyticsEvent = (
  name: PremiumAnalyticsEvent,
  payload?: Record<string, unknown>
) => {
  const body = { name, payload: payload ?? {}, at: new Date().toISOString() };
  console.info('[analytics]', body);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('autovere:analytics', { detail: body }));
  }
};
