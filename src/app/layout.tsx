import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TraviLink",
  description: "Campus Transport Scheduling & Tracking",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-50 text-neutral-900">{children}</body>
    </html>
  );
}
