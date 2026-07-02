"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface AgentProfile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  agent_code: string;
  email?: string;
}

export default function AgentProfilePage() {
  const [profile, setProfile] = useState<AgentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("agents").select("id, first_name, last_name, phone, agent_code").eq("user_id", user.id).single();
      if (data) setProfile({ ...data, email: user.email });
      setLoading(false);
    }
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setSuccess(false);
    const form = e.currentTarget;
    const supabase = createClient();
    await supabase.from("agents").update({
      first_name: (form.elements.namedItem("first_name") as HTMLInputElement).value,
      last_name: (form.elements.namedItem("last_name") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
    }).eq("id", profile.id);
    setSuccess(true);
    setSaving(false);
  }

  if (loading) return <div className="text-muted-foreground text-sm">Loading...</div>;
  if (!profile) return <div className="text-muted-foreground">Profile not found.</div>;

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-2xl font-bold">My Profile</h1>
      {success && <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">Profile updated successfully</div>}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl">👤</div>
          <div>
            <div className="font-semibold text-lg">{profile.first_name} {profile.last_name}</div>
            <div className="text-sm text-muted-foreground font-mono">{profile.agent_code}</div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">First Name</label>
              <input name="first_name" defaultValue={profile.first_name} required className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Last Name</label>
              <input name="last_name" defaultValue={profile.last_name} required className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Phone</label>
            <input name="phone" defaultValue={profile.phone} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input value={profile.email || ""} disabled className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-sm text-muted-foreground" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Agent Code</label>
            <input value={profile.agent_code} disabled className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-sm font-mono text-muted-foreground" />
          </div>
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
