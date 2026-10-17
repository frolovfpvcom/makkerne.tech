import type { Metadata } from "next";
import { Alegreya, Alegreya_Sans } from "next/font/google";
import { AnlaegSite } from "@/components/examples/anlaeg";

// A calligraphic book serif for headings and captions, like an old garden handbook, and its sans sibling for reading.
const serif = Alegreya({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-lindholm" });
const sans = Alegreya_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], style: ["normal", "italic"], variable: "--font-lindholm-sans" });

export const metadata: Metadata = {
  title: { absolute: "Lindholm Anlæg – anlægsgartner i Vejle (eksempel)" },
  robots: { index: false },
};

export default function Page() {
  return (
    <div className={`${serif.variable} ${sans.variable}`}>
      <AnlaegSite />
    </div>
  );
}
