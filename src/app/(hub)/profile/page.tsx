import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function HubProfilePage() {
  const session = await requireSession();
  if (!session) redirect("/login");

  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("full_name, role, created_at").eq("id", session.user.id).single();

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-2xl font-bold">My Profile</h1>
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl">🏪</div>
          <div>
            <div className="font-semibold text-lg">{profile?.full_name || session.user.email}</div>
            <div className="text-sm text-muted-foreground">Hub Manager</div>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{session.user.email}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Role</span><span className="font-medium">{profile?.role || "HUB_MANAGER"}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Member since</span><span>{new Date(profile?.created_at || session.user.created_at).toLocaleDateString("en-GH")}</span></div>
        </div>
      </div>
    </div>
  );
}
