import Link from "next/link";

interface CommodityListingCardProps {
  id: string;
  commodity: string;
  grade: string;
  quantityTonnes: number;
  pricePerKg: number;
  currency: string;
  hubName: string;
  hubRegion: string;
  expiresAt: string | null;
  isActive: boolean;
}

export default function CommodityListingCard({ id, commodity, grade, quantityTonnes, pricePerKg, currency, hubName, hubRegion, expiresAt, isActive }: CommodityListingCardProps) {
  const totalValue = quantityTonnes * 1000 * pricePerKg;
  const daysLeft = expiresAt ? Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div className="bg-card border border-border rounded-lg p-5 hover:border-primary/40 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-semibold text-lg">{commodity}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{hubName} · {hubRegion}</div>
        </div>
        <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded">{grade}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div><div className="text-xs text-muted-foreground">Quantity</div><div className="font-medium">{quantityTonnes.toLocaleString()} tonnes</div></div>
        <div><div className="text-xs text-muted-foreground">Unit Price</div><div className="font-medium text-primary">{currency} {pricePerKg.toFixed(2)}/kg</div></div>
        <div className="col-span-2"><div className="text-xs text-muted-foreground">Total Value</div><div className="font-bold text-lg">{currency} {totalValue.toLocaleString("en-GH", { minimumFractionDigits: 2 })}</div></div>
      </div>
      {daysLeft !== null && <div className={`text-xs mb-3 ${daysLeft <= 3 ? "text-red-500" : "text-muted-foreground"}`}>{daysLeft > 0 ? `Expires in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}` : "Expired"}</div>}
      <Link href={`/marketplace/listings/${id}`} className="block w-full text-center py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">View & Bid</Link>
    </div>
  );
}
