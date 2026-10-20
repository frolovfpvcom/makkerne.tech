import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const hanken = Hanken_Grotesk({ variable: "--font-body", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const bricolage = Bricolage_Grotesque({ variable: "--font-head", subsets: ["latin"], weight: ["500", "600", "700", "800"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://makkerne.tech"),
  title: { default: "Makkerne", template: "%s · Makkerne" },
  description:
    "Makkerne laver hjemmesider til håndværkere: VVS'ere, tømrere, malere og andre fag. Du klarer håndværket, vi klarer siden.",
  openGraph: {
    title: "Makkerne – hjemmesider der skaffer håndværkere flere kunder",
    description: "Hjemmesider til håndværkere, der får telefonen til at ringe. Se et gratis udkast, før du betaler.",
    locale: "da_DK",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0f1d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="da" data-scroll-behavior="smooth" className={`${hanken.variable} ${bricolage.variable} antialiased`}>
      <body className="min-h-dvh bg-paper font-sans text-ink">
        {children}
      </body>
    </html>
  );
}
