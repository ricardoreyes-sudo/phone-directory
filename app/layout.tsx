import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Friend Directory",
  description: "A community phone directory with CloudTalk calling integration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
