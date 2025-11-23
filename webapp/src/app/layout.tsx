import type { Metadata } from "next";
import "./globals.css";
import { Baloo_2 } from "next/font/google";

const baloo = Baloo_2({ subsets: ["latin"], variable: "--font-baloo" });

export const metadata: Metadata = {
  title: "Zippy Solar Journey",
  description: "One-minute educational animation for curious kids in India."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" className={baloo.variable}>
      <body>{children}</body>
    </html>
  );
}
