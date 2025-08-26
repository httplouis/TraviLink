// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
<link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} crossOrigin="" />


export const metadata: Metadata = {
  title: "TraviLink",
  description: "Campus transport scheduling & tracking system",
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
