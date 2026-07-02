"use client";

import { useState } from "react";

const TESTIMONIALS = [
  {
    name: "Abena Mensah",
    role: "Maize Farmer, Sunyani",
    quote:
      "Before AGRINET, I had to wait two weeks for payment after selling my maize. Now I receive money on my MTN MoMo within hours. My children can go to school on time.",
    avatar: "AM",
  },
  {
    name: "Kofi Asante",
    role: "Field Agent, Tamale",
    quote:
      "The app makes it easy to register farmers and record their produce with GPS. The GRN is generated instantly and the farmer gets an SMS. It builds trust.",
    avatar: "KA",
  },
  {
    name: "Samuel Acheampong",
    role: "Commodity Buyer, Kumasi",
    quote:
      "We can now source certified, traceable cashews directly from AGRINET hubs. The quality grading is consistent and the contracts are digital — no disputes.",
    avatar: "SA",
  },
];

export function TestimonialsCarousel() {
  const [active, setActive] = useState(0);
  const t = TESTIMONIALS[active];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-16">Voices from the Field</h2>

        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 md:p-12 mb-8">
          <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-6">
            {t.avatar}
          </div>
          <blockquote className="text-lg md:text-xl text-foreground leading-relaxed mb-6">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <p className="font-semibold">{t.name}</p>
          <p className="text-sm text-muted-foreground">{t.role}</p>
        </div>

        <div className="flex justify-center gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === active ? "bg-primary w-6" : "bg-primary/30"
              }`}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
