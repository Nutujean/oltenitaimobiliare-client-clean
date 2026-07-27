import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { calarasiLocalitati } from "../src/data/calarasiLocalitati.js";

const baseUrl = "https://oltenitaimobiliare.ro";
const distDir = path.resolve("dist");
const template = await readFile(path.join(distDir, "index.html"), "utf8");
const seoLocalitati = calarasiLocalitati.filter((locality) => locality.isUat);

const categories = {
  case: {
    label: "Case",
    singular: "casă",
    title: "Case de vânzare și de închiriat în județul Călărași",
    description: "Descoperă case de vânzare și de închiriat în Oltenița, Călărași și în celelalte localități ale județului. Anunțuri imobiliare locale actualizate.",
  },
  apartamente: {
    label: "Apartamente",
    singular: "apartament",
    title: "Apartamente de vânzare și de închiriat în județul Călărași",
    description: "Vezi apartamente de vânzare și de închiriat în Oltenița, Călărași și în întreg județul. Oferte publicate de proprietari și agenții.",
  },
  terenuri: {
    label: "Terenuri",
    singular: "teren",
    title: "Terenuri de vânzare în județul Călărași",
    description: "Caută terenuri intravilane, extravilane și agricole în localitățile județului Călărași. Anunțuri locale de vânzare și închiriere.",
  },
  garsoniere: {
    label: "Garsoniere",
    singular: "garsonieră",
    title: "Garsoniere de vânzare și de închiriat în județul Călărași",
    description: "Găsește garsoniere de vânzare și de închiriat în Oltenița, Călărași și în localitățile județului. Anunțuri actualizate.",
  },
  "spatii-comerciale": {
    label: "Spații comerciale",
    singular: "spațiu comercial",
    title: "Spații comerciale în județul Călărași",
    description: "Vezi spații comerciale, birouri, magazine și hale de vânzare sau de închiriat în localitățile județului Călărași.",
  },
  garaje: {
    label: "Garaje",
    singular: "garaj",
    title: "Garaje de vânzare și de închiriat în județul Călărași",
    description: "Descoperă garaje de vânzare și de închiriat în Oltenița, Călărași și în celelalte localități ale județului.",
  },
};

const guideArticles = [
  ["Cum scrii un anunț imobiliar bun", "/ghid-imobiliar/cum-scrii-un-anunt-bun"],
  ["Cum faci poze bune pentru proprietate", "/ghid-imobiliar/cum-faci-poze-bune"],
  ["La ce să fii atent când cumperi un apartament", "/ghid-imobiliar/la-ce-sa-fii-atent-cand-cumperi-un-apartament"],
  ["Acte necesare pentru vânzarea unui imobil", "/ghid-imobiliar/acte-necesare-pentru-vanzarea-unui-imobil"],
  ["Cum alegi un chiriaș potrivit", "/ghid-imobiliar/cum-alegi-un-chirias-potrivit"],
  ["Ce verifici înainte să închiriezi o locuință", "/ghid-imobiliar/ce-trebuie-sa-verifici-inainte-sa-inchiriezi-o-locuinta"],
];

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const safeJson = (value) => JSON.stringify(value).replace(/</g, "\\u003c");

