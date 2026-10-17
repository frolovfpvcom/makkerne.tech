# Specifikke fakta fjerner AI-præget fra håndværkersider

En AI-lavet hjemmeside virker menneskeligt designet, når hvert valg kan føres tilbage til netop denne virksomhed, og når indholdet består af ting, en fremmed kan tjekke. Det betyder mere end skrifttypen eller farven. Værktøjsproducenterne forklarer selv, hvorfor AI-sider ligner hinanden: modellerne rammer midten af træningsdataene, og de leveres med de samme standardkomponenter, så den gennemsnitlige landingsside kommer ud, når ingen styrer dem ([Anthropic](https://claude.com/resources/articles/improving-frontend-design-through-skills); [Vercel v0](https://v0.app/docs/design-systems)). En forskningsartikel fra juli 2026 viser desuden, at de værste fejl er funktionelle: fire ud af fem AI-værktøjer scorede 0,06 eller derunder på grundlæggende brugbarhedsprincipper ([Design Theater, arXiv](https://arxiv.org/abs/2607.22928)). For danske håndværkere er konklusionen enkel. Feltet er svagt og ensartet, med bynavne-H1'ere, "uforpligtende tilbud" og tomme superlativer. En side med mesterens navn og ansigt, billeder af rigtige opgaver med sted og årstal, CVR, adresse, én konkret pris og anmeldelser fra en navngiven platform skiller sig derfor ud uden smart design. Fra kunderne ved vi, at **67 % vælger efter kvalitet og kun 18 % efter pris** ([TEKNIQ](https://www.tekniq.dk/pressemeddelelser/2021/oktober/vi-bruger-mund-til-mund-metoden-naar-der-skal-vaelges-haandvaerker/)), og at **68 % siger, at Byg Garanti betyder noget for valget** ([DI Byggeri](https://www.danskindustri.dk/brancher/di-byggeri/nyheder/arkiv/nyheder/2026/2/tilvalg-af-byg-garanti-tiltrakker-forbrugerkunder/)). For Makkernes eksempelsider sætter loven den hårde grænse. Opdigtede anmeldelser og tal er sortlistet i EU og i strid med markedsføringslovens dokumentationskrav ([EUR-Lex](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32019L2161); [markedsføringsloven § 13](https://danskelove.dk/markedsf%C3%B8ringsloven/13)). Demoerne skal derfor føles ægte gennem håndværkerens eget sprog, realistiske priser og en troværdig proces, ikke gennem falsk bevis. Kodebasen har i dag "4,9 af 5 · 418 anmeldelser på Google" på flere fiktive sider, og det er det første, der bør laves om.

## Sådan læses rapporten: evidensmærker og begrænsninger

Rapporten skelner hele vejen mellem fem slags belæg. **[Standard]** er normativ tekst fra W3C, browserspecifikationer eller Googles Core Web Vitals. **[Forskning]** er målte studier og eyetracking. **[Lov/myndighed]** er EU-direktiver, dansk lov og myndighedsvejledninger. **[Konvention]** er ekspertpraksis fra stilguides og designsystemer, som ikke bygger på et studie. **[Praktiker]** er navngivne praktikeres eller bureauers lister, ofte med kommercielt motiv. Det, der står som **[Vurdering]**, er rapportens egen syntese eller designsmag. Det er brugbart som arbejdsregel, men det er ikke dokumenteret.

Der er tre begrænsninger, man skal kende. Research-teamet kunne ikke rendere sider, tage skærmbilleder eller hente CSS, fordi sandkassens proxy blokerede direkte download. Skrifttyper og farver på casesiderne er derfor kun bekræftet, hvor siden selv eller en udgivet kilde nævner dem, og mobiladfærd er ikke testet visuelt. Den mest citerede optælling af "AI-tegn" (Krebs) har ingen dokumenteret metode. Og meget af tillidsforskningen er gammel (2002, 2010, 2016), selv om NN/g vurderer, at faktorerne har holdt sig stabile. Rapporten bygger også på en kort gennemgang af makkerne.tech-kodebasen (Next.js 16.3.8, Tailwind 4, framer-motion, seks eksempelsider under `app/examples/`), lavet den 17. oktober 2026. De iagttagelser er markeret som sådan.

## Resumé: syv fund, der styrer resten

**Det første fund er, at genkendeligt AI-design er fravalg, ikke stil.** Anthropic kalder fænomenet "distributional convergence": sikre valg, der "work universally and offend no one", dominerer træningsdataene, og uden vejledning trækker modellen fra "this high-probability center" ([Anthropic](https://claude.com/resources/articles/improving-frontend-design-through-skills)). Anthropics egen skill-fil siger det ligeud: træk som creme-baggrund med serif eller afrundede kort er "legitimate for some briefs, but they are defaults rather than choices" ([frontend-design SKILL.md](https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md)). Testen for ethvert element er derfor: ville jeg have valgt det samme, hvis indholdet var et andet? Hvis svaret er ja, er det en standard og ikke et valg.

**Det andet fund er, at et forbud blot flytter gennemsnittet.** Anthropic bemærkede i november 2025, at modellerne konvergerede mod Space Grotesk, selv efter at de var styret væk fra Inter, og i 2026 står netop Space Grotesk på listerne over "slop fonts" ([Anthropic](https://claude.com/resources/articles/improving-frontend-design-through-skills); [Krebs](https://www.adriankrebs.ch/design-slop-report.html)). Den holdbare regel er at udlede valget af emnet, ikke at udskifte font X med font Y.

**Det tredje fund er, at de alvorligste AI-fejl er funktionelle.** I Design Theater-studiet med 120 grænseflader fra ChatGPT, Claude, Firebase Studio, v0 og Bolt blev cirka 25 % af værktøjernes egne designbegrundelser aldrig implementeret. De oftest oversete principper var synlig systemstatus, brugerkontrol og fejlhåndtering ([arXiv 2607.22928](https://arxiv.org/abs/2607.22928)).

**Det fjerde fund er, at billeder skal bære information.** Brugere ignorerer generiske stockbilleder af mennesker, men studerer rigtige medarbejderportrætter. På FreshBooks brugte en testperson 10 % mere tid på portrætterne end på bioteksterne, selv om teksterne fyldte 316 % mere ([NN/g](https://www.nngroup.com/articles/photos-as-web-content/)). Et NN/g-studie fra august 2026 fandt ingen tillidsstraf for AI-billeder sammenlignet med stock ved et førstehåndsindtryk på 10 sekunder. Konklusionen var, at "the source of an image matters less than whether the image works for its intended context" ([NN/g](https://nngroup.com/articles/ai-generated-images)).

**Det femte fund er, at marketingsprog koster.** I NN/g's klassiske studie forbedrede objektivt sprog brugbarheden med 27 %, og kort, skimbar og objektiv tekst tilsammen med 124 % ([NN/g](https://www.nngroup.com/articles/how-users-read-on-the-web/)). Stanfords retningslinjer beder om "a clear, sincere style" og ingen fejl ([Stanford](https://credibility.stanford.edu/guidelines/index.html)).

**Det sjette fund er, at danske håndværkersider vindes på verificerbare detaljer.** Det gælder et navngivet menneske, rigtige opgaver med sted og år, CVR og adresse, en konkret pris og anmeldelser fra en ekstern platform. De fleste sider i stikprøven manglede det meste af dette.

**Det syvende fund er, at ærlighed er et juridisk krav.** Falske anmeldelser er sortlistet i EU, og enhver faktuel påstand skal kunne dokumenteres i Danmark ([EUR-Lex](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32019L2161); [§ 13](https://danskelove.dk/markedsf%C3%B8ringsloven/13)). En demoside skal være tydeligt fiktiv og føles ægte gennem specificitet, ikke gennem opdigtet bevis.

## AI-design ligner hinanden, fordi ingen har truffet et valg

Tre årsager forstærker hinanden. Den første er **træningsdataenes tyngdepunkt**. Det mest kopierede webdesign på nettet er SaaS-skabeloner og demoer fra Tailwind UI og shadcn/ui. Tailwinds medstifter Adam Wathan undskyldte i august 2025 offentligt for at have givet "every button in Tailwind UI" farven `bg-indigo-500` fem år tidligere, og det blev bredt læst som forklaringen på, hvorfor AI-grænseflader er lilla ([AIBase](https://news.aibase.com/news/20365)). Den anden årsag er **værktøjskædens standarder**. Vercel skriver, at v0 bruger shadcn/ui som standard og "is specifically trained on the default implementations" af komponenterne ([v0 docs](https://v0.app/docs/design-systems)). Tailwinds standardskygge `shadow-lg` er en neutral sort på 10 % opacitet ([Tailwind](https://tailwindcss.com/docs/box-shadow)). Uberørte tokens er altså selve looket. Den tredje årsag er **manglende kontekst**. Uden brand, målgruppe og rigtigt indhold udfylder modellen hullerne med gennemsnittet. NN/g beskriver, at en vag prompt som "Build me a trip planner" gav noget "functional but generic", og nævner "random layout choices that don't quite make sense" og "visual complexity without clear purpose" som synlige tegn ([NN/g](https://nngroup.com/articles/genui-vs-vibe)).

Design Theater-studiet fra Northeastern University m.fl. målte desuden, hvor ens værktøjerne er. Ensartetheden var størst i visuelt udtryk og layout, og farve varierede mest. Claude og v0 lå visuelt tættest på hinanden ([arXiv 2607.22928](https://arxiv.org/abs/2607.22928)). Studiet har ingen menneskeskabt sammenligningsgruppe, så det måler konvergens mellem værktøjerne, ikke afstand til professionel praksis. Titlen henviser til, at værktøjerne præsenterer ens resultater med selvsikre begrundelser om, at de er skræddersyede.

Adrian Krebs' optælling af omtrent 500 sider giver et fingerpeg om, hvor udbredte mønstrene er. Tallene er nyttige som rangorden, men metode, kilde og dato er ikke dokumenteret ([Krebs](https://www.adriankrebs.ch/design-slop-report.html)).

| Mønster (Krebs, metode udokumenteret) | Andel af sider |
|---|---|
| Gradient-hero eller gradient-tekst | 28,0 % |
| Uændrede shadcn/ui-standarder | 23,5 % |
| Centreret hero i Inter eller generisk sans | 23,5 % |
| Permanent mørkt tema | 20,3 % |
| Skabelonagtigt feature-gitter | 20,1 % |
| Glassmorphism | 17,1 % |
| "Slop fonts" (Space Grotesk, Instrument Serif, Geist, Syne, Fraunces) | 15,8 % |
| Accentstribe på kort | 13,0 % |
| Statistikbånd | 12,2 % |
| Indigo/violet CTA | 10,7 % |

Siden midten af 2026 har praktikerne beskrevet en **anden bølge** af tegn. Det er de standarder, modellerne falder tilbage på, når den første bølge er forbudt. Anthropics skill-fil, opdateret 3. september 2026 ifølge Capital & Compute, nævner fem standardlooks: varm creme med højkontrast-serif og terrakotta-accent, næsten-sort med én skarp accent, "broadsheet"-layout med hårstreger og tætte spalter, "SaaS card kit" og "template chrome" med versal-eyebrows, midterpunkt-metastrenge og pile på alle links. Filen bemærker, at terrakotta-accenten er Anthropics egen Claude-farve, så "on a user's brief it reads as a tell" ([SKILL.md](https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md); [Capital & Compute](https://capitalandcompute.net/blog/fix-ai-slop-design/)). Creative Bloq påpeger, at ensartetheden er ældre end AI og stammer fra big tech-designsystemer og luksusbrandenes "blanding". AI forstærker den, fordi output fodrer fremtidig træning ([Creative Bloq](https://www.creativebloq.com/ai/everything-looks-the-same-now-what)).

**[Vurdering]** Det giver en vigtig skelnen. Et "AI-tegn" beviser ikke, at en model har lavet siden. Open source-listen avoid-ai-design formulerer det sådan, at et tegn er "evidence of a default nobody chose, never proof that a model made the page" ([avoid-ai-design](https://github.com/funboy322/avoid-ai-design)). Formålet er ikke at skjule AI, men at sikre, at nogen har truffet valgene.

## Tretten mønstre, og hvornår de faktisk er i orden

Hvert mønster herunder gennemgås på fem punkter: hvorfor det opstår, hvorfor det virker kunstigt, hvornår det er i orden, hvad en dygtig designer gør, og en regel, der kan håndhæves i kode-review. Årsagerne er dokumenteret med kilder. Reglerne er **[Vurdering]**, medmindre andet står.

### A. Centreret hero med generisk undertitel og to knapper

**Årsag:** Det er den mest almindelige landingsskabelon i træningsdataene. Capital & Compute kalder rækkefølgen "centred hero, pill badge, two buttons, logo row, three feature cards" for sidens standardrækkefølge ([Capital & Compute](https://capitalandcompute.net/blog/fix-ai-slop-design/)). **Kunstigt fordi:** Den er uafhængig af indholdet og kunne stå foran et hvilket som helst produkt, ofte med vage overskrifter som "Scale without limits" ([925Studios](https://www.925studios.co/blog/ai-slop-web-design-guide)). **I orden når:** Siden har én handling, fx en tilmelding til et arrangement. **En designer:** Begynder med "the most characteristic thing in the product's world" ([Capital & Compute](https://capitalandcompute.net/blog/fix-ai-slop-design/)). For en håndværker er det et rigtigt billede fra en opgave, mesterens ansigt eller en prisliste. Designeren beslutter justeringen bevidst og skitserer alternativer ([SKILL.md](https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md)). **Regel:** H1 skal indeholde et navneord, der kun passer på denne virksomhed, og den fejler, hvis den ville være sand på konkurrentens side. Der er højst én primær CTA, og en sekundær kun, hvis den dækker en anden hensigt ("Ring 22 27 44 05" ved siden af "Book besigtigelse"). Ingen pille-badge, medmindre den linker til en dateret, rigtig nyhed.

### B. Lilla og blå gradienter, glød, glas og blobs

**Årsag:** Tailwind UI's indigo og modellernes sandsynlighedsmidte ([AIBase](https://news.aibase.com/news/20365); [Anthropic](https://claude.com/resources/articles/improving-frontend-design-through-skills)). **Kunstigt fordi:** Farven har ingen relation til brandet, og effekterne pynter uden at betyde noget. Anthropic skriver, at "dominant colors with sharp accents outperform timid, evenly-distributed palettes". **I orden når:** Brandet faktisk er lilla, eller glasset ligger over et rigtigt billede eller kort, hvor dybden betyder noget ([Capital & Compute](https://capitalandcompute.net/blog/fix-ai-slop-design/)). **En designer:** Definerer 4–6 navngivne hex-værdier med roller ([SKILL.md](https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md)) og henter paletten fra produktets materialer. **Regel:** Ingen rå `indigo-*`, `violet-*`, `purple-*` eller `blue-600` i klasser, medmindre brandet har den farve. Ingen `bg-clip-text`-gradientoverskrifter, `backdrop-blur` højst én gang pr. side og ingen dekorative blur-blobs.

### C. Generisk typografi og standard-typeskalaer

**Årsag:** Inter, Roboto og systemfonte er standard, og selv styrede modeller ender på samme håndfuld ([Anthropic](https://claude.com/resources/articles/improving-frontend-design-through-skills)). **Kunstigt fordi:** "Typography instantly signals quality" (samme kilde). En font, som ingen har valgt, ligner en side uden stil. **I orden når:** Det drejer sig om tæt produkt-UI og dashboards. Linear bruger Inter og Inter Display, og det fungerer, fordi det er et system med to optiske snit og ikke et fravalg ([Linear](https://linear.app/now/how-we-redesigned-the-linear-ui)). **En designer:** Vælger én familie eller to tydeligt forskellige "for the subject, not from habit" og holder linjer under ca. 80 tegn ([SKILL.md](https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md)). **Regel:** Fonte erklæres ét sted i tokens med en skriftlig begrundelse knyttet til faget. Kode-review søger efter Inter, Space Grotesk, Instrument Serif, Fraunces, Geist og Syne og kræver begrundelse. Typeskalaen er tokens og ikke ad hoc `text-*` pr. sektion.

### D. Ens kortgitre og kort inde i kort

**Årsag:** shadcn's Card-standard, som Anthropic kalder "SaaS card kit" ([SKILL.md](https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md)). **Kunstigt fordi:** Strukturen er valgt, før indholdet var der. **I orden når:** Elementerne er reelt parallelle: produkter, medarbejdere, prisniveauer. **En designer:** Bruger rækker eller tabeller til tabeldata og varierer radius og elevation efter hierarki. "Don't wrap everything in cards or nest cards inside cards" ([Impeccable](https://github.com/pbakaus/impeccable)). **Regel:** Aldrig kort i kort. Kort kun til mindst tre ligeværdige elementer med samme felter. Er de ikke lige vigtige, skal de have forskellig størrelse eller behandling. NN/g anbefaler også at bruge containere "sparingly", fordi de giver rod ([NN/g](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/)).

### E. Forudsigelig zigzag af tekst og billede

**Årsag:** Hører under "predictable layouts" og "zero asymmetry" ([Anthropic](https://claude.com/resources/articles/improving-frontend-design-through-skills); [avoid-ai-design](https://github.com/funboy322/avoid-ai-design)). Der er ingen selvstændig forskning i mønsteret. **Kunstigt fordi:** Rytmen er mekanisk og siger intet om, hvad der er vigtigst. **I orden når:** Det er en reel trin-for-trin-proces med et rigtigt billede af hvert trin. **En designer:** Lader sektionernes rækkefølge følge kundens spørgsmål og varierer én dimension ad gangen. **Regel:** Højst to zigzag-skift i træk. Sektionsrækkefølgen begrundes i kundens spørgsmål: hvad laver de, hvad koster det, hvor, kan jeg stole på dem, hvordan kontakter jeg dem.

### F. Stockfotos, AI-billeder og pladsholder-avatarer

**Årsag:** Når der ikke findes rigtigt materiale, fylder værktøjet ud. **Kunstigt fordi:** Brugere "ignore fluffy pictures used to 'jazz up' web pages" ([NN/g](https://www.nngroup.com/articles/photos-as-web-content/)). Et eksperiment med 2.400 deltagere fandt, at stockfotos sænkede den opfattede troværdighed, om end effekten var lille ([Salminen m.fl. 2020](https://ciencia.iscte-iul.pt/id/ci-pub-61720)). Mistanke om AI sænkede vurderingerne, også når billedet faktisk var ægte ([NN/g 2026](https://nngroup.com/articles/ai-generated-images)). **I orden når:** Licenseret stock bruges til abstrakt tekstur og aldrig som "vores team" eller "vores kunder". **En designer:** Viser "photos of the full service process and the people doing the work, not just end results" ([NN/g](https://www.nngroup.com/articles/trustworthy-design/)). **Regel:** Ingen stock-mennesker præsenteret som virksomhedens folk, ingen DiceBear- eller initial-avatarer ved udtalelser, og alt-tekst beskriver det faktiske billede.

### G. Meningsløse ikoner, badges, labels og emoji

**Årsag:** Lucide-ikoner i afrundede firkanter, eyebrow-labels og pile på alle links er standarddele i skabelonerne ([avoid-ai-design](https://github.com/funboy322/avoid-ai-design); [Impeccable](https://github.com/pbakaus/impeccable)). **Kunstigt fordi:** Strukturelle tegn burde "carry information, not decoration" ([SKILL.md](https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md)). **I orden når:** Ikonet hjælper genkendelse (telefon, kortnål, ur), labels er rigtig navigation eller kategori, og nummerering markerer en reel rækkefølge. **En designer:** Fjerner alt, der ikke formidler et faktum. **Regel:** Ingen ikon-i-firkant over hver feature, ingen Sparkles- eller Zap-ikoner, ingen emoji som punkttegn eller i navigationen og ingen nummerering af ting, der ikke er en sekvens.

### H. Vilkårlige radier og skygger

**Årsag:** `rounded-2xl shadow-lg` på alt, med samme sorte skygge overalt ([avoid-ai-design](https://github.com/funboy322/avoid-ai-design); [Tailwind](https://tailwindcss.com/docs/box-shadow)). **Kunstigt fordi:** Elevation skal betyde noget, og når alt er hævet, betyder intet noget. **I orden når:** Et lag faktisk ligger over et andet, fx en dialog eller en menu. **En designer:** Bruger tonede skygger og sorte farver ("always tint", [Impeccable](https://github.com/pbakaus/impeccable)) og højst tre elevationsniveauer med betydning. **Regel:** Radius og skygge kommer fra tokens med niveauerne fladt, hævet og overlay. Review markerer gentagne `rounded-2xl` sammen med `shadow-lg` på samme element.

### I. Whitespace uden komposition og ensartet spacing

**Årsag:** Uniform `gap-4` og `p-6` uden rumligt hierarki ([avoid-ai-design](https://github.com/funboy322/avoid-ai-design)) og ens polstring og korthøjder ([925Studios](https://www.925studios.co/blog/ai-slop-web-design-guide)). **Kunstigt fordi:** Nærhed er det, der fortæller øjet, hvad der hører sammen. Elementer tæt på hinanden læses som én gruppe ([NN/g, proximity](https://www.nngroup.com/videos/proximity-gestalt/)). Ensartet afstand udvisker grupperne. **I orden når:** Elementerne faktisk er ligeværdige. **En designer:** Lader afstanden inde i en gruppe være tydeligt mindre end afstanden mellem grupper. **Regel:** Spacing kommer fra en skala af tokens. Review markerer identisk `py-24` på hver sektion, og sektionspolstring varierer med indholdets vægt.

### J. Falske udtalelser, opdigtede tal og generisk marketingsprog

**Årsag:** Modellen udfylder "social proof"-felter med sandsynlige tal. Selv en styret anti-slop-generering endte med "10,000% ROI" ([Capital & Compute](https://capitalandcompute.net/blog/fix-ai-slop-design/)). **Kunstigt fordi:** Brugere "detested 'marketese'" ([NN/g](https://www.nngroup.com/articles/how-users-read-on-the-web/)), og de stoler mere på eksterne kilder end på virksomhedens egne udtalelser ([NN/g](https://www.nngroup.com/articles/trustworthy-design/)). **I orden når:** Aldrig, hvis det er opdigtet. Rigtige, attribuerede udtalelser med samtykke er fine. **En designer:** Bruger dokumenterbare tal og linker til kilden. **Regel:** Dette er en hård blokering. Hvert tal, hver udtalelse, hvert logo og hver rating skal have en kilde, som kunden kan fremvise. Der er ingen pladsholdertekst i produktion. En sprog-linter forbyder "Elevate", "Seamless", "Unlock", "Cutting-edge", "Best-in-class" og "Get Started" og de danske pendanter i afsnittet om håndværkere. Det er også et lovkrav (se afsnittet om demo-sider).

### K. Fade-up på alt ved scroll

**Årsag:** En standard-animationswrapper lægges på hver sektion. Anthropic advarer mod "fade-and-slide entrances on every section" ([SKILL.md](https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md)), og andre nævner tællende statistik og bounce-easing ([Capital & Compute](https://capitalandcompute.net/blog/fix-ai-slop-design/)). **Kunstigt fordi:** Bevægelsen hverken bekræfter, orienterer eller viser en tilstandsændring. Scroll-udløst bevægelse "can trigger vestibular disorders" ([W3C 2.3.3](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)). **I orden når:** Bevægelsen svarer på brugerens handling (åbne, bekræfte), hvilket Anthropic kalder "welcome". **En designer:** Laver højst ét orkestreret øjeblik ved sideindlæsning og giver ellers feedback på interaktion. **Regel:** Højst én ikke-interaktiv animation pr. side, alt pakket i `prefers-reduced-motion: no-preference`, intet indhold skjult indtil det scrolles ind, ingen count-up og ingen bounce.

### L. Moderigtigt, men uden relation til publikum

**Årsag:** Anden bølges standarder: creme, serif og terrakotta, eller mørkt med syregrøn accent og avisagtige hårstreger ([SKILL.md](https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md)). Hertil kommer det "overly polished but emotionally empty", som Creative Bloq beskriver som konkurrence på genkendelighed ([Creative Bloq](https://www.creativebloq.com/ai/everything-looks-the-same-now-what)). **Kunstigt fordi:** Stilen er lånt fra et andet felt. Avis-cosplay på en VVS-side signalerer redaktion, ikke rør. **I orden når:** Indholdet er redaktionelt ([Capital & Compute](https://capitalandcompute.net/blog/fix-ai-slop-design/)). **En designer:** Søger referencer uden for Dribbble og Behance, fx i bøger, film, arkitektur og ældre materialekultur ([Creative Bloq](https://www.creativebloq.com/ai/everything-looks-the-same-now-what)). For håndværkere findes de i værkstedet, varevognen og materialerne. **Regel:** Den visuelle retning skal kunne forklares i én sætning, der nævner faget eller kunden.

### M. Flot på skærmbilledet, ubrugelig i brug

**Årsag:** Modeller trænet på statisk kode overser validering og fejltilstande ([prg.sh](https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website)). Funktionelle principper var den største fejlkilde i Design Theater ([arXiv](https://arxiv.org/abs/2607.22928)). **Kunstigt fordi:** Døde hover-tilstande og knapper, der ikke reagerer, afslører, at ingen har brugt siden ([925Studios](https://www.925studios.co/blog/ai-slop-web-design-guide)). **I orden når:** Aldrig. **En designer:** Tester med rigtige opgaver. NN/g anbefaler at vurdere med brugertest og opgavegennemførelse, ikke med "det renderer" ([NN/g](https://nngroup.com/articles/genui-vs-vibe)). **Regel:** Alle interaktive elementer har hover, focus-visible, active og disabled. Formularer har labels, validering, fejl- og succestilstand. Telefon og adresse er rigtige `tel:`- og kortlinks. Siden testes ved 360 px bredde og kun med tastatur.

## Ti rigtige sider viser, at én stram idé bærer det hele

Casesiderne blev valgt for at dække både det udtryksfulde og det tilbageholdende og for at inkludere skandinaviske håndværks- og lokalvirksomheder. Typografi og farver er kun angivet, hvor de kunne bekræftes. Resten er markeret som ubekræftet.

| Side | Type | Det bærende greb | Hvad kan overføres |
|---|---|---|---|
| Locomotive | Udtryksfuldt bureau | Awwwards' Agency of the Year 2024; "What sets us and our work apart is people"; kulturarkiv 2017–2024 ([Awwwards](https://www.awwwards.com/annual-awards-2024/agency-of-the-year); [locomotive.ca](https://locomotive.ca/en)) | Studiets egen historie som designmateriale |
| Pentagram | Redaktionel portefølje | Aforismer ("Words have meaning. Type has spirit."), filtrérbart arkiv, "© 1972 – 2026" ([pentagram.com](https://www.pentagram.com)) | Daterede og placerede detaljer, der er svære at forfalske |
| teenage engineering | Udtryk gennem begrænsning | Al tekst med små bogstaver, butikstider og gadeadresse i Stockholm ([teenage.engineering](https://teenage.engineering)); monospace-påstand er ubekræftet ([Crosley](https://blakecrosley.com/guides/design/teenage-engineering)) | En stemmeregel uden undtagelser |
| Linear | Tilbageholdende SaaS | Rigtige UI-skærmbilleder mærket "Fig 0.1"; temaer fra tre variable i LCH; Inter og Inter Display ([linear.app](https://linear.app); [Linear blog](https://linear.app/now/how-we-redesigned-the-linear-ui)) | Få regler, holdt stramt |
| Aesop | Tilbageholdende premium | "No gradient, no gloss, no script, no rose gold"; tekst "like a label rather than an advertisement" ([FontAlternatives](https://fontalternatives.com/inspiration/aesop-suisse/)) | Tilbageholdenhed som brand |
| Kinfolk | Redaktionelt tilbageholdende | Ét stort foto og én stedspecifik dek pr. historie ([kinfolk.com](https://www.kinfolk.com)) | Billede plus præcis tekst |
| Garde Hvalsøe | Dansk snedker, premium | Projekter navngivet efter sted ("Hjem i Humlebæk"), krediterede fotografer, showroomadresse ([gardehvalsoe.dk](https://www.gardehvalsoe.dk)) | Opgaver med stednavn og ægte fotografi |
| Brdr. Krüger | Dansk møbelsnedker, arv | Navngivne grundlæggere, "five generations", fabrik i Værløse, sektion for professionelle ([brdr-kruger.com](https://brdr-kruger.com)) | Historie med navne og steder |
| Lille Bakery | Lille lokal bager | Åbningstider, adresse, "Kontrolrapport"-link til findsmiley.dk, leverandører fra Sjælland ([lillegrocery.com](https://www.lillegrocery.com/)) | Myndighedsbevis som tillidsmarkør |
| Åpent Bakeri | Norsk bager med 21 butikker | Navigation der viser driften (møtemat, dugnadskjeks, jobs), egne fotos ifølge filnavne ([apentbakeri.no](https://www.apentbakeri.no)) | Menuen fortæller, hvad firmaet laver |

**Den fælles tråd i den udtryksfulde ende** er, at stemmen er lige så art-directed som det visuelle. Locomotives emoji og "Freshness guaranteed", Pentagrams aforismer og teenage engineerings små bogstaver er hver især en regel uden undtagelse. **[Vurdering]** Konsekvent stemme er en stor del af det, der får en side til at føles som noget, et menneske har lavet.

**Den fælles tråd i den tilbageholdende ende** er, at tilbageholdenheden kommer fra et system og ikke fra tomhed. Linear reducerede sine temaer fra 98 variable til tre (base, accent, kontrast), holdt bevidst blåt ude af "chrome" og tilføjede en kontrastvariabel til tilgængelige højkontrasttemaer ([Linear](https://linear.app/now/how-we-redesigned-the-linear-ui)). Aesop forbeholder ifølge en tredjepartsanalyse serif'en til ordmærket. Det er ikke verificeret mod CSS ([FontAlternatives](https://fontalternatives.com/inspiration/aesop-suisse/)).

**Den skandinaviske tråd er mest relevant for Makkerne.** Håndværks- og lokalsiderne vinder tillid gennem ting, der kan tjekkes: gadeadresser, åbningsdage, navngivne projekter, grundlæggere med navne og årstal, lokale leverandører og et link til den officielle fødevarekontrol. Garde Hvalsøes billedfilnavne krediterer fotografer og en stylist, så billederne er bestilt og ikke købt. Der er også ru kanter. Lille har en tastefejl ("it's" for "its"), et rå booking-link og et navn med små bogstaver, men det læses som en side drevet af bagere og ikke af marketingfolk. **[Vurdering]** Målet er ikke at lægge fejl ind med vilje, men ru kanter må aldrig blive til ødelagt brugbarhed. Tre af de fire skandinaviske sider havde tom eller manglende alt-tekst ([brdr-kruger.com](https://brdr-kruger.com); [lillegrocery.com](https://www.lillegrocery.com/); [apentbakeri.no](https://www.apentbakeri.no)). Stærk art direction og tilgængelighed følges altså ikke automatisk ad.

**[Vurdering]** Ni principper kan overføres. Skriv én designsætning, før der designes, fx Aesops "etiket, ikke reklame" eller Garde Hvalsøes "Skabt til at bestå". Begræns systemet med vilje. Lad indholdet være art direction. Sæt tjekbare fakta forrest. Giv teksten en stemme med regler. Lad navigationen beskrive den rigtige forretning. Bevar lidt personlighed uden at ødelægge brugbarheden. Afvej udtryk mod opgave: et bureau sælger kreativitet og må bruge bevægelse, mens en tømrer skal bruge energien på fotografi og specificitet. Spring aldrig tilgængelighed over.

## Danske håndværkersider vindes på navne, steder, år og priser

### Feltet er så ensartet, at specificitet alene skiller sig ud

Ti rigtige danske håndværkersider blev læst den 17. oktober 2026. Det bedste eksempel var Tømrer/Snedkerfirma Mathias Winther ApS i Roskilde. Siden har gadeadresse og CVR, et billede af mesteren med alt-teksten "Mød Mathias - din tømrer i Roskilde", et galleri med billedtekster som "Tagudskiftning, Vindinge · 2024" og en video med teksten "Optaget på pladsen, ikke i et studie." Prisen er konkret: "Besigtigelse 1.237,50 kr. inkl. moms og kørsel i Roskilde-området - trækkes fra ved accept", og anmeldelserne kommer fra Anmeld-Håndværker.dk, linket som "uafhængig tredjepart" ([mathias-winther.dk](https://mathias-winther.dk/forside/)). Også her er der svagheder: generiske linjer som "Kundetilfredsheden er i top" og et statistikbånd med 4,9/5, der ikke nævner kilden.

Resten af feltet følger samme mønster. **Søgninger på "tømrer Roskilde", "VVS København" og "elektriker Herlev" giver side efter side med en dedikeret bynavneside og titler som "Tømrer Roskilde I Over 300 Opgaver Udført I Indhent Tilbud"**. Ni forskellige firmaer har hver en "/elektriker-herlev/"-side ([forsbi-byg.dk](https://forsbi-byg.dk/toemrer-roskilde/); [eviteq.dk](https://eviteq.dk/herlev/elektriker-herlev/); [mh-elektric.dk](https://mh-elektric.dk/elektriker-herlev/)). Masseproduktionen kan ses direkte. Tømrermester Ulriks side viser den urenderede pladsholder **"[acf field="bynavn"]"** i fire overskrifter ([tomrermesterulrik.dk](https://tomrermesterulrik.dk/toemrer-roskilde/)). HHR El-teknik's Herlev-side har billedfilen "elektriker-odense.jpeg", den samme sætning seks gange og anmeldelsestal opgivet som "+1025", "1000+", "1000" og "725" ([hhrel-teknik.dk](https://hhrel-teknik.dk/elektriker-herlev/)). Andre fejl går igen: tomme "Referencer"- og "Garanti"-sektioner, overskriften "Kontant" hvor der skulle stå "Kontakt", og alt-teksten "slider1" ([korupmalerforretning.dk](https://www.korupmalerforretning.dk/)), en Gmail-adresse som kontakt og påstanden "50+ anmeldelser", hvor der vises 12 ([tomrermesterulrik.dk](https://tomrermesterulrik.dk/toemrer-roskilde/)).

Konklusionen er praktisk. **[Vurdering]** Når konkurrenterne har modstridende fakta, skabelonfejl og ingen priser, vinder en side med konsekvente oplysninger, rigtige billeder og almindeligt dansk uden at skulle være visuelt dristig. Ingen af siderne i stikprøven nævnte håndværkerfradrag, og ingen el- eller VVS-side viste et autorisationsnummer. Begge dele er lette måder at skille sig ud på.

### Kunderne stoler på anbefalinger, garanti og professionelt indtryk

Danske boligejere vælger først og fremmest efter kvalitet. I TEKNIQ's YouGov-undersøgelse med over 1.600 boligejere sagde **67 % kvalitet og 18 % pris**. Anbefalinger fra andre vejer tungest efter det, og autorisation ligger lige under. Onlineanmeldelser betyder mindre end personlige anbefalinger ([TEKNIQ](https://www.tekniq.dk/pressemeddelelser/2021/oktober/vi-bruger-mund-til-mund-metoden-naar-der-skal-vaelges-haandvaerker/)). Konkurrence- og Forbrugerstyrelsens undersøgelse (n=1.160) giver en rangorden for, hvad der betød noget ved valget:

| Begrundelse for valg af håndværker (KFST 2018) | Andel |
|---|---|
| Virkede professionel | 41,8 % |
| Kendte håndværkeren i forvejen | 39,2 % |
| Specialist på området | 35,4 % |
| Kunne udføre opgaven hurtigt | 28,8 % |
| Anbefalet af familie/venner | 21,1 % |
| Medlem af garantiordning | 20,0 % |
| Lav pris | 19,7 % |
| Medlem af brancheforening | 12,0 % |

Kilde: [KFST](https://kfst.dk/media/53650/20190125-forbrugerundersoegelse-haandvaerkerydelser.pdf).

Samme undersøgelse viser, at **45,5 % kun fik tilbud fra det firma, de valgte, og 25,8 % fik slet intet tilbud** ([KFST](https://kfst.dk/media/53650/20190125-forbrugerundersoegelse-haandvaerkerydelser.pdf)). Mange kunder sammenligner altså ikke. **[Vurdering]** En side, der gør det let at ringe eller booke og fjerner usikkerhed om pris, svartid og hvem der kommer, kan vinde opgaven direkte. "Virkede professionel" er det hyppigste svar. Det er det tætteste, undersøgelsen kommer på design, og det passer med Stanford-studiet, hvor "design look" blev nævnt i 46,1 % af kommentarerne om troværdighed ([Consumer Reports/Fogg](https://advocacy.consumerreports.org/research/how-do-people-evaluate-a-web-sites-credibility)).

Myndigheder og forbrugerorganisationer giver kunderne en tjekliste, som siden bør besvare på forhånd. Forbrugerrådet Tænk råder til mindst to tilbud, skriftlige tilbud, aftale om hvorvidt et tilbud koster noget, og en håndværker med garantiordning. Tænk bemærker også, at et overslag ikke er bindende ([Tænk](https://taenk.dk/forbrugerliv/bolig/dette-skal-du-vide-inden-du-hyrer-en-haandvaerker)). Bolius anbefaler at tjekke dansk CVR og adresse, autorisationer, garantiordning, referencer og lignende udført arbejde, og at læse anmeldelser for mønstre over tid. Et svar fra firmaet, der forklarer eller indrømmer en fejl, er ifølge Bolius et tegn på ærlighed ([Bolius](https://www.bolius.dk/anmeldelser-af-haandvaerkere-kan-du-stole-paa-dem-21031)). Bolius fremhæver også, at lokale firmaer kommer hurtigere og har lavere kørselsomkostninger ([Bolius](https://www.bolius.dk/valg-af-gode-haandvaerkere-17196)).

### Garanti, autorisation og fradrag er de stærkeste konkrete markører

**Byg Garanti** dækker op til 150.000 kr. inkl. moms pr. projekt, hvis håndværkeren ikke vil eller kan udbedre fejl, og kun dækkede firmaer må bruge navn og logo. 68 % af forbrugerkunderne siger ifølge en undersøgelse for DI Byggeri, at dækningen betyder noget for deres valg ([DI Byggeri](https://www.danskindustri.dk/brancher/di-byggeri/nyheder/arkiv/nyheder/2026/2/tilvalg-af-byg-garanti-tiltrakker-forbrugerkunder/)). Bolius skriver, at Byg Garanti dækker arbejde under 1 mio. kr. ([Bolius](https://www.bolius.dk/valg-af-gode-haandvaerkere-17196)). Det tal handler sandsynligvis om kontraktstørrelse og ikke om udbetaling, men kilderne afklarer det ikke. Det er lige så vigtigt, at falsk påstand om Byg Garanti-tilknytning kan straffes som vildledning ([Rigsadvokaten](https://www.retsinformation.dk/eli/retsinfo/2022/9124/dan/pdf)). Garantilogoet må kun vises, hvis firmaet faktisk er dækket.

**Autorisation** for el, VVS og kloak står i Sikkerhedsstyrelsens offentlige register, og autorisationsloven har en bestemmelse om "misvisende fremstilling af autorisation" ([Lovguiden](https://www.lovguiden.dk/loven/lov-om-autorisation-af-virksomheder-på-el-vvs-og-kloakinstallationsområdet/kapitel-3)). Det kunne ikke bekræftes, om autorisationsnummeret skal vises i markedsføring. **[Vurdering]** Det er under alle omstændigheder en stærk og sjælden tillidsmarkør at vise nummeret og linke til registeret.

**Håndværkerfradraget i 2026** er højst 9.000 kr. pr. person, gælder kun arbejdsløn og kun "grønne" opgaver. Det omfatter isolering, udskiftning af vinduer og yderdøre, kloak og dræn, solceller og varmepumper, og betalingen skal være elektronisk ([skat.dk](https://skat.dk/borger/fradrag/servicefradrag/haandvaerkerfradrag)). Almindeligt malerarbejde, tømrerarbejde og badeværelsesrenovering står ikke på listen. **[Vurdering]** Fradraget er et ærligt salgsargument for VVS, tømrere (vinduer og døre), isolering og kloak, men det vil være vildledende på en malerside.

### Dansk tekst, der lyder som et menneske

Folkeskolen gennemgik i juni 2026, med udgangspunkt i professor Bolette Sandford Pedersen, de typiske tegn på AI-genereret dansk. Listen omfatter konstruktionen "Det er ikke x, men y", tretrinsraketten (lister med præcis tre led), "du" i stedet for "man" som direkte oversættelse af engelsk "you", mange tankestreger i stedet for kommaer, fejlfri kommatering, ikke-eksisterende sammensætninger og anglicismer samt forkert brugte faste udtryk ([Folkeskolen](https://www.folkeskolen.dk/guide/saadan-spotter-du-ai-sprog-i-elevernes-afleveringer/)). Dansk Sprognævn beskrev i januar 2026 de "fåreklædeanglicismer", der er oversat ord for ord, fx "tilbage til tegnebrættet" og "kalde det en dag" ([Dansk Sprognævn](https://dsn.dk/nyt-fra-sprognaevnet/januar-2026/skjulte-anglicismer-i-det-danske-sprog/)).

Forskellen kan ses på rigtige sider. Menneskelige linjer er korte, konkrete og praktiske: "Ring direkte hvis det skal være hurtigt. Skriv en mail hvis det er detaljeret." ([mathias-winther.dk](https://mathias-winther.dk/forside/)), "Hos os foretrækker vi dialog frem for misforståelser." ([naesby-maler.dk](https://naesby-maler.dk/)) og "Uanset hvor mange der er på opgaven, har du én fast kontaktperson hele vejen" ([tmah.dk](https://www.tmah.dk/)). Generiske linjer lover uden at vise noget: "Vi garanterer at dit projekt bliver udført til perfektion" ([brobergtomrerentreprise.dk](https://brobergtomrerentreprise.dk/toemrerroskilde)), "Din idé. Vores håndværk. Sammen skaber vi noget særligt." ([tmah.dk](https://www.tmah.dk/)), "innovative og moderne løsninger" ([sfmurer.dk](https://sfmurer.dk/)) og "ingen opgave er for lille eller for stor" ([naesby-maler.dk](https://naesby-maler.dk/)).

**[Vurdering]** Det giver følgende skriveregler for Makkernes sider. Skriv med "vi" og mesterens fornavn, og brug også "man" ind imellem. Skriv korte sætninger med punktum og komma frem for tankestreger. Undgå tretrinsslogans og "ikke bare X, men Y". Undgå engelske imperativer som "Løft dit hjem", "Tag dit badeværelse til næste niveau" og "Oplev forskellen". Ingen kilde nævner netop "Løft din…" som et AI-tegn, så det er en slutning. Byt superlativer ud med fakta: år, sted, pris, navngiven leverandør, antal år med de samme underleverandører. Brug de ord, branchen selv bruger: "besigtigelse", "fast pris efter besigtigelse", "inkl. moms og kørsel", "træffes på", "vi kommer gerne ud og kigger på opgaven". Hold fakta konsekvente med ét telefonnummer, ét anmeldelsestal, ét serviceområde og ét firmanavn, for inkonsekvens var blandt de hyppigste svagheder i stikprøven.

### Anatomien af en stærk håndværkerside

| Element | Hvorfor | Belæg |
|---|---|---|
| Mesterens navn og rigtige portræt | Rigtige medarbejderfotos får mere opmærksomhed end bioer; "real people" bag siden | [Forskning] [NN/g](https://www.nngroup.com/articles/photos-as-web-content/); [Stanford](https://credibility.stanford.edu/guidelines/index.html) |
| Opgavefotos med sted og år, også undervejs | "Photos of the full service process and the people doing the work" | [Forskning/Konvention] [NN/g](https://www.nngroup.com/articles/trustworthy-design/) |
| CVR, gadeadresse, telefon (`tel:`), e-mail på eget domæne | Viser en rigtig, kontaktbar organisation; Bolius' tjekliste | [Forskning] [Stanford](https://credibility.stanford.edu/guidelines/index.html); [Bolius](https://www.bolius.dk/anmeldelser-af-haandvaerkere-kan-du-stole-paa-dem-21031) |
| Én konkret pris eller et prisinterval og vilkårene | "Upfront disclosure" af omkostninger og gebyrer; prisintervaller frem for lange tilbudsformularer | [Forskning/Konvention] [NN/g](https://www.nngroup.com/articles/trustworthy-design/) |
| Garantiordning og autorisation tæt ved CTA, kun hvis dækket | 20 % nævner garanti, 68 % siger Byg Garanti betyder noget | [Forskning] [KFST](https://kfst.dk/media/53650/20190125-forbrugerundersoegelse-haandvaerkerydelser.pdf); [DI](https://www.danskindustri.dk/brancher/di-byggeri/nyheder/arkiv/nyheder/2026/2/tilvalg-af-byg-garanti-tiltrakker-forbrugerkunder/) |
| Anmeldelser fra navngiven ekstern platform, korrekt gengivet med antal og link | Eksterne kilder stoles mere på; korrekt gengivelse er et krav | [Forskning/Lov] [NN/g](https://www.nngroup.com/articles/trustworthy-design/); [Forbrugerombudsmanden](https://forbrugerombudsmanden.dk/media/46465/2016-retningslinjer-om-offentliggoerelse-af-brugeranmeldelser.pdf) |
| Svartid, åbningstider og hvem der kommer ud | Fjerner usikkerhed; mange kunder indhenter kun ét tilbud | [Forskning] [KFST](https://kfst.dk/media/53650/20190125-forbrugerundersoegelse-haandvaerkerydelser.pdf) |
| Håndværkerfradrag, kun for de rigtige opgaver | Ærligt og relevant for grønne opgaver | [Lov] [skat.dk](https://skat.dk/borger/fradrag/servicefradrag/haandvaerkerfradrag) |
| Kort formular og to CTA'er med forskellig hensigt | "Ring direkte hvis det skal være hurtigt. Skriv en mail hvis det er detaljeret." | [Vurdering] efter [mathias-winther.dk](https://mathias-winther.dk/forside/) |
| "Senest opdateret" og nul tastefejl | Fejl og døde links "quickly degrade credibility" | [Forskning] [NN/g](https://www.nngroup.com/articles/trustworthy-design/); [Stanford](https://credibility.stanford.edu/guidelines/index.html) |

## Fiktive demo-sider skal være ærlige for at kunne føles ægte

### Lovgivningen sætter en klar grænse for opdigtet bevis

EU's Omnibus-direktiv (2019/2161) ændrede direktivet om urimelig handelspraksis. Det sortlistede under alle omstændigheder at give eller bestille andre til at give "false consumer reviews or endorsements" (bilag I, pkt. 23c) og at påstå, at anmeldelser kommer fra rigtige købere uden rimelige kontroller (pkt. 23b). Erhvervsdrivende, der viser anmeldelser, skal oplyse, om og hvordan de sikrer, at anmeldelserne er ægte (art. 7, stk. 6) ([EUR-Lex](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32019L2161)). I Danmark kræver markedsføringslovens § 13, at "Den erhvervsdrivende skal kunne dokumentere rigtigheden af oplysninger om faktiske forhold" ([danskelove.dk](https://danskelove.dk/markedsf%C3%B8ringsloven/13)). Forbrugerombudsmandens retningslinjer siger, at en virksomhed, der viser platformsanmeldelser på sin egen side, "er forpligtet til at gengive disse anmeldelser og ratings korrekt", og at modydelser for anmeldelser skal oplyses ([Forbrugerombudsmanden](https://forbrugerombudsmanden.dk/media/46465/2016-retningslinjer-om-offentliggoerelse-af-brugeranmeldelser.pdf)). Retningslinjerne er fra før Omnibus-reglerne, og det er ikke bekræftet, om der findes en nyere version.

Reglerne håndhæves. I 2021 blev Norström/Fauna Energi politianmeldt for fem Trustpilot-anmeldelser, der lignede uafhængige. Én brugte et navn, der ikke findes i Danmark, og et profilbillede af en person i USA. Tre blev skrevet samme dag, og alle fem gav fem stjerner, mens de fleste andre gav én ([Dansk Erhverv](https://www.danskerhverv.dk/presse-og-nyheder/nyheder/2021/marts/norstrom-i-dag-fauna-energi-politianmeldt-for-falske-brugeranmeldelser/)). I januar 2026 idømte byretten Rekom Group og NightPay bøder, fordi medarbejdere havde skrevet positive anmeldelser uden at oplyse ansættelsesforholdet ([Dansk Erhverv](https://www.danskerhverv.dk/presse-og-nyheder/nyheder/2026/januar/rekom-group-og-nightpay-idomt-boder-for-vildledning-pa-trustpilot/)). For amerikanske kunder gælder FTC's regel fra august 2024, der forbyder falske anmeldelser og udtalelser, herunder AI-genererede og dem, der tilskrives personer, som ikke findes ([FTC](https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials)).

### Hvad det betyder for en fiktiv virksomhed

Der findes ingen dansk eller europæisk vejledning specifikt om bureauers demo-sider, så det følgende er **[Vurdering]** ud fra de generelle principper og bør bekræftes af en jurist, hvis demoerne bruges i opsøgende salg. En fiktiv virksomhed markedsfører ikke noget, fordi den ikke findes. Risikoen opstår ved to lejligheder. Den første er, hvis demoen kan forveksles med en rigtig erhvervsdrivende, fordi den bruger et rigtigt firmanavn, en rigtig adresse eller et rigtigt telefonnummer, eller fordi den kan findes i søgemaskiner. Den anden er, at demoen også er Makkernes egen markedsføring, og påstande om bureauet (resultater, kunder, tal) er omfattet af § 13. NN/g brugte selv en "fictional consulting firm" som stimulus i sit studie ([NN/g](https://nngroup.com/articles/ai-generated-images)), så fiktive sider er et normalt redskab, når de præsenteres som sådan.

Der er også et salgsargument. Hvis Makkerne viser en prospekt-håndværker en demo med "4,9 af 5 · 418 anmeldelser på Google", viser bureauet, at det er villigt til at opfinde tal. Det er præcis det, en kunde ikke skal kunne mistænke dem for.

### Status i makkerne.tech-kodebasen

En gennemgang af kodebasen den 17. oktober 2026 viser, at noget allerede er på plads. Alle seks eksempelsider har `robots: { index: false }`, en `DemoNote`-banner med teksten "Eksempel lavet af Makkerne · Forretningen er opdigtet" og "CVR 00 00 00 00 (eksempel)". Det er et godt udgangspunkt. Men der er seks konkrete problemer:

| Iagttagelse i koden | Problem | Forslag |
|---|---|---|
| "4,9 af 5 · 418 anmeldelser på Google" (vvs), "286 anmeldelser" (el), "173" (murer), "156" (maler), "212" (tømrer), "24 på Anmeld en håndværker" (tag) | Realistiske, platformsnavngivne tal for et firma, der ikke findes. Alle står på 4,9, hvilket i sig selv er et skabelontegn | Vis komponenten med tydelig mærkning ("Her vises jeres egne Google-anmeldelser") eller "x,x af 5 · xx anmeldelser" som synlig pladsholder |
| `Stars` har `aria-label="5 ud af 5 stjerner"` ved siden af teksten "4,9" | Skærmlæserbrugere får en anden rating end seende brugere | Lad aria-label komme fra den faktiske værdi |
| Et stockfoto med alt-teksten "Mads Egholm med værktøjsbælte" som mester på tømrersiden | En rigtig, fremmed person præsenteres som navngiven ejer | Mærk billedet "Her kommer dit eget portræt", eller vis et værkstedsbillede uden ansigt |
| `Img` i `shared.tsx` sætter altid `loading="lazy"`, også på hero-billedet (set på tømrersiden) | web.dev: "Never lazy-load your LCP image" | Giv hero-billedet `loading="eager"` og `fetchpriority="high"` |
| El-siden bruger Space Grotesk; maler og murer bruger begge Bricolage Grotesque | Space Grotesk står på listen over "slop fonts", og to af seks demoer deler font | Én retning pr. fag, med en skriftlig begrundelse |
| `DemoNote` er 11 px i nedtonet farve | Banneret skal kunne læses, og nedtonet 11 px-tekst risikerer at falde under 4,5:1 | Mål kontrasten; overvej også mærkning ved formularer og anmeldelser |

### Regler for Makkernes demoer

**[Vurdering]** Mærk tydeligt to steder. I porteføljen skal demoen stå som "Konceptdesign, fiktiv virksomhed" og adskilt fra rigtige kundecases. På selve demoen skal der være et vedvarende banner og `noindex`, og begge dele er allerede på plads. Brug fiktive, men plausible navne, og søg i CVR-registeret og på Google for at sikre, at navnet ikke rammer et rigtigt dansk firma. Brug kontaktoplysninger, der tydeligt ikke virker, men læses naturligt. Brug aldrig en rigtig gadeadresse sammen med et rigtigt telefonnummer. Formularer skal være deaktiverede eller gå til Makkerne med en besked om det. Udelad udtalelser, eller vis dem som tydeligt markeret eksempelindhold. Sæt aldrig realistiske navne og ansigter på, som om de var ægte. Brug rigtig fotografi af rigtige steder og opgaver frem for generisk stock, og hvis der bruges AI-billeder, så tjek dem for NN/g's typiske artefakter i tekst, hænder, skærme, glasrefleksioner og baggrundsdetaljer ([NN/g](https://nngroup.com/articles/ai-generated-images)). Undgå AI-portrætter af ejer og ansatte, og nævn AI-brug i kreditlinjen.

Demoen skal føles ægte gennem specificitet og ikke gennem falsk bevis. Brug realistiske prislister i fagets eget sprog ("Besigtigelse 950 kr. inkl. moms, trækkes fra ved accept"), åbningstider, en troværdig proces fra første opkald til aflevering, FAQ med de spørgsmål, Tænk og Bolius beder kunderne stille, og billedtekster med plausibelt sted og årstal. Det er de samme elementer, som NN/g og Stanford identificerer som troværdighedsskabende. For Makkernes egen troværdighed gælder de samme krav som for kunderne: rigtige mennesker med fotos, rigtigt CVR, adresse og telefon, ærlige tal (fx "3 sider lanceret", hvis det er sandt) og links til rigtige kundesider, når de findes.

## Vælg den visuelle retning ud fra fagets egne materialer

Metoden bygger på Anthropics skill-fil, Capital & Compute og prg.sh og er tilpasset håndværkere. Den skal følges, før der skrives kode, og den skal give en ny retning for hvert projekt.

**Trin A er at forstå opgaven.** Fastlæg, hvad firmaet laver og ikke laver, hvem kunden er (boligejer, boligforening, erhverv), hvad besøgende skal kunne (ringe, booke besigtigelse, se priser, tjekke autorisation), hvilken følelse siden skal give (tryghed, ro, hurtighed), hvad der adskiller firmaet (samme hold i 13 år, fast pris, døgnvagt), hvilket rigtigt indhold der findes (fotos, anmeldelser, certifikater, priser), og hvilke begrænsninger der gælder (tilgængelighed, hosting, budget). Skriv det ned i brief-skabelonen længere nede.

**Trin B er at definere retningen.** Skriv én designsætning, der kan teste hvert valg, fx "Som en velholdt varevogn: ren, mærket og klar til at køre". Vælg tre til fem bærende greb ([avoid-ai-design](https://github.com/funboy322/avoid-ai-design)), og hold resten stille. Byg en palet på 4–6 navngivne hex-værdier med roller ([SKILL.md](https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md)), hentet fra fagets materialer, fordi Capital & Compute anbefaler at "derive palette from the product's materials" ([Capital & Compute](https://capitalandcompute.net/blog/fix-ai-slop-design/)). Vælg typografi efter emnet, ikke efter vane. Fastlæg billedretningen (hvad fotograferes, i hvilket lys, i hvilke formater) og ét bevægelsesprincip. Tjek planen mod listen over standardlooks og ret den, før der kodes. Anthropic beskriver netop to omgange: en kort designplan, så et tjek mod briefen for generiske standarder, så en revision ([SKILL.md](https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md)).

**[Vurdering]** Som inspiration kan fagene give hver sin materialeverden. Tømreren har træ, blyant, tommestok og savsmuld, en varm og lys palet og måske en kondenseret skrift, der minder om stempler på tømmer. Mureren har tegl, kalk, mørtel og fuger, en mineralsk palet, og det lodrette og vandrette forbandt kan bruges som gitter. Elektrikeren har tavlemærkning, ledningsfarver og præcision, en mørk og stram palet med én signalfarve forbeholdt CTA og døgnvagt. VVS'eren har kobber, messing og hvide fliser, og vand-og-varme-siden kan få rolige tekniske diagrammer. Maleren har farvekort, afdækningstape og pensler, og paletten kan være neutral, så kundernes egne farver bærer billederne. Tagdækkeren har skifer, tegl, zink og himmel og et vandret, panoramisk billedformat. Disse er udgangspunkter. Det rigtige firmas varevogn, logo og arbejdstøj vejer altid tungere.

**Trin C er at designe kompositionen.** Beslut, hvor opmærksomheden skal gå hen først, dernæst og som nummer tre. NN/g anbefaler højst tre størrelser og højst to store elementer pr. visning, og at det vigtigste element er størst ([NN/g](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/)). Sammenlign to til tre layouts med en beskrivelse på én sætning og en ASCII-skitse, og beslut justeringen eksplicit ([SKILL.md](https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md)). Lad sektionernes form følge indholdet: en prisliste er en tabel, en proces er en sekvens, et galleri er billeder i fast format, og et mesterportræt kan bryde gitteret. Brug asymmetri, store skrifter og overlap kun, når det styrker designsætningen.

## Konkrete retningslinjer for typografi, farve, rum, billeder, layout og bevægelse

### Typografi

Butterick anbefaler en linjelængde på 45–90 tegn inklusive mellemrum, linjeafstand på 120–145 % af skriftstørrelsen og 5–12 % ekstra spærring på versaler og kapitæler, men ingen spærring af almindelige små bogstaver **[Konvention]** ([Butterick, linjelængde](https://practicaltypography.com/line-length.html); [linjeafstand](https://practicaltypography.com/line-spacing.html); [spærring](https://practicaltypography.com/letterspacing.html)). De ofte citerede 45–75 tegn tilskrives Bringhurst, men det blev ikke verificeret. NN/g anbefaler højst tre størrelser pr. visning **[Konvention]** ([NN/g](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/)). **[Vurdering]** En fuld flydende skala er forenelig med det, hvis hver skærm kun bruger cirka tre trin ad gangen.

Flydende typografi laves med `clamp()` og en rem- plus vw-værdi, genereret med Utopia, så grænser og foretrukken værdi regnes sammen og ikke rettes hver for sig. Utopias eget eksempel går fra 1rem til 2rem mellem 320 og 1440 px: `clamp(1rem, 0.7143rem + 1.4286vw, 2rem)`. Utopia gengiver Adrian Roselli's advarsel om, at `clamp()` kan begrænse maksimumstørrelsen ved browserens tekstzoom, så det skal testes ([Utopia](https://utopia.fyi/blog/clamp/)). I WCAG svarer "stor tekst" til cirka 24 px, eller 18,5 px i fed **[Standard]** ([W3C](https://w3c.github.io/wcag/understanding/contrast-minimum)).

Fontindlæsning har dokumenterede valg ([web.dev](https://web.dev/articles/font-best-practices)). Brug kun WOFF2, som "compresses 30% better than WOFF". `font-display: optional` er hurtigst, og `swap` bruges, når teksten skal vises med det samme og ende i webfonten. Så skal fonten leveres tidligt, og fallback-fonten justeres med `size-adjust` mod layoutskift. Preload kun den ene kritiske font. Variable fonte betaler sig først, når siden bruger flere vægte. `system-ui` kræver ingen download og "can work particularly well for body text". Subsetting med `unicode-range` kræver et tjek af licensen. **[Vurdering]** Ved subsetting skal Latin-1-intervallet (U+0000-00FF) med, fordi det dækker æ, ø og å.

**[Vurdering]** Et fornuftigt udgangspunkt for håndværkersider er én karakterfuld display-skrift til overskrifter, valgt efter faget, og en meget læsbar brødtekst eller `system-ui`. Det giver personlighed, hvor det tæller, til lav ydelsesomkostning. Store overskrifter får strammere linjeafstand (ca. 1,0–1,15) og let negativ spærring. Det er almindelig praksis, men ikke dokumenteret.

```css
:root { --step-0: clamp(1rem, 0.95rem + 0.25vw, 1.125rem); /* generér rigtige værdier på utopia.fyi */ }
body   { font-size: var(--step-0); line-height: 1.4; }               /* Butterick 120–145 % */
.prose { max-width: 65ch; }                                           /* inden for 45–90 tegn */
.caps  { text-transform: uppercase; letter-spacing: 0.08em; }        /* 5–12 % på versaler */
h1     { line-height: 1.05; letter-spacing: -0.01em; }               /* Vurdering */
```

### Farve

Kontrast er den eneste del af farvelæren med hårde standarder. WCAG 2.x AA kræver 4,5:1 for normal tekst og 3:1 for stor tekst, og der må ikke rundes op: "4.499:1 would not meet the 4.5:1 threshold" **[Standard]** ([W3C](https://w3c.github.io/wcag/understanding/contrast-minimum)). APCA er en perceptuel kandidat til WCAG 3, men "neither is officially recommended by the W3C" ([Myndex](https://github.com/Myndex/apca-introduction)). **[Vurdering]** Brug WCAG 2.2 AA som gulv og APCA som ekstra tjek ved tynde fonte og mørke temaer.

NN/g anbefaler en palet på cirka tre farver fordelt 60-30-10, med den dominerende og sekundære farve forholdsvis neutrale og accenten forbeholdt det vigtigste element, typisk den primære CTA **[Konvention]** ([NN/g](https://www.nngroup.com/articles/color-enhance-design/)). NN/g skriver også, at forskning ikke beviser universelle følelsesmæssige effekter af bestemte farver **[Forskning, negativt fund]**. Påstande om, at "blå skaber tillid", har altså intet belæg. Varme, mættede farver som rød bør forbeholdes advarsler og fejl, og hierarki må aldrig kun afhænge af farve ([NN/g](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/)). Gråtonede knapper kan ligne deaktiverede ([NN/g](https://www.nngroup.com/articles/color-enhance-design/)).

**[Vurdering]** Tonede neutrale farver (en lavmættet udgave af brandets farvetone) i stedet for ren grå og sort, som Impeccable også anbefaler ("always tint", [Impeccable](https://github.com/pbakaus/impeccable)). Mættethed bruges ét sted. Kodebasen gør det allerede rigtigt med navngivne tokens (`--color-paper`, `--color-ink`, `--color-brand`) og pr. side med `--ex-ink`, `--ex-paper` og `--ex-accent`.

### Rum og rytme

Visuelt hierarki bygges med kontrast, skala og gruppering. Grupper vises "implicitly through proximity and the use of white space or explicitly through enclosure" ([NN/g](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/)). Nærhedsprincippet er etableret perceptionspsykologi **[Forskning]** ([NN/g](https://www.nngroup.com/videos/proximity-gestalt/)). De konkrete tal er **[Vurdering]**. Afstanden mellem grupper bør være mindst cirka dobbelt så stor som afstanden inde i en gruppe, og en geometrisk skala (4, 8, 12, 16, 24, 32, 48, 64, 96 px) gør springene entydige. Sektionspolstring varierer efter indholdets vægt: en tæt prisliste har mindre luft end et mesterportræt. Brud gentagelser ved at variere én dimension ad gangen (skala, justering eller tæthed) og holde tokens konstante. Der blev ikke fundet autoritative kilder til gitterproportioner eller spacing-skalaer.

```css
.wrapper { width: min(100% - 2rem, 72rem); margin-inline: auto; }   /* 16 px margen på mobil */
.stack > * + * { margin-block-start: var(--space, 1.5rem); }
.grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: var(--space-m); }
.feature { grid-column: 1 / span 7; } .aside { grid-column: 9 / -1; } /* asymmetrisk 7/4 */
```

### Billeder og art direction

Hvert billede skal enten vise noget rigtigt (folk, værksted, arbejde i gang, færdigt resultat) eller forklare noget (et diagram). Begrundelsen er, at informationsbærende billeder får opmærksomhed, og dekorative ignoreres **[Forskning]** ([NN/g](https://www.nngroup.com/articles/photos-as-web-content/)). Vis processen og ikke kun slutresultatet ([NN/g](https://www.nngroup.com/articles/trustworthy-design/)). Forstørrelser skal være "at least twice as big, preferably more" ([NN/g](https://www.nngroup.com/articles/photos-as-web-content/)). Brug `object-fit: cover` sammen med `object-position`, så motivet bliver i beskæringen ved alle brudpunkter ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/object-position)).

Ydelsen har hårde regler **[Standard/Konvention]**. LCP-billedet skal kunne findes i den indledende HTML, have `fetchpriority="high"` og må aldrig lazy-loades ([web.dev](https://web.dev/articles/optimize-lcp)). Høj prioritet på mere end et eller to billeder gør prioriteringen virkningsløs. `loading="lazy"` bruges kun uden for den første visning, og alle `<img>` skal have `width` og `height`, så der ikke opstår layoutskift ([web.dev](https://web.dev/articles/browser-level-image-lazy-loading)).

**[Vurdering]** Brug et lille sæt billedformater (fx 16:9 til hero, 4:3 til opgaver og 4:5 til portrætter), og fotografér eller farvekorrigér hele sættet i samme lys, så kundens egne mobilfotos læses som ét brand og ikke som en collage. Filtre og duotoner bruges kun til at løse et problem, fx læsbarhed oven på et foto eller at samle uensartede kundefotos. Manglende billeder må aldrig blive til grå bokse eller "billede kommer snart". Fjern i stedet området, eller lav en typografisk version. Gode kundefotos med telefon kræver vejledning: tag billedet i dagslys, hold telefonen vandret, tag før og efter fra samme sted, og skriv adresse og årstal på med det samme.

### Layout

**[Vurdering]** Sektionsrækkefølgen på en håndværkerside følger kundens spørgsmål: hvad laver I (ydelser i kundens ord), kan I klare min opgave (opgaver med sted og år), hvad koster det (pris eller interval og vilkår), kan jeg stole på jer (mester, garanti, autorisation, eksterne anmeldelser), og hvordan kommer jeg i kontakt (telefon, formular, svartid). Telefonnummeret står i headeren, i hero og i footeren og er tappbart, sådan som det er på Mathias Winthers side ([mathias-winther.dk](https://mathias-winther.dk/forside/)). På mobil skal den primære handling kunne nås med tommelfingeren, og trykflader bør være cirka 44 px. Bynavnesider er kun berettigede, hvis de har rigtigt lokalt indhold (opgaver i den by, kørselstid). Ellers bliver de den skabelonfejl, stikprøven var fuld af.

### Bevægelse og interaktion

Tidsforløbet har et forskningsanker. Cirka 100 ms opleves som øjeblikkeligt, cirka 1 sekund er grænsen for uafbrudt tankestrøm, og Val Head anbefaler 200–500 ms som udgangspunkt for UI-animationer, med 200–300 ms til små ændringer **[Forskning/Konvention]** ([Val Head](https://valhead.com/?p=2978)). Hun skriver også selv, at "good animation timing is more of an art than a science". Material 3 bruger varighedstokens fra 50 til 1000 ms, der vokser med areal og afstand, og navngivne easing-kurver: decelerate ved indgang og accelerate ved udgang ([Material 3](https://raw.githubusercontent.com/material-components/material-components-android/master/docs/theming/Motion.md)).

`prefers-reduced-motion` skal respekteres ved at *erstatte* bevægelse med en blødere variant, fx en toning i stedet for skalering. Feedbacken skal ikke bare slettes ([MDN](https://developer.mozilla.org/fr/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion)). Parallakse er "often non-essential", og bevægelse udløst af interaktion bør kunne slås fra **[Standard, AAA]** ([W3C 2.3.3](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)). Core Web Vitals sætter målene ved 75. percentil: LCP højst 2,5 s, INP højst 200 ms og CLS højst 0,1 **[Standard]** ([web.dev](https://web.dev/articles/defining-core-web-vitals-thresholds?hl=en)).

**[Vurdering]** Bevægelse skal have én af tre opgaver: feedback (bekræfte en handling), orientering (hvor noget kom fra) eller kontinuitet (tilstandsskift). Animér kun `transform` og `opacity`, skjul aldrig hero eller LCP-elementet bag en reveal, og hold forskydninger små. Automatisk skiftende slidere, som kodebasens `useSlider` (5 sekunder, pause kun ved mus-hover), bør kunne pauses på touch og med tastatur, eller undgås.

```css
:root {
  --dur-1: 100ms; --dur-2: 200ms; --dur-3: 300ms; --dur-4: 500ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-enter: cubic-bezier(0.05, 0.7, 0.1, 1);
  --ease-exit: cubic-bezier(0.3, 0, 0.8, 0.15);
}
@media (prefers-reduced-motion: reduce) {
  .reveal { transform: none; transition: opacity var(--dur-2) linear; } /* erstat, fjern ikke */
}
```

## Arbejdsgang i kode: indhold og tokens først, komponenter bagefter

**[Vurdering]** Arbejdsgangen er tilpasset makkerne.tech (Next.js 16.3.8, React 19, Tailwind 4 med `@theme`, framer-motion og `next/font`). Projektets AGENTS.md siger, at denne Next.js-version har ændringer, der bryder med tidligere versioner, og at guiden i `node_modules/next/dist/docs/` skal læses før kode. Den regel gælder også her.

Først udfyldes brief-skabelonen, og der indsamles rigtigt indhold: tekst, fakta med kilde, fotos og priser. Hver faktuel påstand får en kilde i én datafil (fx `lib/content.ts` eller en fil med fakta pr. demo), så § 13-dokumentationen findes i koden og kan reviewes. Derefter skrives designplanen (palet, typografi, layout, tre til fem greb), som tjekkes mod listen over standardlooks. Så defineres tokens: farver med roller, typeskala med `clamp()` fra Utopia, spacing-skala, radius, tre elevationsniveauer og varigheder og easings. I Tailwind 4 sker det i `@theme`, og pr. eksempelside i CSS-variabler på roden, som projektet allerede gør. Vercels dokumentation for v0 viser samme logik: det billigste greb mod det generiske er tokens og et designsystem-register, ikke at omskrive komponenternes indmad ([v0 docs](https://v0.app/docs/design-systems)).

Derefter bygges et semantisk HTML-skelet uden stil (landmarks, overskriftsniveauer, lister, tabeller til priser, `<address>`, `tel:`-links), så layout og komponenter med varieret komposition efter indholdet. Fonte indlæses med `next/font` med subset og en bevidst `display`-værdi. Hero-billedet får eager loading og høj prioritet, og alle billeder får dimensioner. Interaktionstilstande laves som en del af komponenten og ikke bagefter: hover, `focus-visible`, active, disabled, fejl, succes, tom og indlæser. Bevægelse lægges på til sidst, og kun hvor den har en opgave.

Automatisér de regler, der kan automatiseres. En lint- eller grep-regel kan fange forbudte ord, rå `indigo-*` og `violet-*`, `bg-clip-text`, gentaget `rounded-2xl shadow-lg`, fontnavne på listen, `loading="lazy"` på hero og tal uden kildehenvisning i datafilen. Detektorer som Impeccable (59 deterministiske regler) og avoid-ai-design (P0–P2) kan bruges, men Capital & Compute understreger, at et filter "prevents slop but cannot invent direction", og at "a look fixes the look. It does not fix invented numbers" ([Capital & Compute](https://capitalandcompute.net/blog/fix-ai-slop-design/)). Til sidst gennemgås det renderede site med QA-processen længere nede.

For varig projektvejledning bør de korte regler stå i CLAUDE.md under linjen `@AGENTS.md` og ikke inde i AGENTS.md's autogenererede blok, som `next dev` skriver igen. Den detaljerede research kan stå i et separat dokument, fx `docs/human-centered-web-design.md`.

## Review-tjekliste og scoringsrubrik

### Tjekliste

| Spørgsmål | Hvis svaret er nej |
|---|---|
| Kunne siden forveksles med hundredvis af andre? (skal være nej) | Gå tilbage til designsætningen og de tre til fem greb |
| Afspejler retningen det rigtige fag, firma og publikum? | Erstat lånt stil med fagets materialer |
| Er hero'en særpræget af en grund, og indeholder H1 et navneord, der kun passer her? | Byt bynavn og slogan ud med firmaets stærkeste rigtige faktum |
| Er typografien valgt med en skriftlig begrundelse? | Vælg igen ud fra emnet |
| Har hver sektion et formål, der svarer på et kundespørgsmål? | Fjern den eller flyt indholdet |
| Er der variation i kompositionen uden inkonsekvens? | Varier én dimension ad gangen |
| Er billederne relevante, rigtige og beskåret bevidst? | Skift til egne fotos eller et typografisk alternativ |
| Danner farve, spacing og proportioner et system af tokens? | Udskift ad hoc-værdier med tokens |
| Er gradienter, skygger, kort, kanter og animationer begrundede? | Fjern dem, der ikke formidler noget |
| Føles mobilversionen designet, og kan telefonnummeret nås med tommelfingeren? | Redesign mobil først |
| Virker alle interaktioner med tastatur og har synlig fokus? | Ret før lancering |
| Matcher det renderede site den planlagte retning? (jf. Design Theater: ca. 25 % af begrundelserne blev ikke implementeret) | Sammenlign punkt for punkt med planen |
| Er hvert tal, hver anmeldelse og hvert logo dokumenterbart, og er demoer mærket? | Stop lancering |
| Er fakta konsekvente (telefon, adresse, anmeldelsestal, serviceområde, firmanavn)? | Ret alle forekomster fra én kilde |
| Er der detaljer, der virker ufærdige: pladsholdere, døde links, tastefejl, "slider1"? | Ret før lancering |

### Rubrik

Hvert kriterium scores fra 1 til 5. Ankrene herunder er **[Vurdering]**.

| Kriterium | 1: svag | 3: kompetent | 5: stærk | Kontrolleres med |
|---|---|---|---|---|
| Originalitet | Kunne være enhver side; flere første- eller andenbølge-tegn | Enkelte bevidste valg, men skabelonen skinner igennem | Kunne kun være dette firma; greb er afledt af faget | Tegnlister, sammenligning med 5 konkurrenter |
| Visuel sammenhæng | Ad hoc-værdier, flere radier og skygger uden system | Tokens findes, men brydes flere steder | Ét system, holdt stramt, med begrundede undtagelser | Kodegennemgang af tokens |
| Brandtilpasning | Lånt stil uden relation til faget | Passer nogenlunde, men er generisk inden for branchen | Designsætningen kan genkendes i alle valg | Designsætning mod sektioner |
| Typografi | Standardfont, flad skala, lange linjer | Ordentlig skala og linjelængde, intet særpræg | Valgt efter emnet, klart hierarki, 45–90 tegn | Måling af linjelængde og skala |
| Komposition | Samme layout gentaget; uklar læserækkefølge | Klar rækkefølge, men forudsigelig | Varieret efter indhold; slørtest bevarer hierarkiet | Slørtest ved 5 og 10 px |
| Indholdskvalitet og ærlighed | Superlativer, opdigtede tal, pladsholdere | Konkret, men med uunderbyggede påstande | Navne, steder, år, priser; alt dokumenterbart | Faktatjek mod kildefil |
| Brugbarhed | Døde tilstande, manglende fejl i formularer | Hovedopgaver virker, enkelte huller | Ring og book kan klares på få sekunder; alle tilstande findes | Opgavetest med 3–5 personer |
| Tilgængelighed | Kontrastfejl, ingen fokus, tom alt-tekst | AA på det meste | AA overalt, tastatur, reduced motion, meningsfuld alt-tekst | Kontrastmåler, tastatur, skærmlæser |
| Responsivitet | Desktop presset ned; vandret scroll | Fungerer, men mobil er en eftertanke | Mobil designet bevidst ved 360 px og opefter | 360, 768, 1280 px og 200 % zoom |
| Ydelse | LCP over 4 s, layoutskift | Inden for grænser på desktop | LCP højst 2,5 s, INP højst 200 ms, CLS højst 0,1 på mobil | PageSpeed Insights, feltdata |

### Sådan bruges scorerne til at prioritere

**[Vurdering]** Summen er ikke et mål for kvalitet. En side med 42 ud af 50 og en opdigtet anmeldelse er dårligere end en ærlig side med 36. Brug derfor scorerne i fire trin. Det første er en spærre: indholdsærlighed og tilgængelighed skal være mindst 3, og et enkelt opdigtet tal eller logo stopper lanceringen uanset resten. Det andet er at rette lavt scorende kriterier, der rammer kundens hovedopgave (ringe, booke, forstå prisen), før lavt scorende æstetiske kriterier. For en håndværker vejer indhold, brugbarhed, responsivitet og ydelse tungere end originalitet, og for et bureaus egen side kan originalitet veje mere. Det tredje er, at to personer scorer uafhængigt af hinanden og drøfter afvigelser på mere end ét point, fordi det er der, de nyttige uenigheder ligger. Det fjerde er at sammenligne samme site på tværs af iterationer og ikke forskellige sites med hinanden. Rubrikken viser, hvor næste time er bedst brugt, og den måler ikke, hvor godt designet er.

## Svage beslutninger og stærkere alternativer

| Svag beslutning | Stærkere alternativ | Begrundelse |
|---|---|---|
| H1 "Tømrer Roskilde" eller "Din maler i Odense" | "Ét fast hold fra første snak til aflevering. Tømrer i [by] siden [år]" | Bynavnet hører hjemme i title og tekst; H1 skal sige noget, kun dette firma kan sige [Vurdering] |
| "Vi går aldrig på kompromis med kvaliteten" | "Vi har kørt med de samme murere, VVS'ere, elektrikere og malere i 13 år" | Objektivt sprog +27 % brugbarhed ([NN/g](https://www.nngroup.com/articles/how-users-read-on-the-web/)) |
| "Få et uforpligtende tilbud" som eneste CTA | "Book besigtigelse (950 kr., trækkes fra ved accept)" plus "Ring 12 34 56 78" | Prisoplysning på forhånd ([NN/g](https://www.nngroup.com/articles/trustworthy-design/)) |
| Stockfoto af smilende håndværker | Mesterens eget portræt ved varevognen og opgavefotos med "Vindinge · 2024" | Rigtige portrætter får mere opmærksomhed ([NN/g](https://www.nngroup.com/articles/photos-as-web-content/)) |
| "4,9 ★ · 500+ glade kunder" uden kilde | "[x,x] af 5 på Anmeld Håndværker ([antal] anmeldelser)" med link til profilen | Korrekt gengivelse og § 13 ([Forbrugerombudsmanden](https://forbrugerombudsmanden.dk/media/46465/2016-retningslinjer-om-offentliggoerelse-af-brugeranmeldelser.pdf)) |
| Tre ikonkort: "Kvalitet", "Pålidelighed", "Service" | En prisliste i tabelform eller en tidslinje over processen | Tabeldata i tabeller; ikoner skal bære information ([Capital & Compute](https://capitalandcompute.net/blog/fix-ai-slop-design/)) |
| Lilla-blå gradient og glasmenu | Palet fra firmaets varevogn og materialer, accent kun på CTA | 60-30-10 og én accent ([NN/g](https://www.nngroup.com/articles/color-enhance-design/)) |
| Fade-up på hver sektion og tællende statistik | Indhold synligt fra start; feedback ved tryk og en enkelt indgangsanimation | Bevægelse med opgave; reduced motion ([MDN](https://developer.mozilla.org/fr/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion)) |
| Garantilogo "for en sikkerheds skyld" | Logo kun hvis dækket, med link til ordningen | Falsk Byg Garanti-påstand kan straffes ([Rigsadvokaten](https://www.retsinformation.dk/eli/retsinfo/2022/9124/dan/pdf)) |
| "Spar med håndværkerfradraget" på en malerside | Fradrag nævnt kun på VVS-, vindues-, isolerings- og kloakydelser | Fradragslisten 2026 ([skat.dk](https://skat.dk/borger/fradrag/servicefradrag/haandvaerkerfradrag)) |
| Alt-tekst "elektriker herlev" eller "slider1" | "Ny eltavle monteret i rækkehus i Herlev, 2025" | Alt-tekst beskriver billedet og styrker specificitet [Vurdering] |
| Demo med "Mads Egholm" og 212 Google-anmeldelser | Demo med tydelig mærkning, pladsholder til eget portræt og anmeldelseskomponent med "jeres anmeldelser her" | Ingen opdigtet dokumentation ([EUR-Lex](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32019L2161)) |

## Brief-skabelon før første linje kode

```text
PROJEKT-BRIEF (udfyldes før design og kode)

1. Firma og fag: ________  Rigtigt eller fiktivt (demo)? ________
2. Hvad laver firmaet, og hvad laver det ikke? ________
3. Kunder: privat / boligforening / erhverv. Område og kørselsradius: ________
4. Besøgendes 3 vigtigste opgaver (fx ringe, booke besigtigelse, se pris): ________
5. Følelse siden skal give (ét eller to ord): ________
6. Det, der adskiller firmaet, som et tjekbart faktum: ________
7. Rigtigt indhold, der findes (sæt kryds og angiv kilde):
   [ ] mesterportræt  [ ] opgavefotos med sted/år  [ ] priser/gebyrer
   [ ] CVR/adresse    [ ] garantiordning           [ ] autorisationsnr.
   [ ] eksterne anmeldelser (platform, antal, link)  [ ] håndværkerfradrag relevant?
8. Designsætning (én linje): ________
9. Tre til fem bærende greb: ________
10. Palet, 4–6 navngivne farver med roller, hentet fra: ________
11. Skrifter og begrundelse knyttet til faget: ________
12. Billedretning (motiv, lys, formater): ________
13. Bevægelsesprincip (ét): ________
14. Standarder vi bevidst fravælger (tjek mod listen over første og anden bølge): ________
15. Begrænsninger: tilgængelighed (AA), ydelse (LCP ≤ 2,5 s), hosting, budget: ________
16. Demo: mærkning, noindex, fiktivt navn tjekket mod CVR, ingen opdigtede tal? ________
```

## Slutkontrol af det renderede site

**[Vurdering]** Processen bygger på de ovenstående kilder og skal udføres på det renderede site, ikke på koden. Design Theater-studiet viser, at planen og resultatet ofte ikke stemmer overens ([arXiv](https://arxiv.org/abs/2607.22928)).

Start med at åbne siden ved 360, 768 og 1280 px og ved 200 % browserzoom. Tjek, at der ikke er vandret scroll, at telefonnummeret kan nås på mobil, og at flydende typografi skalerer ved tekstzoom ([Utopia](https://utopia.fyi/blog/clamp/)). Lav derefter slørtesten ved 5 og 10 px: hierarkiet skal overleve, og et stærkt farvet billede må ikke tage opmærksomheden fra CTA'en ([NN/g](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/)). Gå hele siden igennem kun med tastatur, og tjek synlig fokus, logisk rækkefølge og at dialoger og menuer kan lukkes. Slå reduceret bevægelse til i styresystemet, og tjek, at bevægelse erstattes og ikke bare forsvinder, og at intet indhold er skjult ([MDN](https://developer.mozilla.org/fr/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion)). Mål kontrasten på brødtekst, nedtonet tekst, knapper og demo-banneret mod 4,5:1 og 3:1 ([W3C](https://w3c.github.io/wcag/understanding/contrast-minimum)).

Kør derefter PageSpeed Insights på mobil og tjek LCP, INP og CLS mod grænserne. Bekræft, at LCP-elementet ikke er lazy-loaded, og at fontskift ikke flytter layoutet ([web.dev](https://web.dev/articles/optimize-lcp); [web.dev](https://web.dev/articles/font-best-practices)). Test formularen med tomme felter, forkerte værdier og afsendelse, og tjek fejl- og succestilstand. Tryk på alle `tel:`-, `mailto:`- og kortlinks på en rigtig telefon. Gennemgå hvert billede for NN/g's AI-artefakter i tekst, hænder, skærme, refleksioner og baggrunde, og i kontekst ved den faktiske beskæring ([NN/g](https://nngroup.com/articles/ai-generated-images)).

Lav til sidst en indholdsrevision. Hvert tal skal kunne findes i kildefilen, og telefonnummer, adresse, anmeldelsestal, serviceområde og firmanavn skal være ens overalt. Søg efter forbudte ord og danske AI-tegn ("ikke bare … men", tretrinsslogans, mange tankestreger, "Løft dit …") ([Folkeskolen](https://www.folkeskolen.dk/guide/saadan-spotter-du-ai-sprog-i-elevernes-afleveringer/)), og efter pladsholdere som `[acf field=…]`, "lorem", "#" og "slider1". Læs teksten højt for en dansker, der ikke har set den før. Scor siden med rubrikken, ret de laveste punkter, der rammer hovedopgaven, og gentag. For demoer kontrolleres det til sidst, at mærkningen er synlig, at `noindex` står i den renderede `<head>`, og at intet ligner bevis for et rigtigt firma.

## Det, vi stadig ikke ved

Der findes ingen kontrolleret undersøgelse af, at sider uden AI-præg konverterer bedre. Bureauernes påstande om konverteringsløft er ikke dokumenterede, og ingen kilde har målt, hvor meget hvert enkelt tegn skader tillid. De nyeste danske tal om valg af håndværker er fra 2018 og 2021, og der blev ikke fundet en undersøgelse af, hvordan danskere bedømmer håndværkeres *hjemmesider*. NN/g's AI-billedstudie testede ikke AI-portrætter af ejere eller ansatte og ikke mærkede AI-billeder, så netop den situation er uafprøvet for lokale firmaer. Den ordrette tekst i markedsføringslovens § 5 og bilag 1 nr. 23b og 23c kunne ikke hentes, så den danske gennemførelse af Omnibus-reglerne er udledt af EU-forpligtelserne. Der findes ingen vejledning om bureauers demo-sider. Skrifttyper og farver på de fleste casesider kunne ikke verificeres, og mobiladfærd blev ikke testet visuelt. Endelig er alle konkrete tal for spacing-forhold, gitre, typeparring og "hvornår store overskrifter bliver en kliché" designsmag og ikke forskning.

## Kilder

| Kategori | Kilde |
|---|---|
| Værktøjsproducenter | [Anthropic: Improving frontend design through Skills (nov. 2025)](https://claude.com/resources/articles/improving-frontend-design-through-skills) · [Anthropic frontend-design SKILL.md](https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md) · [Vercel v0: Design systems](https://v0.app/docs/design-systems) · [shadcn/ui docs](https://ui.shadcn.com/docs) · [Tailwind CSS: box-shadow](https://tailwindcss.com/docs/box-shadow) |
| Forskning om AI-design | [Design Theater, arXiv 2607.22928 (juli 2026)](https://arxiv.org/abs/2607.22928) · [NN/g: GenUI vs. Vibe Coding (mar. 2026)](https://nngroup.com/articles/genui-vs-vibe) · [NN/g: AI-generated images (aug. 2026)](https://nngroup.com/articles/ai-generated-images) |
| Troværdighed og indhold | [Stanford Guidelines for Web Credibility](https://credibility.stanford.edu/guidelines/index.html) · [Fogg m.fl./Consumer WebWatch 2002](https://advocacy.consumerreports.org/research/how-do-people-evaluate-a-web-sites-credibility) · [NN/g: Trustworthiness in Web Design](https://www.nngroup.com/articles/trustworthy-design/) · [NN/g: Photos as Web Content](https://www.nngroup.com/articles/photos-as-web-content/) · [NN/g: How Users Read on the Web](https://www.nngroup.com/articles/how-users-read-on-the-web/) · [Salminen m.fl. 2020](https://ciencia.iscte-iul.pt/id/ci-pub-61720) |
| Typografi, layout, farve | [Butterick: Line length](https://practicaltypography.com/line-length.html) · [Line spacing](https://practicaltypography.com/line-spacing.html) · [Letterspacing](https://practicaltypography.com/letterspacing.html) · [Utopia: clamp](https://utopia.fyi/blog/clamp/) · [NN/g: Visual Hierarchy](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/) · [NN/g: Using Color](https://www.nngroup.com/articles/color-enhance-design/) · [NN/g: Proximity](https://www.nngroup.com/videos/proximity-gestalt/) · [MDN: object-position](https://developer.mozilla.org/en-US/docs/Web/CSS/object-position) |
| Standarder og ydelse | [W3C: Contrast (Minimum)](https://w3c.github.io/wcag/understanding/contrast-minimum) · [W3C: Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html) · [APCA introduction](https://github.com/Myndex/apca-introduction) · [web.dev: Core Web Vitals thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds?hl=en) · [web.dev: Optimize LCP](https://web.dev/articles/optimize-lcp) · [web.dev: Lazy loading](https://web.dev/articles/browser-level-image-lazy-loading) · [web.dev: Fonts](https://web.dev/articles/font-best-practices) · [MDN: prefers-reduced-motion](https://developer.mozilla.org/fr/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion) · [Material 3 motion tokens](https://raw.githubusercontent.com/material-components/material-components-android/master/docs/theming/Motion.md) · [Val Head: animation timing](https://valhead.com/?p=2978) |
| Praktikere og presse | [Capital & Compute (sep. 2026)](https://capitalandcompute.net/blog/fix-ai-slop-design/) · [avoid-ai-design](https://github.com/funboy322/avoid-ai-design) · [Impeccable](https://github.com/pbakaus/impeccable) · [Krebs: Design slop report](https://www.adriankrebs.ch/design-slop-report.html) · [prg.sh](https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website) · [925Studios](https://www.925studios.co/blog/ai-slop-web-design-guide) · [Creative Bloq (jun. 2026)](https://www.creativebloq.com/ai/everything-looks-the-same-now-what) · [AIBase om Wathan](https://news.aibase.com/news/20365) |
| Dansk og EU-ret | [Direktiv 2019/2161 (EUR-Lex)](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32019L2161) · [Markedsføringsloven § 13](https://danskelove.dk/markedsf%C3%B8ringsloven/13) · [LBK 1420/2024](https://www.retsinformation.dk/eli/lta/2024/1420) · [Forbrugerombudsmanden: brugeranmeldelser](https://forbrugerombudsmanden.dk/media/46465/2016-retningslinjer-om-offentliggoerelse-af-brugeranmeldelser.pdf) · [Rigsadvokaten: markedsføring](https://www.retsinformation.dk/eli/retsinfo/2022/9124/dan/pdf) · [Dansk Erhverv: Norström 2021](https://www.danskerhverv.dk/presse-og-nyheder/nyheder/2021/marts/norstrom-i-dag-fauna-energi-politianmeldt-for-falske-brugeranmeldelser/) · [Dansk Erhverv: Rekom/NightPay 2026](https://www.danskerhverv.dk/presse-og-nyheder/nyheder/2026/januar/rekom-group-og-nightpay-idomt-boder-for-vildledning-pa-trustpilot/) · [FTC: fake reviews rule](https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials) · [Autorisationsloven kap. 3](https://www.lovguiden.dk/loven/lov-om-autorisation-af-virksomheder-på-el-vvs-og-kloakinstallationsområdet/kapitel-3) · [skat.dk: håndværkerfradrag](https://skat.dk/borger/fradrag/servicefradrag/haandvaerkerfradrag) |
| Danske håndværkere og forbrugere | [TEKNIQ/YouGov 2021](https://www.tekniq.dk/pressemeddelelser/2021/oktober/vi-bruger-mund-til-mund-metoden-naar-der-skal-vaelges-haandvaerker/) · [KFST forbrugerundersøgelse](https://kfst.dk/media/53650/20190125-forbrugerundersoegelse-haandvaerkerydelser.pdf) · [DI Byggeri: Byg Garanti](https://www.danskindustri.dk/brancher/di-byggeri/nyheder/arkiv/nyheder/2026/2/tilvalg-af-byg-garanti-tiltrakker-forbrugerkunder/) · [Bolius: anmeldelser](https://www.bolius.dk/anmeldelser-af-haandvaerkere-kan-du-stole-paa-dem-21031) · [Bolius: valg af håndværker](https://www.bolius.dk/valg-af-gode-haandvaerkere-17196) · [Forbrugerrådet Tænk](https://taenk.dk/forbrugerliv/bolig/dette-skal-du-vide-inden-du-hyrer-en-haandvaerker) · [Folkeskolen: AI-sprog](https://www.folkeskolen.dk/guide/saadan-spotter-du-ai-sprog-i-elevernes-afleveringer/) · [Dansk Sprognævn: skjulte anglicismer](https://dsn.dk/nyt-fra-sprognaevnet/januar-2026/skjulte-anglicismer-i-det-danske-sprog/) |
| Casesider | [locomotive.ca](https://locomotive.ca/en) · [pentagram.com](https://www.pentagram.com) · [teenage.engineering](https://teenage.engineering) · [linear.app](https://linear.app) · [Linear redesign-blog](https://linear.app/now/how-we-redesigned-the-linear-ui) · [FontAlternatives: Aesop](https://fontalternatives.com/inspiration/aesop-suisse/) · [kinfolk.com](https://www.kinfolk.com) · [gardehvalsoe.dk](https://www.gardehvalsoe.dk) · [brdr-kruger.com](https://brdr-kruger.com) · [lillegrocery.com](https://www.lillegrocery.com/) · [apentbakeri.no](https://www.apentbakeri.no) · [mathias-winther.dk](https://mathias-winther.dk/forside/) · [tmah.dk](https://www.tmah.dk/) · [naesby-maler.dk](https://naesby-maler.dk/) · [hhrel-teknik.dk](https://hhrel-teknik.dk/elektriker-herlev/) · [tomrermesterulrik.dk](https://tomrermesterulrik.dk/toemrer-roskilde/) |

## Konklusion

Spørgsmålet "hvordan får man AI-sider til at føles menneskelige" viser sig at handle mindre om design end forventet. Det visuelle AI-præg skyldes standarder, der ikke er valgt, og det kan fjernes med tokens og en designsætning på en eftermiddag. Det, der virkelig adskiller en troværdig håndværkerside, er indhold, som en AI ikke kan opfinde uden at lyve: mesterens ansigt, taget i Vindinge i 2024, besigtigelsesprisen og linket til de 156 anmeldelser. Det vender Makkernes rolle om. Bureauets værdi ligger ikke i at generere sider, men i at hente de rigtige fakta og fotos ud af håndværkeren og vise dem ordentligt. En del af produktet er derfor en indsamlingsproces: en fotoguide til mobilen, en tjekliste over CVR, garanti, autorisation og anmeldelsesplatform og en samtale om priser.

For demoerne er paradokset, at jo mere ærlige de er om at være fiktive, jo stærkere sælger de. En demo med "her kommer jeres egne anmeldelser" og en realistisk prisliste viser prospekten præcis den mekanik, der gør konkurrenternes sider svage, og den viser samtidig, at Makkerne ikke snyder. Det næste konkrete skridt er at fjerne de opfundne anmeldelsestal og det navngivne stockportræt fra de seks eksempelsider, give hver demo sin egen typografiske retning og flytte hero-billederne ud af lazy loading. Derefter kan resten af denne rapport bruges som review-standard for alle sider, bureauet laver.
