import type { Metadata } from "next";
import { Albert_Sans, Literata } from "next/font/google";
import { TomrerSite } from "@/components/examples/tomrer";

// A warm book serif for the stories and a plain Scandinavian sans for facts, buttons and forms.
const serif = Literata({ subsets: ["latin"], variable: "--font-egholm" });
const sans = Albert_Sans({ subsets: ["latin"], variable: "--font-egholm-sans" });

export const metadata: Metadata = {
  title: { absolute: "Egholm Tømrer & Snedker – tømrer i Roskilde (eksempel)" },
  robots: { index: false },
};

export default function Page() {
  return (
    <div className={`${serif.variable} ${sans.variable}`}>
      <TomrerSite />
    </div>
  );
}
