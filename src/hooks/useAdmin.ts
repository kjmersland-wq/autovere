import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

/** True when the signed-in account holds the admin role (owner access). */
export function useAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    void supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        setIsAdmin(!!data);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  return { isAdmin, loading };
}
