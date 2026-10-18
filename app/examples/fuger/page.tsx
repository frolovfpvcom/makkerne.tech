import type { Metadata } from "next";
import { Funnel_Display, Funnel_Sans } from "next/font/google";
import { FugerSite } from "@/components/examples/fuger";

// A grotesk with clipped, nozzle-like terminals for headings, and its plainer sibling for reading.
const display = Funnel_Display({ subsets: ["latin"], variable: "--font-taet" });
const sans = Funnel_Sans({ subsets: ["latin"], variable: "--font-taet-sans" });

export const metadata: Metadata = {
  title: { absolute: "Fugefirmaet Tæt – fugemand i Esbjerg (eksempel)" },
  robots: { index: false },
};

export default function Page() {
  return (
    <div className={`${display.variable} ${sans.variable}`}>
      <FugerSite />
    </div>
  );
}
