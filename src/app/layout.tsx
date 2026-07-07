import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SAP Academy Simulator",
  description: "A Next.js finance training simulator for ERP configuration practice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
