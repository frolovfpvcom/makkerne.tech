import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section } from "@/components/legal";
import { TEAM } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privatliv og cookies",
  description: "Hvilke oplysninger Makkerne har om dig, hvorfor, og hvor længe. Siden bruger ingen cookies og ingen sporing.",
};

const sections = [
  { id: "hvem", title: "Hvem er ansvarlig" },
  { id: "cookies", title: "Cookies" },
  { id: "mail", title: "Når du skriver til os" },
  { id: "kontaktet", title: "Hvis vi har skrevet til dig" },
  { id: "kunder", title: "Når du er kunde" },
  { id: "hvem-ser", title: "Hvem ser oplysningerne" },
  { id: "rettigheder", title: "Dine rettigheder" },
];

export default function Page() {
  return (
    <LegalPage
      title="Privatliv og cookies"
      lead="Hvilke oplysninger vi har om dig, hvorfor vi har dem, og hvornår vi sletter dem."
      updated="21. oktober 2026"
      sections={sections}
      brief={[
        "Siden sætter ingen cookies og har ingen statistik, annoncer eller sporing. Vi spørger alligevel, hver gang du åbner siden, så du selv bestemmer.",
        "Skifter du sprog til engelsk, husker din browser valget. Det bliver hos dig.",
        "Vi kender kun det, du selv skriver til os på mail.",
        "Vi sælger og deler ikke dine oplysninger.",
      ]}
    >
      <Section id="hvem" title="Hvem er ansvarlig">
        <p>
          Makkerne er dataansvarlig for de oplysninger, vi har om dig. Makkerne drives af Peter Frolov og Nikolaj Blond.
        </p>
        <p>
          Har du spørgsmål, så skriv til en af os:
        </p>
        <ul className="!list-none !pl-0">
          {TEAM.map((p) => (
            <li key={p.email} className="flex flex-wrap gap-x-3 !pl-0">
              <span className="w-16 font-medium">{p.name}</span>
              <a href={`mailto:${p.email}`} className="whitespace-nowrap">
                {p.email}
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="cookies" title="Cookies">
        <p>makkerne.tech sætter ingen cookies. Vi har ingen besøgsstatistik, ingen annoncer og ingen pixels fra Facebook, Google eller andre.</p>
        <p>
          Der er én ting, din browser gemmer: Trykker du på DA/EN øverst, husker den dit valg, så siden står på det rigtige sprog næste gang. Valget ligger kun i
          din egen browser (localStorage under navnet <code className="text-[15px]">makkerne-lang</code>), og vi kan ikke se det. Du sletter det ved at rydde
          data for siden i din browser. Vælger du "Kun det nødvendige" i boksen om cookies, sletter vi valget og gemmer det ikke igen, så længe siden er åben.
        </p>
        <p>Boksen om cookies kommer frem, hver gang du åbner siden. Vi gemmer ikke dit svar, for så skulle vi gemme noget hos dig.</p>
        <p>
          Skrifttyper og billeder henter siden fra vores egen server. Din browser kontakter altså ikke Google Fonts, Unsplash eller andre, når du besøger os.
          Formularerne på eksempelsiderne er kun til at se på og sender ingenting.
        </p>
        <p>
          Siden ligger hos hostingfirmaet Vercel. Som alle webservere registrerer Vercel din IP-adresse og hvilke sider, der bliver hentet, for at kunne levere
          siden og stoppe angreb. Vercel gemmer det kun i kort tid, og vi bruger det ikke til at finde ud af, hvem du er.
        </p>
      </Section>

      <Section id="mail" title="Når du skriver til os">
        <p>
          Skriver du til os, får vi det, du sender: dit navn, firmanavn, mail og telefonnummer, hvad du skriver, og de billeder, du sender med. Vi bruger det til at
          svare dig, lave dit udkast og give dig et tilbud.
        </p>
        <p>
          Grundlaget er, at du selv har bedt om det (databeskyttelsesforordningens art. 6, stk. 1, litra b). Bliver vi ikke enige om en aftale, sletter vi
          mailtråden og dit udkast senest 12 måneder efter, vi sidst har hørt fra dig. Du kan altid bede os slette det før.
        </p>
      </Section>

      <Section id="kontaktet" title="Hvis vi har skrevet til dig">
        <p>
          Har du fået en mail fra os uden at have skrevet først, har vi fundet din firmamail på din hjemmeside eller i CVR-registret. Vi bruger den kun til at
          spørge, om du kunne bruge en ny hjemmeside.
        </p>
        <p>
          Grundlaget er vores interesse i at fortælle firmaer om det, vi laver (art. 6, stk. 1, litra f). Siger du nej tak, skriver vi ikke igen. Vi gemmer kun
          din mailadresse på en liste over dem, vi ikke må kontakte, så du ikke får en mail mere fra os.
        </p>
      </Section>

      <Section id="kunder" title="Når du er kunde">
        <p>
          Bliver du kunde, gemmer vi de oplysninger, vi skal bruge for at lave og drive din side og sende fakturaer. Vi gemmer dem, så længe du er kunde. Fakturaer
          og andre regnskabsbilag gemmer vi i fem år efter regnskabsårets udløb, fordi bogføringsloven kræver det.
        </p>
        <p>
          Har din side en kontaktformular, behandler vi dine kunders henvendelser for dig. Det står under <Link href="/vilkaar/#databehandling">Vilkår</Link>.
        </p>
      </Section>

      <Section id="hvem-ser" title="Hvem ser oplysningerne">
        <p>Kun os to. Vi sælger ikke oplysninger og giver dem ikke videre til andre end dem her:</p>
        <ul>
          <li>Google, fordi vores mail ligger i Gmail.</li>
          <li>Vercel, som hoster makkerne.tech og vores kunders sider.</li>
          <li>Vores revisor og bogføringsprogram, når du er kunde.</li>
        </ul>
        <p>
          Google og Vercel er amerikanske firmaer, så oplysningerne kan blive behandlet i USA. Det sker på grundlag af EU-US Data Privacy Framework og EU-Kommissionens
          standardkontrakter.
        </p>
      </Section>

      <Section id="rettigheder" title="Dine rettigheder">
        <p>Du har ret til at:</p>
        <ul>
          <li>se de oplysninger, vi har om dig</li>
          <li>få rettet forkerte oplysninger</li>
          <li>få dine oplysninger slettet</li>
          <li>gøre indsigelse mod, at vi bruger dem, fx til at skrive til dig</li>
          <li>få dine oplysninger udleveret, så du kan tage dem med et andet sted hen</li>
        </ul>
        <p>Skriv til os, så svarer vi inden for en måned.</p>
        <p>
          Er du utilfreds med, hvordan vi behandler dine oplysninger, kan du klage til Datatilsynet på{" "}
          <a href="https://www.datatilsynet.dk" rel="noopener">
            datatilsynet.dk
          </a>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
