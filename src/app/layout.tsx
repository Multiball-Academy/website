import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Multiball Academy | Youth Competitive Pinball",
  description: "Building focus, resilience, and community through competitive pinball. Summer camps and year-round programs for ages 8-16 in Memphis, TN.",
  keywords: ["pinball", "youth sports", "Memphis", "summer camp", "competitive gaming", "STEM"],
  authors: [{ name: "Multiball Academy" }],
  openGraph: {
    title: "Multiball Academy | Youth Competitive Pinball",
    description: "Building focus, resilience, and community — one flipper at a time.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Multiball Academy",
    description: "Youth Competitive Pinball — Summer 2026 in Memphis, TN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
