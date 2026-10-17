@AGENTS.md

# Design: sider der føles menneskelige, ikke AI-lavede

Fuld research, kilder, rubrik og brief-skabelon: `docs/human-centered-web-design.md`. Læs den før et nyt eksempel eller et redesign. Kortversionen:

## Før du koder
- Udfyld brief-skabelonen i docs: fag, kunde, hvad besøgende skal kunne, hvad der adskiller firmaet, hvilket rigtigt indhold der findes.
- Skriv én designsætning, og vælg 3–5 bærende greb. Hent farver og skrift fra fagets egne materialer (træ, tegl, kobber, maling), ikke fra vane. Hvert eksempel får sin egen retning; to eksempler må ikke dele font.
- Test for hvert valg: ville jeg have valgt det samme, hvis indholdet var et andet? Så er det en standard, ikke et valg.

## Undgå (AI-tegn)
- Tofarvet slogan-H1 ("Utæt? Stoppet? *Vi kommer i dag.*"), stjernepille i hero, tre ikon-punkter under knapperne, ens 2×2-kort med pil-knapper, zigzag af tekst og billede, fade-up på alt.
- Gradienter, glød, glas, emoji, vilkårlige radier og skygger, Inter/Space Grotesk som standard.
- Tomme superlativer ("høj kvalitet", "vi går aldrig på kompromis"), "ikke bare X, men Y", lister med præcis tre, anglicismer ("Løft dit…"), mange tankestreger.

## Gør i stedet
- Navngivne mennesker, rigtige opgaver med sted · år · størrelse, CVR, adresse, åbningstider, én konkret pris (fx besigtigelse med beløb), ventetid.
- Kort, jordnært dansk i "vi"/"jeg": praktiske instruktioner ("Ring, hvis det haster. Skriv, hvis opgaven er større.").
- Telefonnummer synligt og tryk-bart overalt; én primær handling pr. skærm.
- Hero-billedet indlæses straks (`loading="eager"`, `fetchPriority="high"`), aldrig lazy.

## Ærlighed (lov, ikke smag)
- Opfind aldrig anmeldelser, ratings, antal ("4,9 af 5 · 418 anmeldelser"), kundelogoer, garantier eller tal (EU Omnibus-direktivet, markedsføringsloven § 13).
- Demoer for fiktive firmaer: vedvarende banner "Firmaet er opdigtet", `noindex`, åbenlyst falske kontaktoplysninger (12 34 56 78, CVR 00 00 00 00 (eksempel)), anmeldelser kun som mærket eksempeltekst, og sæt aldrig navn på et stockfoto af en rigtig person (mærk det som pladsholder).
- Stjerners `aria-label` skal svare til den viste værdi.

## Efter du har kodet
- Kør tjeklisten og rubrikken i docs på det renderede site (360, 768, 1280 px). Indholdsærlighed og tilgængelighed skal være mindst 3; ét opdigtet tal stopper lanceringen.
