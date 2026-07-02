"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";
import type { AuthUser } from "@/types";

export function useAuth() {
  const { user, isLoading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user: sbUser } }) => {
      if (sbUser) {
        setUser({
          id: sbUser.id,
          email: sbUser.email ?? "",
          role: sbUser.user_metadata?.role ?? "FARMER",
          permissions: sbUser.user_metadata?.permissions ?? [],
          organization_id: sbUser.user_metadata?.organization_id,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const sbUser = session.user;
        setUser({
          id: sbUser.id,
          email: sbUser.email ?? "",
          role: sbUser.user_metadata?.role ?? "FARMER",
          permissions: sbUser.user_metadata?.permissions ?? [],
          organization_id: sbUser.user_metadata?.organization_id,
        } satisfies AuthUser);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading]);

  return { user, isLoading };
}
