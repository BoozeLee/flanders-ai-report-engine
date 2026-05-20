import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Flanders AI Report Engine",
  description: "Genereer uw VLAIO innovatierapport in 2 minuten. AI-gegenereerd, sectorspecifiek, klaar voor subsidieaanvraag.",
  keywords: ["VLAIO", "innovatierapport", "AI", "KMO", "Vlaanderen", "subsidie"],
  openGraph: {
    title: "Flanders AI Report Engine",
    description: "AI-gegenereerde VLAIO innovatierapporten voor Vlaamse KMO's in 30 seconden.",
    type: "website",
    locale: "nl_BE",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
