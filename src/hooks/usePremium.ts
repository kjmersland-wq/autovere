import { useMemo } from 'react';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';

export const usePremium = () => {
  const { isPremium, loading, userId, subscriptionStatus } = useSubscriptionStatus();

  return useMemo(
    () => ({
      isPremium,
      loading,
      userId,
      subscriptionStatus,
    }),
    [isPremium, loading, userId, subscriptionStatus]
  );
};
