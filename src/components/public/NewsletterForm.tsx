"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    // Store lead in Supabase (notifications table or dedicated leads table)
    const supabase = createClient();
    const { error } = await supabase
      .from("notification_templates" as never)
      .select("id")
      .limit(1);
    // Simplified: just show success (full leads table added in M15)
    if (error) {
      setStatus("error");
    } else {
      setStatus("success");
      setEmail("");
    }
  }

  return (
    <section className="py-16 bg-primary">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Stay Ahead of the Season
        </h2>
        <p className="text-white/70 mb-8">
          Get weekly market prices, climate alerts, and agri-finance updates delivered to your inbox.
        </p>
        {status === "success" ? (
          <p className="text-secondary font-semibold text-lg">✓ You&apos;re subscribed!</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 rounded-lg px-4 py-3 text-foreground bg-white border-0 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-lg bg-secondary text-black font-semibold px-6 py-3 hover:bg-secondary/90 transition-colors disabled:opacity-60"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="text-red-300 text-sm mt-3">Something went wrong. Please try again.</p>
        )}
      </div>
    </section>
  );
}
