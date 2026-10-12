// Shared by the browser and the build-time HTML generator.
export const platform = {
  name: "Oltenița Imobiliare",
  url: "https://oltenitaimobiliare.ro",
  email: "oltenitaimobiliare@gmail.com",
  title: "Imobiliare Oltenița și județul Călărași | Oltenița Imobiliare",
  heading: "Anunțuri imobiliare în Oltenița și județul Călărași",
  description: "Caută apartamente, case, terenuri, garsoniere, garaje și spații comerciale de vânzare sau de închiriat în Oltenița și în tot județul Călărași.",
  summary: "OltenitaImobiliare.ro este o platformă de anunțuri imobiliare pentru Oltenița și întregul județ Călărași. Reunește anunțuri publicate de proprietari și agenții, organizate după localitate și tipul proprietății.",
  role: "Platforma publică anunțuri și facilitează contactul cu autorii lor. Prețurile, disponibilitatea și detaliile unei proprietăți se confirmă direct cu persoana care a publicat anunțul.",
  socialLinks: [
    { label: "Facebook", url: "https://www.facebook.com/profile.php?id=61583435146065" },
    { label: "TikTok", url: "https://www.tiktok.com/@oltenitaimobiliare.ro" },
  ],
};

export const platformCategories = [
  { label: "Apartamente", slug: "apartamente" },
  { label: "Case", slug: "case" },
  { label: "Terenuri", slug: "terenuri" },
  { label: "Garsoniere", slug: "garsoniere" },
  { label: "Spații comerciale", slug: "spatii-comerciale" },
  { label: "Garaje", slug: "garaje" },
];

export const platformLocalities = [
  { name: "Oltenița", slug: "oltenita" },
  { name: "Călărași", slug: "calarasi" },
  { name: "Fundulea", slug: "fundulea" },
  { name: "Budești", slug: "budesti" },
  { name: "Lehliu-Gară", slug: "lehliu-gara" },
  { name: "Chirnogi", slug: "chirnogi" },
];

export const platformFaqs = [
  {
    question: "Unde pot căuta anunțuri imobiliare în Oltenița?",
    answer: "Pe OltenitaImobiliare.ro poți căuta apartamente, case, terenuri, garsoniere, garaje și spații comerciale în Oltenița. Alege categoria și localitatea sau consultă lista tuturor anunțurilor.",
  },
  {
    question: "Platforma acoperă și alte localități din județul Călărași?",
    answer: "Da. Platforma acoperă municipiile Oltenița și Călărași, orașele Fundulea, Budești și Lehliu-Gară, precum și comunele și satele județului Călărași. Oferta disponibilă depinde de anunțurile publicate pentru fiecare localitate.",
  },
  {
    question: "Pot găsi proprietăți de vânzare și de închiriat?",
    answer: "Da. Anunțurile includ proprietăți de vânzare și de închiriat. Verifică tipul tranzacției, prețul și localitatea în detaliile anunțului.",
  },
  {
    question: "Cum contactez proprietarul sau agenția?",
    answer: "Deschide anunțul care te interesează și folosește datele de contact afișate de autor. Confirmă direct disponibilitatea proprietății și condițiile ofertei.",
  },
];

export const organizationSchema = {
  "@type": "Organization",
  "@id": `${platform.url}/#organization`,
  name: platform.name,
  alternateName: "OltenitaImobiliare.ro",
  url: `${platform.url}/`,
  description: platform.summary,
  email: platform.email,
  areaServed: { "@type": "AdministrativeArea", name: "Județul Călărași, România" },
  sameAs: platform.socialLinks.map((link) => link.url),
};

export const websiteSchema = {
  "@type": "WebSite",
  "@id": `${platform.url}/#website`,
  name: platform.name,
  alternateName: "OltenitaImobiliare.ro",
  url: `${platform.url}/`,
  inLanguage: "ro-RO",
  publisher: { "@id": organizationSchema["@id"] },
};

export function platformPageSchema(type, route, name, description) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${platform.url}${route}#page`,
    url: `${platform.url}${route}`,
    name,
    description,
    inLanguage: "ro-RO",
    isPartOf: { "@id": websiteSchema["@id"] },
    about: { "@id": organizationSchema["@id"] },
  };
}

export const aboutPage = {
  title: "Despre Oltenița Imobiliare | Platformă pentru județul Călărași",
  heading: "Despre Oltenița Imobiliare",
  description: "Află ce este OltenitaImobiliare.ro, ce localități acoperă și cum găsești anunțuri de vânzare și închiriere în Oltenița și județul Călărași.",
};

export const contactPage = {
  title: "Contact Oltenița Imobiliare | Suport pentru platformă",
  heading: "Contact Oltenița Imobiliare",
  description: "Contactează echipa OltenitaImobiliare.ro pentru întrebări despre platformă sau publicarea anunțurilor imobiliare din județul Călărași.",
};
