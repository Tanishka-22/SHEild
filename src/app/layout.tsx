
import ClientLayout from "./client-layout"; 
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SHEild",
  description: "Women safety app",
  themeColor: "#e60023",
  manifest: "/manifest.json",
  icons: {
    apple: "../../public/icons/icon-512x512.png",
  },
};

export default function ServerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ClientLayout>{children}</ClientLayout>;
}