"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Farmer {
  id: string;
  first_name: string;
  last_name: string;
  digital_id: string;
}

interface Commodity {
  id: string;
  name: string;
  unit: string;
}

interface StorageHub {
  id: string;
  name: string;
  code: string;
}

interface ProcurementFormProps {
  farmers: Farmer[];
  commodities: Commodity[];
  hubs: StorageHub[];
}

export default function ProcurementForm({ farmers, commodities, hubs }: ProcurementFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");

  const totalValue = parseFloat(quantity || "0") * parseFloat(unitPrice || "0");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const data = {
      farmer_id: (form.elements.namedItem("farmer_id") as HTMLSelectElement).value,
      commodity_id: (form.elements.namedItem("commodity_id") as HTMLSelectElement).value,
      hub_id: (form.elements.namedItem("hub_id") as HTMLSelectElement).value,
      quantity_kg: parseFloat(quantity),
      unit_price_ghs: parseFloat(unitPrice),
      grade_code: (form.elements.namedItem("grade_code") as HTMLInputElement).value,
      notes: (form.elements.namedItem("notes") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/agent/procurement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create batch");
      }

      const result = await res.json();
      router.push(`/agent/procurement/${result.batch_id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create batch");
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
          <label className="block text-sm font-medium mb-1.5">Farmer *</label>
          <select name="farmer_id" required className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm">
            <option value="">Select farmer</option>
            {farmers.map((f) => (
              <option key={f.id} value={f.id}>{f.first_name} {f.last_name} — {f.digital_id}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Commodity *</label>
          <select name="commodity_id" required className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm">
            <option value="">Select commodity</option>
            {commodities.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.unit})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Storage Hub *</label>
          <select name="hub_id" required className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm">
            <option value="">Select hub</option>
            {hubs.map((h) => (
              <option key={h.id} value={h.id}>{h.name} ({h.code})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Grade Code</label>
          <input name="grade_code" className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm" placeholder="A, B, C, W240..." />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Quantity (kg) *</label>
          <input type="number" step="0.1" min="0.1" required value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm" placeholder="500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Unit Price (GHS/kg) *</label>
          <input type="number" step="0.01" min="0.01" required value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm" placeholder="0.85" />
        </div>
        {totalValue > 0 && (
          <div className="md:col-span-2 bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Total Value</div>
            <div className="text-2xl font-bold text-primary mt-1">GHS {totalValue.toLocaleString("en-GH", { minimumFractionDigits: 2 })}</div>
          </div>
        )}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1.5">Notes</label>
          <textarea name="notes" rows={3} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm resize-none" placeholder="Any additional notes about condition, moisture content, etc." />
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50">
          {loading ? "Recording..." : "Record Batch & Generate GRN"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted">
          Cancel
        </button>
      </div>
    </form>
  );
}
