import type { Metadata } from "next";
import { PricePage } from "@/components/pages";

export const metadata: Metadata = {
  title: "Gratis udkast",
  description: "Svar på et par korte spørgsmål, se hvad din hjemmeside koster, og få et gratis udkast, før du betaler.",
};

export default function Page() {
  return <PricePage />;
}
