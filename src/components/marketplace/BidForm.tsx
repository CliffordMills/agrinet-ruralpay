"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BidFormProps {
  listingId: string;
  commodity: string;
  quantityTonnes: number;
  askingPricePerKg: number;
  currency: string;
}

export default function BidForm({ listingId, commodity, quantityTonnes, askingPricePerKg, currency }: BidFormProps) {
  const router = useRouter();
  const [bidPrice, setBidPrice] = useState(askingPricePerKg.toString());
  const [bidQty, setBidQty] = useState(quantityTonnes.toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const totalBid = parseFloat(bidQty || "0") * 1000 * parseFloat(bidPrice || "0");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/marketplace/bids", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ listing_id: listingId, price_per_kg: parseFloat(bidPrice), quantity_tonnes: parseFloat(bidQty), currency }) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Failed to submit bid"); }
      setSuccess(true);
      setTimeout(() => router.refresh(), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit bid");
    } finally { setLoading(false); }
  }

  if (success) return (<div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"><div className="text-3xl mb-2">✅</div><div className="font-semibold text-green-800">Bid Submitted</div><div className="text-sm text-green-600 mt-1">Your bid of {currency} {parseFloat(bidPrice).toFixed(2)}/kg has been submitted.</div></div>);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">{error}</div>}
      <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-1">
        <div className="flex justify-between"><span className="text-muted-foreground">Commodity</span><span className="font-medium">{commodity}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Available</span><span>{quantityTonnes.toLocaleString()} tonnes</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Asking Price</span><span>{currency} {askingPricePerKg.toFixed(2)}/kg</span></div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Your Bid Price ({currency}/kg) *</label>
        <input type="number" step="0.01" min="0.01" required value={bidPrice} onChange={(e) => setBidPrice(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm" />
        {parseFloat(bidPrice) < askingPricePerKg && <div className="text-xs text-amber-600 mt-1">Your bid is below the asking price</div>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Quantity (tonnes) *</label>
        <input type="number" step="0.1" min="0.1" max={quantityTonnes} required value={bidQty} onChange={(e) => setBidQty(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm" />
      </div>
      {totalBid > 0 && <div className="bg-primary/5 border border-primary/20 rounded-lg p-3"><div className="text-xs text-muted-foreground">Total Bid Value</div><div className="text-xl font-bold text-primary mt-0.5">{currency} {totalBid.toLocaleString("en-GH", { minimumFractionDigits: 2 })}</div></div>}
      <button type="submit" disabled={loading} className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50">{loading ? "Submitting..." : "Submit Bid"}</button>
    </form>
  );
}
