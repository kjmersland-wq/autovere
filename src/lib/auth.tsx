import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  authOpen: boolean;
  openAuth: (mode?: "signin" | "signup") => void;
  closeAuth: () => void;
  authMode: "signin" | "signup";
  setAuthMode: (mode: "signin" | "signup") => void;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
      if (next) setAuthOpen(false);
    });
    supabase.auth.getSession().then(({ data: { session: current } }) => {
      setSession(current);
      setLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const openAuth = useCallback((mode: "signin" | "signup" = "signin") => {
    setAuthMode(mode);
    setAuthOpen(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      authOpen,
      authMode,
      setAuthMode,
      openAuth,
      closeAuth: () => setAuthOpen(false),
      async signInWithEmail(email, password) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error?.message ?? null };
      },
      async signUpWithEmail(email, password) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/garage` },
        });
        return { error: error?.message ?? null };
      },
      async signInWithGoogle() {
        const result = await lovable.auth.signInWithOAuth("google", {
          redirect_uri: window.location.origin,
        });
        if (result.error) return { error: result.error.message ?? "Google sign-in failed." };
        return { error: null };
      },
      async signOut() {
        await supabase.auth.signOut();
      },
    }),
    [session, loading, authOpen, authMode, openAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
