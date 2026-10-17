import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import { MalerSite } from "@/components/examples/maler";

// A lively grotesk for the headings and a calm, even sans for the colour codes, prices and body text.
const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-kulor-display" });
const sans = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-kulor" });

export const metadata: Metadata = {
  title: { absolute: "Malerfirmaet Kulør – maler i Odense (eksempel)" },
  robots: { index: false },
};

export default function Page() {
  return (
    <div className={`${display.variable} ${sans.variable}`}>
      <MalerSite />
    </div>
  );
}
