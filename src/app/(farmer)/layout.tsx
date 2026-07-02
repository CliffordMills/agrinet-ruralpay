import { RoleGuard } from "@/components/auth/RoleGuard";
import { FarmerSidebar } from "@/components/farmer/FarmerSidebar";

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["FARMER", "AGENT", "ADMIN", "SUPER_ADMIN"]}>
      <div className="flex min-h-screen bg-background">
        <FarmerSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</div>
        </main>
      </div>
    </RoleGuard>
  );
}
