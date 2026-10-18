import type { Metadata } from "next";
import { Spectral } from "next/font/google";
import { AnlaegSite } from "@/components/examples/anlaeg";

// One quiet book serif, light and large under the photos, like the captions in a book about gardens.
const spectral = Spectral({ subsets: ["latin"], weight: ["300", "400", "500", "600"], style: ["normal", "italic"], variable: "--font-lindholm" });

export const metadata: Metadata = {
  title: { absolute: "Lindholm Anlæg – anlægsgartner i Vejle (eksempel)" },
  robots: { index: false },
};

export default function Page() {
  return (
    <div className={spectral.variable}>
      <AnlaegSite />
    </div>
  );
}
