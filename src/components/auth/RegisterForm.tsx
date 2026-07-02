"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ROLES = [
  { value: "FARMER", label: "Farmer" },
  { value: "AGENT", label: "Field Agent" },
  { value: "BUYER", label: "Buyer / Exporter" },
  { value: "HUB_MANAGER", label: "Hub Manager" },
] as const;

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "FARMER" },
  });

  async function onSubmit(data: RegisterFormData) {
    setError(null);
    const supabase = createClient();

    const { error: sbError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          role: data.role,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
        },
      },
    });

    if (sbError) {
      setError(sbError.message);
      return;
    }

    router.push("/verify");
  }

  return (
    <div>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first_name">First name</Label>
            <Input
              id="first_name"
              placeholder="Kwame"
              className="mt-1"
              {...register("first_name")}
            />
            {errors.first_name && (
              <p className="text-sm text-destructive mt-1">{errors.first_name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="last_name">Last name</Label>
            <Input
              id="last_name"
              placeholder="Mensah"
              className="mt-1"
              {...register("last_name")}
            />
            {errors.last_name && (
              <p className="text-sm text-destructive mt-1">{errors.last_name.message}</p>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="phone">Phone number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="0241234567"
            className="mt-1"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="role">I am a</Label>
          <select
            id="role"
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            {...register("role")}
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="text-sm text-destructive mt-1">{errors.role.message}</p>
          )}
        </div>
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
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            className="mt-1"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="confirm_password">Confirm password</Label>
          <Input
            id="confirm_password"
            type="password"
            placeholder="Re-enter password"
            autoComplete="new-password"
            className="mt-1"
            {...register("confirm_password")}
          />
          {errors.confirm_password && (
            <p className="text-sm text-destructive mt-1">{errors.confirm_password.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          By registering you agree to our{" "}
          <a href="/terms" className="underline hover:text-foreground">Terms of Service</a>{" "}
          and{" "}
          <a href="/privacy" className="underline hover:text-foreground">Privacy Policy</a>.
        </p>
      </form>
    </div>
  );
}
