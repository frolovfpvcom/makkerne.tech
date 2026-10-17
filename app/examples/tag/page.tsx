import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import { TagSite } from "@/components/examples/tag";

// One grotesk with weight to it, from a Nordic newspaper: heavy for the headline, plain for the rest.
const grotesk = Schibsted_Grotesk({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-tagvaerk" });

export const metadata: Metadata = {
  title: { absolute: "Tagværk – tagdækker og tømrer i Rødovre (eksempel)" },
  robots: { index: false },
};

export default function Page() {
  return (
    <div className={grotesk.variable}>
      <TagSite />
    </div>
  );
}
