import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New, Space_Mono } from "next/font/google";
import "./globals.css";

const zenKaku = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-zen-kaku",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Neon Kissa — Tokyo Cocktail Bar",
  description:
    "A bilingual cocktail hideout in Shinjuku, Tokyo. Walk-in friendly. Open nightly 18:00–03:00.",
  openGraph: {
    title: "Neon Kissa — Tokyo Cocktail Bar",
    description:
      "A bilingual cocktail hideout in Shinjuku. Walk-ins welcome. Open till 03:00.",
    type: "website",
    url: "https://neon-kissa-v2.vercel.app",
    images: [
      {
        url: "https://images.unsplash.com/photo-1608060146923-7b8ab13e22bb?w=1200&h=630&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "Neon Kissa — Tokyo Cocktail Bar",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${zenKaku.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
