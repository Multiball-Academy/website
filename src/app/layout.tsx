import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://multiballacademy.com"),
  title: "Multiball Academy | Flip. Tinker. Play.",
  description: "Youth pinball + maker space. Building skills, focus, and fun. Summer camps and year-round programs for ages 8-16 in Memphis, TN.",
  keywords: ["pinball", "youth sports", "Memphis", "summer camp", "maker space", "STEM", "coding"],
  authors: [{ name: "Multiball Academy" }],
  openGraph: {
    title: "Multiball Academy | Flip. Tinker. Play.",
    description: "Youth pinball + maker space. Building skills, focus, and fun.",
    type: "website",
    locale: "en_US",
    siteName: "Multiball Academy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Multiball Academy",
    description: "Flip. Tinker. Play. — Summer 2026 in Memphis, TN",
    creator: "@multiballacademy",
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
