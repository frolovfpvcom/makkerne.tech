import type { Metadata } from "next";
import { Familjen_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { TomrerSite } from "@/components/examples/tomrer";

// A plain, sturdy grotesk for everything, and a mono for captions and facts: the job log.
const grotesk = Familjen_Grotesk({ subsets: ["latin"], variable: "--font-egholm" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-egholm-mono" });

export const metadata: Metadata = {
  title: { absolute: "Egholm Tømrer & Snedker – tømrer i Roskilde (eksempel)" },
  robots: { index: false },
};

export default function Page() {
  return (
    <div className={`${grotesk.variable} ${mono.variable}`}>
      <TomrerSite />
    </div>
  );
}
