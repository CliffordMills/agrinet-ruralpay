"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(data: ResetPasswordFormData) {
    setError(null);
    const supabase = createClient();
    const { error: sbError } = await supabase.auth.updateUser({
      password: data.password,
    });
    if (sbError) {
      setError(sbError.message);
      return;
    }
    router.push("/login?reset=success");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">New password</h1>
        <p className="text-muted-foreground mt-2">Enter your new password below</p>
      </div>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Min. 8 characters"
            className="mt-1"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="confirm_password">Confirm new password</Label>
          <Input
            id="confirm_password"
            type="password"
            placeholder="Re-enter new password"
            className="mt-1"
            {...register("confirm_password")}
          />
          {errors.confirm_password && (
            <p className="text-sm text-destructive mt-1">{errors.confirm_password.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update password"}
        </Button>
      </form>
    </div>
  );
}
