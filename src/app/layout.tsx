
import ClientLayout from "./client-layout"; 
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SHEild",
  description: "Women safety app",
  themeColor: "#e60023",
  manifest: "/manifest.json",
  icons: {
    apple: "/icon-192x192.png",
  },
};

export default function ServerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ClientLayout>{children}</ClientLayout>;
}