export const ACTIVE_SUBSCRIPTION_STATUSES = ['active', 'trialing', 'past_due'] as const;

export type ActiveSubscriptionStatus = (typeof ACTIVE_SUBSCRIPTION_STATUSES)[number];

export type SubscriptionLike = {
  subscription_status?: string | null;
  current_period_end?: string | null;
};

export const getSubscriptionStatus = (subscription: SubscriptionLike | null | undefined) =>
  subscription?.subscription_status ?? null;

export const hasActiveSubscription = (subscription: SubscriptionLike | null | undefined) => {
  if (!subscription) return false;
  const status = getSubscriptionStatus(subscription);
  const periodEnd = subscription.current_period_end ? new Date(subscription.current_period_end) : null;
  const now = new Date();

  if (!status) return false;
  if (ACTIVE_SUBSCRIPTION_STATUSES.includes(status as ActiveSubscriptionStatus)) {
    return !periodEnd || periodEnd > now;
  }
  if (status === 'canceled') {
    return !!periodEnd && periodEnd > now;
  }
  return false;
};

export const isPremiumUser = hasActiveSubscription;
