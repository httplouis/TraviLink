// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
<link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} crossOrigin="" />


export const metadata: Metadata = {
  title: { default: "TraviLink", template: "%s • TraviLink" },
  description: "University Vehicle Scheduling & Reservation Portal",
  icons: {
    icon: [
      { url: "/vercel.svg" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/site.webmanifest",      
  themeColor: "#7f1d1d",            
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* globals.css sets background/text + dark mode; keep body clean */}
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
