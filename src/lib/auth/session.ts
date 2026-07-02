import { createClient } from "@/lib/supabase/server";
import type { AuthUser } from "@/types";

export async function getSession(): Promise<AuthUser | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return {
    id: user.id,
    email: user.email ?? "",
    role: user.user_metadata?.role ?? "FARMER",
    permissions: user.user_metadata?.permissions ?? [],
    organization_id: user.user_metadata?.organization_id,
  };
}

export async function requireSession(): Promise<AuthUser> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}
