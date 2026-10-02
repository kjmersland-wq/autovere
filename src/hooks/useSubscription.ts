import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { getStripeEnvironment, tierForPriceId, TIER_RANK, type PlanTier } from "@/lib/stripe";

export type SubscriptionRow = {
  price_id: string;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean | null;
};

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionRow | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }
    let environment: "sandbox" | "live";
    try {
      environment = getStripeEnvironment();
    } catch {
      setSubscription(null);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("subscriptions")
      .select("price_id, status, current_period_end, cancel_at_period_end")
      .eq("user_id", user.id)
      .eq("environment", environment)
      .order("created_at", { ascending: false })
      .limit(10);
    // A bought pass must never hide a running Pro plan: use the highest active tier, newest first.
    const rows = (data as SubscriptionRow[] | null) ?? [];
    const live = (r: SubscriptionRow) => !r.current_period_end || new Date(r.current_period_end).getTime() > Date.now();
    const best = rows.filter(live).sort((a, b) => TIER_RANK[tierForPriceId(b.price_id)] - TIER_RANK[tierForPriceId(a.price_id)])[0];
    setSubscription(best ?? rows[0] ?? null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`subscriptions-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "subscriptions", filter: `user_id=eq.${user.id}` },
        () => {
          void refresh();
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [user, refresh]);

  const periodEnd = subscription?.current_period_end ? new Date(subscription.current_period_end) : null;
  const stillInPeriod = !periodEnd || periodEnd.getTime() > Date.now();
  const isActive =
    !!subscription &&
    stillInPeriod &&
    ["active", "trialing", "past_due", "canceled"].includes(subscription.status) &&
    (subscription.status !== "canceled" || !!periodEnd);

  const tier: PlanTier = isActive ? tierForPriceId(subscription?.price_id) : "free";

  return {
    subscription,
    loading,
    isActive,
    tier,
    pastDue: subscription?.status === "past_due",
    cancelAtPeriodEnd: !!subscription?.cancel_at_period_end,
    periodEnd,
    refresh,
    hasAtLeast: (required: PlanTier) => TIER_RANK[tier] >= TIER_RANK[required],
  };
}
