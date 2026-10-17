import type { Metadata } from "next";
import { Epilogue } from "next/font/google";
import { MurerSite } from "@/components/examples/murer";

// One grotesk with real weight: extra bold for the headlines, like letters cut in a lintel, plain for the rest.
const epilogue = Epilogue({ subsets: ["latin"], variable: "--font-teglgaard" });

export const metadata: Metadata = {
  title: { absolute: "Teglgaard Murer – murer i Aarhus (eksempel)" },
  robots: { index: false },
};

export default function Page() {
  return (
    <div className={epilogue.variable}>
      <MurerSite />
    </div>
  );
}
