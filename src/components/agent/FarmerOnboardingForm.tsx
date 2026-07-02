"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Village {
  id: string;
  name: string;
}

interface FarmerOnboardingFormProps {
  villages: Village[];
}

export default function FarmerOnboardingForm({
  villages,
}: FarmerOnboardingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const data = {
      first_name: (form.elements.namedItem("first_name") as HTMLInputElement).value,
      last_name: (form.elements.namedItem("last_name") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      gender: (form.elements.namedItem("gender") as HTMLSelectElement).value,
      date_of_birth: (form.elements.namedItem("date_of_birth") as HTMLInputElement).value,
      village_id: (form.elements.namedItem("village_id") as HTMLSelectElement).value,
      national_id: (form.elements.namedItem("national_id") as HTMLInputElement).value,
      farm_size_ha: parseFloat((form.elements.namedItem("farm_size_ha") as HTMLInputElement).value),
      primary_crop: (form.elements.namedItem("primary_crop") as HTMLInputElement).value,
    };

    try {
      const res = await fetch("/api/agent/farmers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to register farmer");
      }

      const result = await res.json();
      router.push(`/agent/farmers/${result.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to register farmer");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">First Name *</label>
          <input name="first_name" required className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm" placeholder="Kwame" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Last Name *</label>
          <input name="last_name" required className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm" placeholder="Asante" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Phone *</label>
          <input name="phone" required pattern="^(\+233|0)[0-9]{9}$" className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm" placeholder="+233244123456" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Gender *</label>
          <select name="gender" required className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm">
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Date of Birth</label>
          <input name="date_of_birth" type="date" className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Village *</label>
          <select name="village_id" required className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm">
            <option value="">Select village</option>
            {villages.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">National ID</label>
          <input name="national_id" className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm" placeholder="GHA-123456789-0" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Farm Size (hectares)</label>
          <input name="farm_size_ha" type="number" step="0.1" min="0.1" className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm" placeholder="2.5" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1.5">Primary Crop</label>
          <input name="primary_crop" className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm" placeholder="Maize" />
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50">
          {loading ? "Registering..." : "Register Farmer"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted">
          Cancel
        </button>
      </div>
    </form>
  );
}
