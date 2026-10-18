import type { Metadata } from "next";
import { Archivo, Big_Shoulders } from "next/font/google";
import { SmedSite } from "@/components/examples/smed";

// Tall, condensed capitals from a city built on steel for the headings, and a sturdy grotesk for everything you read.
const display = Big_Shoulders({ subsets: ["latin"], weight: ["700", "800", "900"], adjustFontFallback: false, variable: "--font-norbaek-display" });
const body = Archivo({ subsets: ["latin"], variable: "--font-norbaek" });

export const metadata: Metadata = {
  title: { absolute: "Nørbæk Smedie – klejnsmed i Silkeborg (eksempel)" },
  robots: { index: false },
};

export default function Page() {
  return (
    <div className={`${display.variable} ${body.variable}`}>
      <SmedSite />
    </div>
  );
}
