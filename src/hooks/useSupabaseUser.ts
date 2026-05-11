/**
 * Supabase Auth Preparation Hook
 *
 * Returns a stub user that is always null until Supabase auth is wired in.
 * When activating:
 *   1. Install @supabase/supabase-js and @supabase/auth-ui-react
 *   2. Replace the stub with real supabase.auth.getUser() calls
 *   3. Swap localStorage persistence in useGarage + useSavedContent with
 *      Supabase table upserts — hook API stays identical, no consumer changes.
 *
 * This file intentionally keeps the interface minimal so callers don't
 * depend on Supabase-specific types that might change at activation.
 */

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
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
}

// ---------------------------------------------------------------------------
// STUB — replace body with real Supabase calls at auth activation time
// ---------------------------------------------------------------------------
export function useSupabaseUser(): UseSupabaseUserReturn {
  return {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    signIn: async () => ({ error: "Auth not yet activated" }),
    signOut: async () => {},
    signUp: async () => ({ error: "Auth not yet activated" }),
  };
}

/**
 * Sync hook: call this after a successful Supabase auth to merge
 * localStorage data (useGarage, useSavedContent) into the user's cloud row.
 * No-op until auth is activated.
 */
export async function syncLocalToCloud(_userId: string): Promise<void> {
  // TODO: read localStorage keys, upsert to supabase tables
  // autovere_garage_v1 → user_garage table
  // autovere_saved_content_v1 → user_saved_content table
  // autovere_user_preferences_v1 → user_preferences table
}
