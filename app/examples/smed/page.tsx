import type { Metadata } from "next";
import { Chivo, Chivo_Mono } from "next/font/google";
import { SmedSite } from "@/components/examples/smed";

// A firm, slightly industrial grotesk for everything, and its mono for measures, positions and RAL codes: the workshop drawing.
const chivo = Chivo({ subsets: ["latin"], variable: "--font-norbaek" });
const mono = Chivo_Mono({ subsets: ["latin"], variable: "--font-norbaek-mono" });

export const metadata: Metadata = {
  title: { absolute: "Nørbæk Smedie – klejnsmed i Silkeborg (eksempel)" },
  robots: { index: false },
};

export default function Page() {
  return (
    <div className={`${chivo.variable} ${mono.variable}`}>
      <SmedSite />
    </div>
  );
}
