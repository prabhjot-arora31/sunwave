import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/layout/SiteChrome";
import StructuredData from "@/components/seo/StructuredData";
import { company } from "@/data/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.sunwavesolar.in";
const title = "Sun Wave Solar | Switch to Solar & Save on Electricity";
const description =
  "Sun Wave installs residential, commercial and industrial solar systems across India with subsidy assistance and easy EMI options. Get a free consultation and quote today.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Sun Wave Solar",
  },
  description,
  keywords: [
    "solar panels India",
    "rooftop solar installation",
    "residential solar",
    "commercial solar",
    "solar subsidy PM Surya Ghar",
    "solar EMI finance",
    "on-grid off-grid hybrid solar",
    "solar installer near me",
  ],
  authors: [{ name: company.fullName }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Sun Wave Solar",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <StructuredData />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
