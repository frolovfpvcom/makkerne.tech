import type { Metadata } from "next";
import { Bodoni_Moda, Instrument_Sans } from "next/font/google";
import { MalerSite } from "@/components/examples/maler";

// A Bodoni for the headlines and room stories, like a home magazine, and an even sans for codes, prices and forms.
const serif = Bodoni_Moda({ subsets: ["latin"], variable: "--font-kulor-serif" });
const sans = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-kulor" });

export const metadata: Metadata = {
  title: { absolute: "Malerfirmaet Kulør – maler i Odense (eksempel)" },
  robots: { index: false },
};

export default function Page() {
  return (
    <div className={`${serif.variable} ${sans.variable}`}>
      <MalerSite />
    </div>
  );
}
