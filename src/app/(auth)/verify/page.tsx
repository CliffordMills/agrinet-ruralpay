import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email | AGRINET RURALPAY",
};

export default function VerifyPage() {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-8 h-8 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h1 className="text-3xl font-bold mb-3">Verify your email</h1>
      <p className="text-muted-foreground mb-2">
        We sent a verification link to your email address.
      </p>
      <p className="text-muted-foreground mb-8">
        Click the link in the email to activate your AGRINET RURALPAY account.
      </p>
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Didn&apos;t receive the email? Check your spam folder or{" "}
          <Link href="/register" className="text-primary font-medium hover:underline">
            try a different email
          </Link>
          .
        </p>
        <p className="text-sm">
          <Link href="/login" className="text-primary font-medium hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
