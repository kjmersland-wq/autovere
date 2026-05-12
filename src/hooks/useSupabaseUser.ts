import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface AutovereUser {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: string;
  plan: "free" | "premium";
}

interface UseSupabaseUserReturn {
  user: AutovereUser | null;
  rawUser: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
}

function toAutovereUser(u: User): AutovereUser {
  return {
    id: u.id,
    email: u.email ?? "",
    displayName: u.user_metadata?.display_name ?? u.user_metadata?.name ?? undefined,
    avatarUrl: u.user_metadata?.avatar_url ?? undefined,
    createdAt: u.created_at,
    plan: "free", // subscription status comes from useSubscription
  };
}

export function useSupabaseUser(): UseSupabaseUserReturn {
  const [rawUser, setRawUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Resolve current session immediately
    supabase.auth.getSession().then(({ data }) => {
      setRawUser(data.session?.user ?? null);
      setIsLoading(false);
    });

    // Keep state in sync with auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setRawUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/pricing` },
    });
    return { error: error?.message ?? null };
  };

  return {
    user: rawUser ? toAutovereUser(rawUser) : null,
    rawUser,
    isLoading,
    isAuthenticated: rawUser !== null,
    signIn,
    signOut,
    signUp,
  };
}

/**
 * Sync localStorage data to Supabase tables after sign-in.
 * Called once per sign-in event — idempotent via upsert.
 */
export async function syncLocalToCloud(userId: string): Promise<void> {
  try {
    const garageRaw = localStorage.getItem("autovere_garage_v1");
    const prefsRaw = localStorage.getItem("autovere_user_preferences_v1");
    const savedRaw = localStorage.getItem("autovere_saved_content_v1");

    if (garageRaw) {
      await supabase.from("user_garage" as never).upsert({ user_id: userId, data: garageRaw });
    }
    if (prefsRaw) {
      await supabase.from("user_preferences" as never).upsert({ user_id: userId, data: prefsRaw });
    }
    if (savedRaw) {
      await supabase.from("user_saved_content" as never).upsert({ user_id: userId, data: savedRaw });
    }
  } catch {
    // Tables may not exist yet — fail silently until backend tables are created
  }
}
