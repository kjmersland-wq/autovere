import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getSubscriptionStatus, hasActiveSubscription } from '@/lib/subscription';

export type Subscription = {
  id: string;
  subscription_status: string | null;
  plan_type: string | null;
  billing_interval: 'month' | 'year' | null;
  current_period_end: string | null;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
};

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchSub = async (uid: string) => {
    const { data } = await supabase
      .from('subscriptions')
      .select(
        'id,subscription_status,plan_type,billing_interval,current_period_end,stripe_subscription_id,stripe_customer_id'
      )
      .eq('user_id', uid)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    setSubscription((data as Subscription) ?? null);
    setLoading(false);
  };

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    supabase.auth.getUser().then(({ data }) => {
      const uid = data.user?.id ?? null;
      setUserId(uid);

      if (!uid) {
        setLoading(false);
        return;
      }

      fetchSub(uid);

      channel = supabase
        .channel(`subs-${uid}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'subscriptions', filter: `user_id=eq.${uid}` },
          () => fetchSub(uid)
        )
        .subscribe();
    });

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const subscriptionStatus = getSubscriptionStatus(subscription);
  const isActive = hasActiveSubscription(subscription);

  return {
    subscription,
    subscriptionStatus,
    isActive,
    loading,
    userId,
    refetch: () => userId && fetchSub(userId),
  };
}
