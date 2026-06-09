import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "mailroom-engine: Simulated LMC",
  description: "Browser-only Little Man Computer simulator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
