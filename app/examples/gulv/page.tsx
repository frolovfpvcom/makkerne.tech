import type { Metadata } from "next";
import { Karla, Newsreader } from "next/font/google";
import { GulvSite } from "@/components/examples/gulv";

// A calm book serif for headings, like the label on a tin of floor oil, and a plain, warm grotesk for the rest.
const serif = Newsreader({ subsets: ["latin"], weight: ["400", "500"], style: ["normal", "italic"], variable: "--font-boegh-serif" });
const sans = Karla({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-boegh" });

export const metadata: Metadata = {
  title: { absolute: "Bøgh Gulve – gulvlægger og gulvsliber i Hillerød (eksempel)" },
  robots: { index: false },
};

export default function Page() {
  return (
    <div className={`${serif.variable} ${sans.variable}`}>
      <GulvSite />
    </div>
  );
}
