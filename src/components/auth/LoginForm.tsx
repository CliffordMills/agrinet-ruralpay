"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";
import { getDashboardRoute } from "@/lib/auth/rbac";
import type { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const resetSuccess = searchParams.get("reset") === "success";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setError(null);
    const supabase = createClient();

    const { data: authData, error: sbError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (sbError) {
      setError(sbError.message);
      return;
    }

    const role = (authData.user?.user_metadata?.role ?? "FARMER") as UserRole;
    router.push(getDashboardRoute(role));
    router.refresh();
  }

  return (
    <div>
      {resetSuccess && (
        <Alert className="mb-6 border-primary/30 bg-primary/5">
          <AlertDescription className="text-primary">
            Password updated successfully. Please sign in.
          </AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className="mt-1"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Your password"
            autoComplete="current-password"
            className="mt-1"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