function buildDocument({ title, description, canonical, structuredData, content }) {
  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = html.replace(
    /<meta\s+name=["']description["'][^>]*>/i,
    `<meta name="description" content="${escapeHtml(description)}" />`
  );
  html = html.replace(
    /<meta\s+name=["']robots["'][^>]*>/i,
    '<meta name="robots" content="index, follow" />'
  );
  html = html.replace(
    /<meta\s+property=["']og:type["'][^>]*>/i,
    '<meta property="og:type" content="website" />'
  );
  html = html.replace(
    /<link\s+rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`
  );
  html = html.replace(
    /<meta\s+property=["']og:url["'][^>]*>/i,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`
  );
  html = html.replace(
    /<meta\s+property=["']og:title["'][^>]*>/i,
    `<meta property="og:title" content="${escapeHtml(title)}" />`
  );
  html = html.replace(
    /<meta\s+property=["']og:description["'][^>]*>/i,
    `<meta property="og:description" content="${escapeHtml(description)}" />`
  );
  html = html.replace(
    /<meta\s+name=["']twitter:title["'][^>]*>/i,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`
  );
  html = html.replace(
    /<meta\s+name=["']twitter:description["'][^>]*>/i,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`
  );
  html = html.replace(
    "</head>",
    `  <script type="application/ld+json" data-static-seo>${safeJson(structuredData)}</script>\n  </head>`
  );
  html = html.replace('<div id="root"></div>', `<div id="root">${content}</div>`);
  return html;
}

async function writeRoute(route, html) {
  const directory = path.join(distDir, ...route.split("/").filter(Boolean));
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "index.html"), html, "utf8");
}

function categoryLinks(locality) {
  return Object.entries(categories)
    .map(
      ([slug, category]) =>
        `<li><a href="/imobiliare/${slug}/${locality.slug}">${escapeHtml(category.label)} în ${escapeHtml(locality.name)}</a></li>`
    )
    .join("");
}

function localityLinks(categorySlug = null) {
  return seoLocalitati
    .map((locality) => {
      const route = categorySlug
        ? `/imobiliare/${categorySlug}/${locality.slug}`
        : `/observator-imobiliar/${locality.slug}`;
      return `<li><a href="${route}">${escapeHtml(locality.name)}</a></li>`;
    })
    .join("");
}

function localityKind(locality) {
  if (locality.type === "municipiu") return "municipiul";
  if (locality.type === "oraș") return "orașul";
  return "comuna";
}

let generated = 0;

for (const [categorySlug, category] of Object.entries(categories)) {
  const canonical = `${baseUrl}/${categorySlug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.title,
    description: category.description,
    url: canonical,
    isPartOf: { "@type": "WebSite", name: "OltenitaImobiliare.ro", url: baseUrl },
  };
  const content = `<main style="max-width:1100px;margin:40px auto;padding:0 20px;font-family:Arial,sans-serif;line-height:1.6">
    <nav><a href="/">Acasă</a> › ${escapeHtml(category.label)}</nav>
    <h1>${escapeHtml(category.title)}</h1>
    <p>${escapeHtml(category.description)}</p>
    <h2>${escapeHtml(category.label)} după localitate</h2>
    <ul>${localityLinks(categorySlug)}</ul>
    <p><a href="/adauga-anunt">Publică un anunț imobiliar</a></p>
  </main>`;
  await writeRoute(
    `/${categorySlug}`,
    buildDocument({
      title: `${category.title} | OltenitaImobiliare.ro`,
      description: category.description,
      canonical,
      structuredData,
      content,
    })
  );
  generated += 1;
}

const observatorTitle = "Observatorul pieței imobiliare din județul Călărași";
const observatorDescription = "Explorează anunțurile și statisticile imobiliare pentru municipiile, orașele și comunele județului Călărași.";
await writeRoute(
  "/observator-imobiliar",
  buildDocument({
    title: `${observatorTitle} | OltenitaImobiliare.ro`,
    description: observatorDescription,
    canonical: `${baseUrl}/observator-imobiliar`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: observatorTitle,
      description: observatorDescription,
      url: `${baseUrl}/observator-imobiliar`,
    },
    content: `<main style="max-width:1100px;margin:40px auto;padding:0 20px;font-family:Arial,sans-serif;line-height:1.6">
      <nav><a href="/">Acasă</a> › Observator imobiliar</nav>
      <h1>${escapeHtml(observatorTitle)}</h1>
      <p>${escapeHtml(observatorDescription)}</p>
      <h2>Localități analizate</h2><ul>${localityLinks()}</ul>
    </main>`,
  })
);
generated += 1;

const guideTitle = "Ghid imobiliar pentru vânzare, cumpărare și închiriere";
const guideDescription = "Sfaturi practice despre publicarea anunțurilor, fotografii, acte, cumpărarea și închirierea proprietăților în județul Călărași.";
await writeRoute(
  "/ghid-imobiliar",
  buildDocument({
    title: `${guideTitle} | OltenitaImobiliare.ro`,
    description: guideDescription,
    canonical: `${baseUrl}/ghid-imobiliar`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: guideTitle,
      description: guideDescription,
      url: `${baseUrl}/ghid-imobiliar`,
    },
    content: `<main style="max-width:1100px;margin:40px auto;padding:0 20px;font-family:Arial,sans-serif;line-height:1.6">
      <nav><a href="/">Acasă</a> › Ghid imobiliar</nav>
      <h1>${escapeHtml(guideTitle)}</h1>
      <p>${escapeHtml(guideDescription)}</p>
      <h2>Articole utile</h2>
      <ul>${guideArticles.map(([title, route]) => `<li><a href="${route}">${escapeHtml(title)}</a></li>`).join("")}</ul>
    </main>`,
  })
);
generated += 1;

for (const locality of seoLocalitati) {
  const localityCanonical = `${baseUrl}/observator-imobiliar/${locality.slug}`;
  const localityTitle = `Imobiliare ${locality.name}, Călărași – case, apartamente și terenuri`;
  const localityDescription = `Anunțuri și informații despre piața imobiliară din ${locality.name}, județul Călărași. Vezi case, apartamente, terenuri, garsoniere, spații comerciale și garaje.`;
  const localitySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: localityTitle,
    description: localityDescription,
    url: localityCanonical,
    isPartOf: { "@type": "WebSite", name: "OltenitaImobiliare.ro", url: baseUrl },
    about: {
      "@type": "Place",
      name: locality.name,
      containedInPlace: { "@type": "AdministrativeArea", name: "Județul Călărași" },
    },
  };
  const localityContent = `<main style="max-width:1100px;margin:40px auto;padding:0 20px;font-family:Arial,sans-serif;line-height:1.6">
    <nav><a href="/">Acasă</a> › <a href="/observator-imobiliar">Județul Călărași</a> › ${escapeHtml(locality.name)}</nav>
    <h1>${escapeHtml(localityTitle)}</h1>
    <p>${escapeHtml(localityDescription)}</p>
    <p>Pagina centralizează oferta publicată pentru ${escapeHtml(localityKind(locality))} ${escapeHtml(locality.name)} și oferă acces rapid la fiecare categorie de proprietate.</p>
    <h2>Categorii imobiliare în ${escapeHtml(locality.name)}</h2>
    <ul>${categoryLinks(locality)}</ul>
    <p><a href="/adauga-anunt">Publică un anunț imobiliar</a></p>
  </main>`;
  await writeRoute(
    `/observator-imobiliar/${locality.slug}`,
    buildDocument({
      title: localityTitle,
      description: localityDescription,
      canonical: localityCanonical,
      structuredData: localitySchema,
      content: localityContent,
    })
  );
  generated += 1;

  for (const [categorySlug, category] of Object.entries(categories)) {
    const canonical = `${baseUrl}/imobiliare/${categorySlug}/${locality.slug}`;
    const title = `${category.label} de vânzare și de închiriat în ${locality.name}, Călărași`;
    const description = `Găsește ${category.label.toLowerCase()} de vânzare și de închiriat în ${locality.name}, județul Călărași. Anunțuri locale actualizate pe OltenitaImobiliare.ro.`;
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: title,
      description,
      url: canonical,
      isPartOf: { "@type": "WebSite", name: "OltenitaImobiliare.ro", url: baseUrl },
      about: [
        {
          "@type": "Place",
          name: locality.name,
          containedInPlace: { "@type": "AdministrativeArea", name: "Județul Călărași" },
        },
        { "@type": "Thing", name: category.label },
      ],
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Acasă", item: `${baseUrl}/` },
          { "@type": "ListItem", position: 2, name: "Județul Călărași", item: `${baseUrl}/observator-imobiliar` },
          { "@type": "ListItem", position: 3, name: locality.name, item: localityCanonical },
          { "@type": "ListItem", position: 4, name: category.label, item: canonical },
        ],
      },
    };
    const content = `<main style="max-width:1100px;margin:40px auto;padding:0 20px;font-family:Arial,sans-serif;line-height:1.6">
      <nav><a href="/">Acasă</a> › <a href="/observator-imobiliar">Județul Călărași</a> › <a href="/observator-imobiliar/${locality.slug}">${escapeHtml(locality.name)}</a> › ${escapeHtml(category.label)}</nav>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(description)}</p>
      <p>Această pagină grupează anunțurile pentru ${escapeHtml(category.label.toLowerCase())} din ${escapeHtml(localityKind(locality))} ${escapeHtml(locality.name)} și se actualizează atunci când sunt publicate proprietăți noi.</p>
      <h2>Vezi toate categoriile din ${escapeHtml(locality.name)}</h2>
      <ul>${categoryLinks(locality)}</ul>
      <p><a href="/adauga-anunt">Publică un anunț pentru un ${escapeHtml(category.singular)}</a></p>
    </main>`;
    await writeRoute(
      `/imobiliare/${categorySlug}/${locality.slug}`,
      buildDocument({ title, description, canonical, structuredData, content })
    );
    generated += 1;
  }
}

console.log(`Au fost pre-randate ${generated} pagini SEO prioritare pentru ${seoLocalitati.length} UAT-uri.`);
