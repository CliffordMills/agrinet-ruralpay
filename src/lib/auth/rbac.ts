import type { UserRole } from "@/types";
import type { Permission } from "./roles";
import { ROLE_PERMISSIONS } from "./roles";

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

export function canAccessRoute(role: UserRole, route: string): boolean {
  const routeRoles: Record<string, UserRole[]> = {
    "/farmer": ["FARMER", "AGENT", "ADMIN", "SUPER_ADMIN"],
    "/agent": ["AGENT", "ADMIN", "SUPER_ADMIN"],
    "/hub": ["HUB_MANAGER", "ADMIN", "SUPER_ADMIN"],
    "/marketplace": ["BUYER", "ADMIN", "SUPER_ADMIN"],
    "/finance": ["ADMIN", "SUPER_ADMIN"],
    "/climate": ["AGENT", "FARMER", "ADMIN", "SUPER_ADMIN"],
    "/admin": ["ADMIN", "ANALYST", "SUPER_ADMIN"],
  };
  const prefix = Object.keys(routeRoles).find((p) => route.startsWith(p));
  if (!prefix) return true;
  return routeRoles[prefix].includes(role);
}

export function getDashboardRoute(role: UserRole): string {
  const routes: Record<UserRole, string> = {
    SUPER_ADMIN: "/admin/dashboard",
    ADMIN: "/admin/dashboard",
    AGENT: "/agent/dashboard",
    FARMER: "/farmer/dashboard",
    BUYER: "/marketplace",
    HUB_MANAGER: "/hub/dashboard",
    ANALYST: "/admin/dashboard",
  };
  return routes[role] ?? "/";
}
