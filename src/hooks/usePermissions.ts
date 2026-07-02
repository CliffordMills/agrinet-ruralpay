"use client";

import { useAuthStore } from "@/store/authStore";
import { hasPermission, hasAnyPermission } from "@/lib/auth/rbac";
import type { Permission } from "@/lib/auth/roles";

export function usePermissions() {
  const { user } = useAuthStore();
  return {
    can: (permission: Permission) => user ? hasPermission(user.role, permission) : false,
    canAny: (permissions: Permission[]) => user ? hasAnyPermission(user.role, permissions) : false,
    role: user?.role ?? null,
  };
}
