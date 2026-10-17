import type { Metadata } from "next";
import { ExamplesPage } from "@/components/pages";

export const metadata: Metadata = {
  title: "Eksempler",
  description: "Se Makkernes eksempler: hjemmesider til VVS'ere, tømrere, malere, tagfirmaer, elektrikere, murere, gulvfolk, fugefolk, anlægsgartnere og smede.",
};

export default function Page() {
  return <ExamplesPage />;
}
