import type { Metadata } from "next";
import { Big_Shoulders, Public_Sans } from "next/font/google";
import { VvsSite } from "@/components/examples/vvs";

// Condensed caps like the lettering on the side of a service van, and a plain, sober sans for prices and instructions.
const display = Big_Shoulders({ subsets: ["latin"], weight: ["600", "700", "800"], adjustFontFallback: false, variable: "--font-holm-display" });
const body = Public_Sans({ subsets: ["latin"], variable: "--font-holm" });

export const metadata: Metadata = {
  title: { absolute: "Holm VVS – VVS-installatør i Herlev (eksempel)" },
  robots: { index: false },
};

export default function Page() {
  return (
    <div className={`${display.variable} ${body.variable}`}>
      <VvsSite />
    </div>
  );
}
