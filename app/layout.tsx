import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { getSiteData } from "@/lib/data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Video Editor Portfolio",
  description: "Professional video editor portfolio with work samples, reviews, and an admin panel.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteData = await getSiteData();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-black font-sans text-white antialiased`}
      >
        <Header name={siteData.bio.name || "Video Editor"} title={siteData.bio.title || "Portfolio"} />
        <main className="relative">{children}</main>
        <Footer
          email={siteData.bio.contact.email || ""}
          socials={siteData.bio.contact.socials || {}}
        />
      </body>
    </html>
  );
}
