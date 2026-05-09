import { useSubscription } from '@/hooks/useSubscription';

export const useSubscriptionStatus = () => {
  const { subscription, subscriptionStatus, isActive, loading, userId, refetch } = useSubscription();

  return {
    subscription,
    subscriptionStatus,
    isActive,
    isPremium: isActive,
    loading,
    userId,
    refetch,
  };
};
