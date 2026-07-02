import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

export default async function FarmerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const supabase = await createClient();

  const { data: farmer } = await supabase.from("farmers").select(`id, first_name, last_name, phone, digital_id, gender, date_of_birth, national_id, farm_size_ha, primary_crop, credit_score, created_at, villages(name, districts(name, regions(name))), wallets(balance, currency)`).eq("id", id).single();
  if (!farmer) notFound();

  const { data: batches } = await supabase.from("commodity_batches").select("id, grn_number, quantity_kg, total_value, status, created_at, commodities(name)").eq("farmer_id", id).order("created_at", { ascending: false }).limit(10);

  const village = farmer.villages as { name: string; districts: { name: string; regions: { name: string } | null } | null } | null;
  const wallet = farmer.wallets as { balance: number; currency: string } | null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/agent/farmers" className="text-muted-foreground hover:text-foreground text-sm">← Farmers</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold">{farmer.first_name} {farmer.last_name}</h1>
                <div className="font-mono text-sm text-primary mt-1">{farmer.digital_id}</div>
              </div>
              <Link href={`/agent/procurement/new?farmer=${id}`} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium">+ Record Batch</Link>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Phone:</span> {farmer.phone}</div>
              <div><span className="text-muted-foreground">Gender:</span> {farmer.gender || "—"}</div>
              <div><span className="text-muted-foreground">Village:</span> {village?.name || "—"}</div>
              <div><span className="text-muted-foreground">District:</span> {village?.districts?.name || "—"}</div>
              <div><span className="text-muted-foreground">Farm Size:</span> {farmer.farm_size_ha ? `${farmer.farm_size_ha} ha` : "—"}</div>
              <div><span className="text-muted-foreground">Primary Crop:</span> {farmer.primary_crop || "—"}</div>
              <div><span className="text-muted-foreground">National ID:</span> {farmer.national_id || "—"}</div>
              <div><span className="text-muted-foreground">Joined:</span> {new Date(farmer.created_at).toLocaleDateString("en-GH")}</div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg">
            <div className="p-4 border-b border-border"><h2 className="font-semibold">Batch History</h2></div>
            <div className="divide-y divide-border">
              {!batches || batches.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">No batches recorded yet</div>
              ) : (
                batches.map((batch) => {
                  const commodity = batch.commodities as { name: string } | null;
                  return (
                    <Link key={batch.id} href={`/agent/procurement/${batch.id}`} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                      <div>
                        <div className="text-sm font-medium">{commodity?.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{batch.grn_number}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">{batch.quantity_kg.toLocaleString()} kg</div>
                        <div className="text-xs text-muted-foreground">GHS {batch.total_value.toLocaleString("en-GH", { minimumFractionDigits: 2 })}</div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-primary text-primary-foreground rounded-lg p-5">
            <div className="text-sm opacity-80">Wallet Balance</div>
            <div className="text-3xl font-bold mt-1">{wallet?.currency || "GHS"} {(wallet?.balance || 0).toLocaleString("en-GH", { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="text-sm text-muted-foreground mb-1">Credit Score</div>
            <div className={`text-4xl font-bold ${farmer.credit_score >= 700 ? "text-green-600" : farmer.credit_score >= 400 ? "text-amber-600" : "text-red-600"}`}>{farmer.credit_score}</div>
            <div className="text-xs text-muted-foreground mt-1">out of 1000</div>
          </div>
        </div>
      </div>
    </div>
  );
}
