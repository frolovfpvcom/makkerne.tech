import type { Metadata } from "next";
import { ComparePage } from "@/components/pages";

export const metadata: Metadata = {
  title: "Os og de andre",
  description: "Sådan står Makkerne i forhold til et webbureau, et abonnement hos et webfirma og at bygge siden selv: pris, binding, hvem der ejer siden, og hvor meget af din tid det tager.",
};

export default function Page() {
  return <ComparePage />;
}
