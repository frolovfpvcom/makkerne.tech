import type { Metadata } from "next";
import { Work_Sans, Zilla_Slab } from "next/font/google";
import { MurerSite } from "@/components/examples/murer";

// A slab serif like the stamp on a brick for headings, and a plain, sturdy sans for the facts.
const slab = Zilla_Slab({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-teglgaard-slab" });
const sans = Work_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-teglgaard" });

export const metadata: Metadata = {
  title: { absolute: "Teglgaard Murer – murer i Aarhus (eksempel)" },
  robots: { index: false },
};

export default function Page() {
  return (
    <div className={`${slab.variable} ${sans.variable}`}>
      <MurerSite />
    </div>
  );
}
