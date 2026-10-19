# makkerne.tech

Forsiden og menusiderne til Makkerne (Next.js 16, Tailwind 4).

- `/` – hero, live eksempler i bokse mens man scroller, pris, forløb, spørgsmål og kontakt
- `/eksempler/`, `/pris/`, `/proces/`, `/faq/` – hvert menupunkt som sin egen side
- Al tekst (dansk og engelsk) ligger i `lib/content.ts`

## Eksempelsiderne

Fire interaktive eksempelsider til håndværkere ligger i appen selv og vises live i boksene på forsiden:

- `/examples/vvs/` – Holm VVS (`components/examples/vvs.tsx`)
- `/examples/tomrer/` – Egholm Tømrer & Snedker (`components/examples/tomrer.tsx`)
- `/examples/maler/` – Malerfirmaet Kulør (`components/examples/maler.tsx`)
- `/examples/tag/` – Tagværk, tag og tømrer, bygget efter bedre-tag.dk (`components/examples/tag.tsx`)

Fælles byggeklodser (før/efter-slider, tilbudsformular, tjek af område) ligger i `components/examples/shared.tsx`.
Billederne er Unsplash-fotos, gemt i `public/examples/photos/` i fem bredder, så en telefon får et billede i telefonstørrelse. Skærmbillederne af eksemplerne (`public/examples/shots/`) vises straks i telefonen på forsiden og på /eksempelsider/, mens den levende side hentes bagved. Begge laves af GitHub-workflowet "Example screenshots" (`scripts/photos.mjs`, `scripts/shots.mjs`); kør det igen, når et eksempel ændres. Et nyt foto, der ikke er gemt endnu, hentes stadig gennem Next' billedoptimering. Workflowet "Example speed" (`scripts/perf.mjs`) måler, hvor hurtigt eksemplerne vises på den live side.

## Kør lokalt

```bash
npm install
npm run dev
```
