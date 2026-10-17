import type { Metadata } from "next";
import { Red_Hat_Display, Red_Hat_Mono } from "next/font/google";
import { FugerSite } from "@/components/examples/fuger";

// A clean, technical sans for text, and its mono sibling for meters, prices and the job log: an opmålingsseddel.
const display = Red_Hat_Display({ subsets: ["latin"], weight: ["400", "500", "700", "800"], variable: "--font-taet" });
const mono = Red_Hat_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-taet-mono" });

export const metadata: Metadata = {
  title: { absolute: "Fugefirmaet Tæt – fugemand i Esbjerg (eksempel)" },
  robots: { index: false },
};

export default function Page() {
  return (
    <div className={`${display.variable} ${mono.variable}`}>
      <FugerSite />
    </div>
  );
}
