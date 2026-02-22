import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LearnX Social Media Automation",
  description: "365-day content calendar with daily auto-publishing across 10 platforms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
