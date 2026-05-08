import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Center for Africa Financial Inclusion and Advancement (CAFIA)",
  url: "https://cafia-africa.com",
  email: "info@cafia-africa.com",
  telephone: "+232 74 484134",
  address: {
    "@type": "PostalAddress",
    streetAddress: "32 Rue de la paix",
    addressLocality: "Freetown",
    addressCountry: "SL",
  },
};

export const metadata: Metadata = {
  title: "CAFIA - Center for Africa Financial Inclusion and Advancement",
  description:
    "Transforming Africa's informal sector into a catalyst for inclusive economic growth through research, data, education, and innovation.",
  generator: "v0.app",
  metadataBase: new URL("https://cafia-africa.com"),
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
