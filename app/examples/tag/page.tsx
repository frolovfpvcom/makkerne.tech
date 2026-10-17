import type { Metadata } from "next";
import { Hanken_Grotesk, Source_Serif_4 } from "next/font/google";
import { TagSite } from "@/components/examples/tag";

// A clean grotesk for figures and headings, and a book serif for captions and the longer notes from the roof.
const grotesk = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-tagvaerk" });
const serif = Source_Serif_4({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-tagvaerk-serif" });

export const metadata: Metadata = {
  title: { absolute: "Tagværk – tagdækker og tømrer i Rødovre (eksempel)" },
  robots: { index: false },
};

export default function Page() {
  return (
    <div className={`${grotesk.variable} ${serif.variable}`}>
      <TagSite />
    </div>
  );
}
