
import ClientLayout from "./client-layout"; 
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SHEild",
  description: "Women safety app",
  themeColor: "#e60023",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192" },
      { url: "/icons/icon-512x512.png", sizes: "512x512" }
    ],
    apple: "/icons/icon-512x512.png",
    shortcut: "/icons/icon-192x192.png"
  },
};

export default function ServerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ClientLayout>{children}</ClientLayout>;
}