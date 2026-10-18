import type { Metadata } from "next";
import { Atkinson_Hyperlegible_Mono, Atkinson_Hyperlegible_Next } from "next/font/google";
import { VvsSite } from "@/components/examples/vvs";

// A typeface drawn for readers with low vision, for a page read in a hurry with water on the floor.
const body = Atkinson_Hyperlegible_Next({ subsets: ["latin"], adjustFontFallback: false, variable: "--font-holm" });
const mono = Atkinson_Hyperlegible_Mono({ subsets: ["latin"], adjustFontFallback: false, variable: "--font-holm-mono" });

export const metadata: Metadata = {
  title: { absolute: "Holm VVS – VVS-installatør i Herlev (eksempel)" },
  robots: { index: false },
};

export default function Page() {
  return (
    <div className={`${body.variable} ${mono.variable}`}>
      <VvsSite />
    </div>
  );
}
