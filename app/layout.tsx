import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Media Converter - Free Online Video to MP4 Converter",
  description: "Convert videos to MP4 format directly in your browser. No uploads, complete privacy. Supports MOV, WebM, MKV, AVI. Powered by WebCodecs API.",
  keywords: "video converter, mp4 converter, online converter, browser converter, webcodecs, mov to mp4, mkv to mp4, avi to mp4, privacy-focused",
  authors: [{ name: "Media Converter" }],
  openGraph: {
    title: "Media Converter - Free Online Video to MP4 Converter",
    description: "Convert videos to MP4 format directly in your browser. Complete privacy - your files never leave your device.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
