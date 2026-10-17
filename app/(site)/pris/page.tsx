import type { Metadata } from "next";
import { PricePage } from "@/components/pages";

export const metadata: Metadata = {
  title: "Pris",
  description: "Se hvad din hjemmeside koster på et minut. Fast pris, før vi går i gang, og et gratis udkast, før du betaler.",
};

export default function Page() {
  return <PricePage />;
}
