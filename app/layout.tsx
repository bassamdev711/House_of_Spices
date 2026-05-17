import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "700"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "TIF | طيف - حيث تتحول الرائحة إلى حضور",
  description: "عطور كريستالية مستوحاة من الضوء والهدوء والفخامة المطلقة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-crystal-blue text-frost-white overflow-x-hidden">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
