import RoleGuard from "@/components/auth/RoleGuard";
import AgentSidebar from "@/components/agent/AgentSidebar";

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["AGENT", "ADMIN", "SUPER_ADMIN"]}>
      <div className="flex min-h-screen bg-background">
        <AgentSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</div>
        </main>
      </div>
    </RoleGuard>
  );
}
