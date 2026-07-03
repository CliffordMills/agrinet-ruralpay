"use client";

import { batchTraceUrl, batchQRCodeUrl } from "@/lib/qr/qrGenerator";

interface Props {
  batchId: string;
  grnNumber: string;
  commodity: string;
  grade: string;
  quantityKg: number;
  farmerName: string;
  hubName: string;
  dateReceived: string;
  currency?: string;
}

export default function BatchQRCard({
  batchId,
  grnNumber,
  commodity,
  grade,
  quantityKg,
  farmerName,
  hubName,
  dateReceived,
  currency = "GHS",
}: Props) {
  const traceUrl = batchTraceUrl(batchId);
  const qrSrc = batchQRCodeUrl(batchId, 180);

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <div className="flex items-start gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrSrc}
          alt={`QR code for batch ${grnNumber}`}
          width={180}
          height={180}
          className="rounded-lg border border-border flex-shrink-0"
        />
        <div className="flex-1 space-y-2 text-sm">
          <div>
            <div className="text-xs text-muted-foreground">GRN Number</div>
            <div className="font-mono font-semibold">{grnNumber}</div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <div className="text-xs text-muted-foreground">Commodity</div>
              <div className="font-medium">{commodity}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Grade</div>
              <div className="font-medium">{grade}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Quantity</div>
              <div className="font-medium">{quantityKg.toLocaleString()} kg</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Farmer</div>
              <div className="font-medium">{farmerName}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Hub</div>
              <div className="font-medium">{hubName}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Date</div>
              <div className="font-medium">
                {new Date(dateReceived).toLocaleDateString("en-GH")}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <div className="text-xs text-muted-foreground mb-1">Scan to verify provenance</div>
        <div className="font-mono text-xs text-primary break-all">{traceUrl}</div>
      </div>

      <button
        onClick={() => window.print()}
        className="w-full border border-border rounded-lg py-2 text-sm font-medium hover:bg-muted/50 transition-colors print:hidden"
      >
        Print QR Card
      </button>
    </div>
  );
}
