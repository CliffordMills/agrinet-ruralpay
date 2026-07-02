import RoleGuard from "@/components/auth/RoleGuard";
import HubSidebar from "@/components/hub/HubSidebar";

export default function HubLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["HUB_MANAGER", "ADMIN", "SUPER_ADMIN"]}>
      <div className="flex min-h-screen bg-background">
        <HubSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</div>
        </main>
      </div>
    </RoleGuard>
  );
}
