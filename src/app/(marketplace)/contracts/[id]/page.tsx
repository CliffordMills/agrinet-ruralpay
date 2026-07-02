import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import ContractViewer from "@/components/marketplace/ContractViewer";

export default async function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const supabase = await createClient();

  const { data: contract } = await supabase.from("contracts").select(`id, contract_number, quantity_tonnes, price_per_kg, total_value, currency, delivery_date, status, created_at, buyers(company_name), marketplace_listings(commodities(name), commodity_grades(name, code), storage_hubs(name))`).eq("id", id).single();
  if (!contract) notFound();

  const buyer = contract.buyers as { company_name: string } | null;
  const listing = contract.marketplace_listings as { commodities: { name: string } | null; commodity_grades: { name: string; code: string } | null; storage_hubs: { name: string } | null } | null;

  return (
    <div className="space-y-6">
      <Link href="/marketplace/contracts" className="text-muted-foreground hover:text-foreground text-sm">← Contracts</Link>
      <ContractViewer contract={{ id: contract.id, contract_number: contract.contract_number || `CNT-${contract.id.slice(0, 8)}`, commodity: listing?.commodities?.name || "Unknown", grade: listing?.commodity_grades ? `${listing.commodity_grades.name} (${listing.commodity_grades.code})` : "Ungraded", quantity_tonnes: contract.quantity_tonnes, price_per_kg: contract.price_per_kg, total_value: contract.total_value, currency: contract.currency, delivery_date: contract.delivery_date, status: contract.status, buyer_name: buyer?.company_name || "Buyer", hub_name: listing?.storage_hubs?.name || "—", created_at: contract.created_at }} />
    </div>
  );
}
