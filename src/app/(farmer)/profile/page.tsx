"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function FarmerProfilePage() {
  const [farmer, setFarmer] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase
        .from("farmers")
        .select("first_name, last_name, phone, gender, date_of_birth, digital_id, credit_score")
        .eq("user_id", user.id)
        .single();
      setFarmer(data);
    });
  }, []);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/farmer/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(farmer),
    });
    setSaving(false);
  }

  if (!farmer) return <div className="py-16 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="max-w-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Digital ID: {farmer.digital_id as string}</p>
      </div>
      <form onSubmit={handleSave} className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First name</label>
            <input
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={(farmer.first_name as string) ?? ""}
              onChange={(e) => setFarmer({ ...farmer, first_name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last name</label>
            <input
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={(farmer.last_name as string) ?? ""}
              onChange={(e) => setFarmer({ ...farmer, last_name: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={(farmer.phone as string) ?? ""}
            onChange={(e) => setFarmer({ ...farmer, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={(farmer.gender as string) ?? ""}
            onChange={(e) => setFarmer({ ...farmer, gender: e.target.value })}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-primary text-white py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
