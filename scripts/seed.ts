import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seed() {
  console.log("🌱 Seeding AGRINET RURALPAY database...");

  // Regions
  const { data: regions } = await supabase
    .from("regions")
    .upsert([
      { name: "Greater Accra" },
      { name: "Ashanti" },
      { name: "Northern" },
      { name: "Volta" },
      { name: "Eastern" },
    ], { onConflict: "name" })
    .select();
  console.log(`  ✅ ${regions?.length} regions`);

  const regionMap = Object.fromEntries((regions ?? []).map((r) => [r.name, r.id]));

  // Districts
  const { data: districts } = await supabase
    .from("districts")
    .upsert([
      { name: "Accra Metro", region_id: regionMap["Greater Accra"] },
      { name: "Kumasi Metro", region_id: regionMap["Ashanti"] },
      { name: "Tamale Metro", region_id: regionMap["Northern"] },
      { name: "Ho Municipal", region_id: regionMap["Volta"] },
      { name: "Koforidua", region_id: regionMap["Eastern"] },
    ], { onConflict: "name" })
    .select();
  console.log(`  ✅ ${districts?.length} districts`);

  const distMap = Object.fromEntries((districts ?? []).map((d) => [d.name, d.id]));

  // Commodities
  const { data: commodities } = await supabase
    .from("commodities")
    .upsert([
      { name: "Maize", code: "MZE", unit: "kg" },
      { name: "Cocoa", code: "CCO", unit: "kg" },
      { name: "Cassava", code: "CSV", unit: "kg" },
      { name: "Soybean", code: "SOY", unit: "kg" },
      { name: "Groundnut", code: "GND", unit: "kg" },
    ], { onConflict: "code" })
    .select();
  console.log(`  ✅ ${commodities?.length} commodities`);

  const commMap = Object.fromEntries((commodities ?? []).map((c) => [c.code, c.id]));

  // Commodity grades
  const grades = [];
  for (const [code, id] of Object.entries(commMap)) {
    grades.push(
      { commodity_id: id, name: "Grade A", code: `${code}-A`, price_premium_pct: 10 },
      { commodity_id: id, name: "Grade B", code: `${code}-B`, price_premium_pct: 0 },
      { commodity_id: id, name: "Grade C", code: `${code}-C`, price_premium_pct: -10 }
    );
  }
  const { data: gradeData } = await supabase
    .from("commodity_grades")
    .upsert(grades, { onConflict: "code" })
    .select();
  console.log(`  ✅ ${gradeData?.length} commodity grades`);

  // Storage hubs
  const { data: hubs } = await supabase
    .from("storage_hubs")
    .upsert([
      {
        name: "Accra Central Hub",
        code: "ACH-001",
        region_id: regionMap["Greater Accra"],
        district_id: distMap["Accra Metro"],
        capacity_tonnes: 5000,
        current_stock_tonnes: 1200,
        latitude: 5.6037,
        longitude: -0.187,
      },
      {
        name: "Kumasi North Hub",
        code: "KNH-002",
        region_id: regionMap["Ashanti"],
        district_id: distMap["Kumasi Metro"],
        capacity_tonnes: 8000,
        current_stock_tonnes: 3400,
        latitude: 6.6885,
        longitude: -1.6244,
      },
      {
        name: "Tamale Grain Store",
        code: "TGS-003",
        region_id: regionMap["Northern"],
        district_id: distMap["Tamale Metro"],
        capacity_tonnes: 10000,
        current_stock_tonnes: 2800,
        latitude: 9.4075,
        longitude: -0.8533,
      },
    ], { onConflict: "code" })
    .select();
  console.log(`  ✅ ${hubs?.length} storage hubs`);

  // Marketplace listings
  const hubMap = Object.fromEntries((hubs ?? []).map((h) => [h.code, h.id]));
  const maizeAId = gradeData?.find((g) => g.code === "MZE-A")?.id;

  if (hubMap["ACH-001"] && commMap["MZE"] && maizeAId) {
    await supabase.from("marketplace_listings").upsert([
      {
        hub_id: hubMap["ACH-001"],
        commodity_id: commMap["MZE"],
        commodity_grade_id: maizeAId,
        quantity_tonnes: 500,
        price_per_kg: 2.5,
        currency: "GHS",
        is_active: true,
        description: "Premium Grade A maize from Accra hub. Ready for immediate delivery.",
      },
    ], { onConflict: "id" });
    console.log("  ✅ 1 marketplace listing");
  }

  console.log("\n🎉 Seed complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
