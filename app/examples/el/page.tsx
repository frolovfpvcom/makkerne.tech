import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { ElSite } from "@/components/examples/el";

// One plain, technical grotesk for everything, like the print on a fuse board label.
const archivo = Archivo({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-fasebro" });

export const metadata: Metadata = {
  title: { absolute: "Fasebro El – elektriker i Køge (eksempel)" },
  robots: { index: false },
};

export default function Page() {
  return (
    <div className={archivo.variable}>
      <ElSite />
    </div>
  );
}
