import type { Metadata } from "next";
import { Overpass, Overpass_Mono } from "next/font/google";
import { ElSite } from "@/components/examples/el";

// Overpass comes from the lettering on American highway signs: made to be read fast, at a distance, under stress.
const body = Overpass({ subsets: ["latin"], variable: "--font-fasebro" });
const mono = Overpass_Mono({ subsets: ["latin"], variable: "--font-fasebro-mono" });

export const metadata: Metadata = {
  title: { absolute: "Fasebro El – elektriker i Køge (eksempel)" },
  robots: { index: false },
};

export default function Page() {
  return (
    <div className={`${body.variable} ${mono.variable}`}>
      <ElSite />
    </div>
  );
}
