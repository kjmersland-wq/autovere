import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useStripeCheckout() {
  const [loading, setLoading] = useState(false);

  const openCheckout = async (options: {
    interval: 'month' | 'year';
    locale: string;
    returnPath: string;
  }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
        body: {
          interval: options.interval,
          locale: options.locale,
          returnPath: options.returnPath,
        },
      });

      if (error || !data?.url) throw new Error('checkout_failed');
      window.location.assign(data.url as string);
    } catch (error) {
      console.error('Stripe checkout launch failed', error);
      toast.error('Could not open checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { openCheckout, loading };
}
