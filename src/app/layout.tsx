import type { Metadata } from "next";
import { Gentium_Book_Plus, Cabin } from "next/font/google";
import "./globals.css";

const fontDisplay = Gentium_Book_Plus({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display",
});

const fontBody = Cabin({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "DocExtract — Vos documents lisibles par vos systèmes en 5 secondes",
  description:
    "OCR intelligent et extraction structurée — factures, contrats, formulaires transformés en données JSON propres.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={`${fontDisplay.variable} ${fontBody.variable}`}
        style={{ background: "#fffbeb", fontFamily: "var(--font-body)" }}
      >
        {children}
      </body>
    </html>
  );
}
