import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const zenKaku = Zen_Kaku_Gothic_New({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-zen-kaku",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://neon-kissa-v2.vercel.app"),
  title: "Neon Kissa — Tokyo Cocktail Bar",
  description:
    "A bilingual cocktail hideout in Shinjuku, Tokyo. Walk-in friendly. Open nightly 18:00–03:00.",
  alternates: {
    canonical: "/",
  },
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BarOrPub",
  name: "Neon Kissa",
  alternateName: "ネオン喫茶",
  description:
    "A bilingual cocktail hideout in Shinjuku, Tokyo. Walk-in friendly. Open nightly 18:00–03:00.",
  url: "https://neon-kissa-v2.vercel.app",
  image:
    "https://images.unsplash.com/photo-1608060146923-7b8ab13e22bb?w=1200&h=630&fit=crop&q=80",
  address: {
    "@type": "PostalAddress",
    streetAddress: "2-2-1 Kabukicho",
    addressLocality: "Shinjuku-ku",
    addressRegion: "Tokyo",
    addressCountry: "JP",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "18:00",
    closes: "03:00",
  },
  priceRange: "¥1,200–¥1,700",
  servesCuisine: "Cocktails",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${zenKaku.variable} ${jetbrainsMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
