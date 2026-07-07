import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SAP FICO Training Platform",
  description: "A Next.js SAP FICO learning platform with interactive lessons and finance labs.",
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
