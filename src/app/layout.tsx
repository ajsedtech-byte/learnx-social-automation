import type { Metadata } from "next";
import "./globals.css";
import { TierProvider } from "@/context/TierContext";
import { RoleProvider } from "@/context/RoleContext";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "LearnX — K-12 Universal Course Engine",
  description: "Every child learns differently. LearnX adapts to every age, every style, every dream.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LanguageProvider>
          <RoleProvider>
            <TierProvider>
              {children}
            </TierProvider>
          </RoleProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
