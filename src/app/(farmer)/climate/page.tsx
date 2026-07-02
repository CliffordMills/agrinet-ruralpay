import type { Metadata } from "next";
import { ClimateAlertFeed } from "@/components/farmer/ClimateAlertFeed";

export const metadata: Metadata = { title: "Climate Alerts" };

export default function FarmerClimatePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Climate Alerts</h1>
        <p className="text-muted-foreground">Active alerts for your region</p>
      </div>
      <div className="max-w-2xl">
        <ClimateAlertFeed />
      </div>
    </div>
  );
}
