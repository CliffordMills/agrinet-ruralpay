import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In | AGRINET RURALPAY",
};

export default function LoginPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
        <p className="text-muted-foreground mt-2">
          Sign in to your AGRINET RURALPAY account
        </p>
      </div>
      <LoginForm />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-primary font-medium hover:underline"
        >
          Register here
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        <Link
          href="/forgot-password"
          className="text-primary font-medium hover:underline"
        >
          Forgot your password?
        </Link>
      </p>
    </div>
  );
}
