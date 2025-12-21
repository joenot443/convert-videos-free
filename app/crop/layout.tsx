import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL('https://cropvideosfree.com'),
  title: "Crop Videos Free - Online Video Cropper & Trimmer | No Upload Required",
  description: "Free online video cropper and trimmer. Crop and trim videos instantly in your browser. 100% privacy - no uploads, no registration. Powered by WebCodecs.",
  keywords: "free video cropper, crop video online, trim video online, video cutter, resize video, aspect ratio converter, 16:9 crop, 9:16 crop, vertical video crop, instagram crop, tiktok crop",
  authors: [{ name: "Joe Crozier", url: "https://joecrozier.ca" }],
  creator: "Joe Crozier",
  publisher: "Crop Videos Free",
  openGraph: {
    title: "Crop Videos Free - Online Video Cropper & Trimmer",
    description: "Free browser-based video cropper. Crop and trim videos instantly. 100% privacy - files never leave your device.",
    url: "https://cropvideosfree.com",
    siteName: "Crop Videos Free",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crop Videos Free - Online Video Cropper & Trimmer",
    description: "Free browser-based video cropper. 100% privacy - files never leave your device.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://cropvideosfree.com",
  },
};

export default function CropLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white">
      {children}
    </div>
  );
}
