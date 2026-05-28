import type { Metadata } from "next";
import { Gentium_Book_Plus, Cabin } from "next/font/google";
import Script from "next/script";
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
      <Script id="cal-embed" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: '(function(C,A,L){var p=function(a,ar){a.q.push(ar);};var d=C.document;C.Cal=C.Cal||function(){var cal=C.Cal;var ar=arguments;if(!cal.loaded){cal.ns={};cal.q=cal.q||[];d.head.appendChild(d.createElement("script")).src=A;cal.loaded=true;}if(ar[0]===L){const api=function(){p(api,arguments);};const namespace=ar[1];api.q=api.q||[];if(typeof namespace==="string"){cal.ns[namespace]=cal.ns[namespace]||api;p(cal.ns[namespace],ar);p(cal,["-",namespace,ar[2]]);}else p(cal,ar);return;}p(cal,ar);};})(window,"https://app.cal.com/embed/embed.js","init");Cal("init","wk30min",{origin:"https://app.cal.com"});Cal.ns["wk30min"]("ui",{"theme":"light","hideEventTypeDetails":false,"layout":"month_view"});' }} />
      </body>
    </html>
  );
}
