import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import AuthModals from "@/components/AuthModals";

export const metadata: Metadata = {
  title: "CinemaFlix - Watch Movies & Shows in 4K HD Free",
  description: "Unlimited HD & 4K movie streaming platform powered by ultra-fast video backend.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0e0f12] text-white min-h-screen antialiased">
        <LanguageProvider>
          <AuthProvider>
            {children}
            <AuthModals />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
