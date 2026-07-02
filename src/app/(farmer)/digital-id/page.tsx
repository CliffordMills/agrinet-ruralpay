import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth/session";
import { DigitalIDCard } from "@/components/farmer/DigitalIDCard";
import { generateFarmerQR } from "@/lib/qr/generateFarmerQR";

export const metadata: Metadata = { title: "Digital ID" };

export default async function DigitalIDPage() {
  const session = await getSession();
  const supabase = await createClient();

  const { data: farmer } = await supabase
    .from("farmers")
    .select("*, villages(name)")
    .eq("user_id", session?.id ?? "")
    .single();

  const qrUrl = farmer
    ? await generateFarmerQR(farmer.digital_id, farmer.id)
    : undefined;

  if (!farmer) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Farmer profile not found.</p>
      </div>
    );
  }

  const farmerWithVillage = {
    ...farmer,
    village_name: (farmer.villages as { name: string } | null)?.name,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Digital ID</h1>
        <p className="text-muted-foreground">Your AGRINET RURALPAY identity card</p>
      </div>
      <div className="flex flex-col items-center gap-8">
        <DigitalIDCard farmer={farmerWithVillage} qrDataUrl={qrUrl} />
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Share your QR code with field agents and buyers for instant verification.
          </p>
          <button
            className="rounded-lg bg-primary text-white px-6 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors"
            onClick={() => window.print()}
          >
            Print ID Card
          </button>
        </div>
      </div>
    </div>
  );
}
