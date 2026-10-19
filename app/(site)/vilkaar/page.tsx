import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section } from "@/components/legal";
import { EMAIL } from "@/lib/content";

export const metadata: Metadata = {
  title: "Vilkår",
  description: "Vilkårene, når Makkerne laver og driver din hjemmeside: udkast, pris og betaling, ejerskab, drift og opsigelse.",
};

const sections = [
  { id: "hvem", title: "Hvem du handler med" },
  { id: "aftale", title: "Udkast og aftale" },
  { id: "betaling", title: "Pris og betaling" },
  { id: "indhold", title: "Dit indhold" },
  { id: "ejerskab", title: "Hvem ejer hvad" },
  { id: "drift", title: "Drift og opsigelse" },
  { id: "ansvar", title: "Fejl og ansvar" },
  { id: "databehandling", title: "Persondata på din side" },
  { id: "tvister", title: "Uenighed" },
];

export default function Page() {
  return (
    <LegalPage
      title="Vilkår"
      lead="Det her gælder, når vi laver og driver en hjemmeside for dit firma. Det står i almindeligt sprog, så du ved, hvad du siger ja til."
      updated="18. oktober 2026"
      sections={sections}
      brief={[
        "Udkastet er gratis. Du siger først ja, når du har set det.",
        "Prisen står i tilbuddet, vi sender dig, og den ændrer sig ikke undervejs.",
        "Domænet står i dit navn, og siden er din, når den er betalt.",
        "Drift kan opsiges med en måneds varsel. Der er ingen binding.",
        "Stopper du drift, får du en kopi af siden med, så du kan flytte den.",
      ]}
    >
      <Section id="hvem" title="Hvem du handler med">
        <p>
          Makkerne drives af Peter Frolov og Nikolaj Blond. Du fanger os på{" "}
          <a href={`mailto:${EMAIL}`} className="whitespace-nowrap">{EMAIL}</a>.
        </p>
        <p>Vi laver hjemmesider til firmaer. Vilkårene gælder for aftaler med erhvervskunder, ikke med privatpersoner.</p>
      </Section>

      <Section id="aftale" title="Udkast og aftale">
        <p>
          Når du skriver til os, laver vi et udkast til din side. Det koster ikke noget, og du forpligter dig ikke til noget ved at se det.
        </p>
        <p>
          Vil du have siden, sender vi et tilbud på mail. Det beskriver, hvor mange sider der er, hvad siden kan, prisen og den drift, du har valgt. Aftalen er
          indgået, når du skriver ja til tilbuddet. Tilbuddet gælder i 30 dage.
        </p>
      </Section>

      <Section id="betaling" title="Pris og betaling">
        <p>
          Priserne i <Link href="/pris/#beregner">prisberegneren</Link> er vejledende. Det er prisen i tilbuddet, der gælder. Alle priser er ekskl. moms.
        </p>
        <ul>
          <li>Siden betaler du én gang. Vi sender fakturaen, når du har godkendt siden, og den går live.</li>
          <li>Drift betaler du månedsvis forud. Den første måned starter, når siden går live.</li>
          <li>Betalingsfristen er 8 dage.</li>
        </ul>
        <p>
          Betaler du for sent, sender vi en rykker. Er en faktura stadig ikke betalt 30 dage efter forfald, kan vi sætte siden på pause, til den er betalt.
          Vi giver dig besked, før vi gør det.
        </p>
      </Section>

      <Section id="indhold" title="Dit indhold">
        <p>
          Du sender os det, vi skal bruge: hvad du laver, billeder af dit arbejde og dit logo, hvis du har et. Vi skriver teksterne ud fra det, og du godkender
          siden, før den går live.
        </p>
        <p>
          Du skal selv have ret til de billeder og tekster, du sender. Du står også inde for, at oplysningerne om dit firma er rigtige, fx priser, autorisation,
          garantier og anmeldelser.
        </p>
        <p>
          Vi retter til, indtil du er tilfreds med udkastet. Når siden er live, er små rettelser med i drift. Større ændringer, fx nye sider eller funktioner,
          aftaler vi en pris på, før vi går i gang.
        </p>
      </Section>

      <Section id="ejerskab" title="Hvem ejer hvad">
        <ul>
          <li>Domænet registreres i dit navn. Har du allerede et, flytter vi det over. Du ejer det altid selv.</li>
          <li>Tekster, billeder og logo, du har sendt os, er dine.</li>
          <li>Når siden er betalt, må du bruge den, som du vil, også uden os.</li>
          <li>Stopper du drift, får du en kopi af siden og hjælp til at flytte domænet.</li>
        </ul>
        <p>Vi viser kun din side som eksempel på vores arbejde, hvis du siger ja til det.</p>
      </Section>

      <Section id="drift" title="Drift og opsigelse">
        <p>
          Drift dækker hosting, sikkerhed, en kopi af siden hver nat og én lille rettelse om måneden. Med Drift og administration retter vi også tekst, priser og
          billeder, når du beder om det (op til en time om måneden), lægger nye billeder op og holder din Google-profil opdateret. Hvad din pakke dækker, står i tilbuddet.
        </p>
        <p>
          Der er ingen binding. Du kan opsige drift med en måneds varsel til udgangen af en måned. Send en mail, så er det nok. Vi kan selv opsige med tre måneders
          varsel.
        </p>
        <p>
          Siden ligger hos hostingfirmaet Vercel. Vi gør, hvad vi kan, for at den altid er oppe, men vi kan ikke love, at den aldrig er nede et øjeblik.
        </p>
      </Section>

      <Section id="ansvar" title="Fejl og ansvar">
        <p>Er der en fejl i noget, vi har lavet, retter vi den gratis, så snart vi kan.</p>
        <p>
          Vi er ikke ansvarlige for indirekte tab, fx tabte opgaver eller omsætning, hvis siden er nede. Vi er heller ikke ansvarlige for nedbrud hos andre, som
          siden er afhængig af, fx hosting, domæneudbyder eller Google. Vores samlede ansvar kan ikke blive højere end det, du har betalt for siden og de seneste
          12 måneders drift.
        </p>
      </Section>

      <Section id="databehandling" title="Persondata på din side">
        <p>
          Har din side en kontaktformular, er det dig, der er dataansvarlig for de henvendelser, dine kunder sender. Vi er databehandler. Det betyder:
        </p>
        <ul>
          <li>Vi bruger kun oplysningerne til at drive siden og sende henvendelserne videre til din mail.</li>
          <li>Vi bruger Vercel til hosting og deler ikke oplysningerne med andre.</li>
          <li>De, der arbejder med siden, har tavshedspligt.</li>
          <li>Vi hjælper dig, hvis en kunde vil se eller have slettet sine oplysninger, og vi siger til med det samme, hvis der sker et brud på sikkerheden.</li>
          <li>Når aftalen slutter, sletter vi de oplysninger, vi har om dine kunder.</li>
        </ul>
        <p>Punkterne her er vores databehandleraftale med dig.</p>
      </Section>

      <Section id="tvister" title="Uenighed">
        <p>
          Er du utilfreds, så skriv til os først. Kan vi ikke blive enige, gælder dansk ret, og sagen afgøres ved de danske domstole.
        </p>
        <p>
          Hvordan vi behandler dine egne oplysninger, står under <Link href="/privatliv/">Privatliv og cookies</Link>.
        </p>
      </Section>
    </LegalPage>
  );
}
