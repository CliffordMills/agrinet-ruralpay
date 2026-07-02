import type { UserRole } from "./database.types";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  permissions: string[];
  organization_id?: string;
}

export interface JWTClaims {
  sub: string;
  email: string;
  role: UserRole;
  permissions: string[];
  organization_id?: string;
  iat: number;
  exp: number;
}
