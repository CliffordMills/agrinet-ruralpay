import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/providers/ToastProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AGRINET RURALPAY",
    template: "%s | AGRINET RURALPAY",
  },
  description:
    "Africa's leading village-level commodity origination platform. Digitizing first-mile agricultural supply chains from farmgate to export market.",
  keywords: [
    "agriculture",
    "Ghana",
    "commodity",
    "farmers",
    "supply chain",
    "agritech",
    "fintech",
  ],
  authors: [{ name: "AGRINET RURALPAY" }],
  creator: "AGRINET RURALPAY",
  openGraph: {
    type: "website",
    locale: "en_GH",
    siteName: "AGRINET RURALPAY",
    title: "AGRINET RURALPAY — Digitizing Ghana's Agricultural Supply Chain",
    description:
      "Connect farmers, agents, hubs, and buyers on one powerful platform.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AGRINET RURALPAY",
    description: "Digitizing Ghana's Agricultural Supply Chain",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
