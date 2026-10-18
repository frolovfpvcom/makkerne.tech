import type { Metadata } from "next";
import { Jost } from "next/font/google";
import { GulvSite } from "@/components/examples/gulv";

// A light geometric sans, like an old Scandinavian furniture catalogue, so the floors get the attention.
const jost = Jost({ subsets: ["latin"], variable: "--font-boegh" });

export const metadata: Metadata = {
  title: { absolute: "Bøgh Gulve – gulvlægger og gulvsliber i Hillerød (eksempel)" },
  robots: { index: false },
};

export default function Page() {
  return (
    <div className={jost.variable}>
      <GulvSite />
    </div>
  );
}
