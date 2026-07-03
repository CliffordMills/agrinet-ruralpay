import RoleGuard from "@/components/auth/RoleGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { requireSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  if (!session) redirect("/login");

  return (
    <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">{children}</div>
        </main>
      </div>
    </RoleGuard>
  );
}
