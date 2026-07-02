"use client";

import { useState } from "react";

const PROVIDERS = [
  { id: "mtn_momo", name: "MTN Mobile Money", prefix: ["024", "054", "055", "059"] },
  { id: "telecel_cash", name: "Telecel Cash", prefix: ["020", "050"] },
  { id: "airteltigo_money", name: "AirtelTigo Money", prefix: ["027", "057", "026", "056"] },
  { id: "bank_transfer", name: "Bank Transfer", prefix: [] },
];

interface PaymentInitiationFormProps {
  batchId: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  amount: number;
  onSuccess?: () => void;
}

export default function PaymentInitiationForm({ batchId, farmerId, farmerName, farmerPhone, amount, onSuccess }: PaymentInitiationFormProps) {
  const [provider, setProvider] = useState("");
  const [phone, setPhone] = useState(farmerPhone || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function detectProvider(phoneNum: string) {
    const prefix = phoneNum.replace("+233", "0").substring(0, 3);
    return PROVIDERS.find((p) => p.prefix.includes(prefix))?.id || "";
  }

  function handlePhoneChange(val: string) {
    setPhone(val);
    const detected = detectProvider(val);
    if (detected) setProvider(detected);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!provider) { setError("Please select a payment provider"); return; }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/agent/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batch_id: batchId, farmer_id: farmerId, amount, provider, phone, currency: "GHS" }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Payment initiation failed"); }
      setSuccess(true);
      onSuccess?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-3xl mb-2">✅</div>
        <div className="font-semibold text-green-800">Payment Initiated</div>
        <div className="text-sm text-green-600 mt-1">GHS {amount.toFixed(2)} → {farmerName}</div>
        <div className="text-xs text-green-500 mt-1">Farmer will receive a Mobile Money prompt shortly.</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">{error}</div>}

      <div className="bg-muted/50 rounded-lg p-4 space-y-1 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">Recipient</span><span className="font-medium">{farmerName}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-bold text-primary text-base">GHS {amount.toLocaleString("en-GH", { minimumFractionDigits: 2 })}</span></div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Payment Phone Number</label>
        <input type="tel" value={phone} onChange={(e) => handlePhoneChange(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm" placeholder="+233244123456" required />
        {provider && <div className="text-xs text-green-600 mt-1">✓ Auto-detected: {PROVIDERS.find((p) => p.id === provider)?.name}</div>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Payment Provider *</label>
        <div className="grid grid-cols-2 gap-2">
          {PROVIDERS.map((p) => (
            <button key={p.id} type="button" onClick={() => setProvider(p.id)}
              className={`px-3 py-2.5 border rounded-lg text-sm text-left transition-colors ${provider === p.id ? "border-primary bg-primary/5 font-medium" : "border-border hover:border-primary/50"}`}>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading || !provider} className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50">
        {loading ? "Initiating Payment..." : `Pay GHS ${amount.toFixed(2)}`}
      </button>
    </form>
  );
}
