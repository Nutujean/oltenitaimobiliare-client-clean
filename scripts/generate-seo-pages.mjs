import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { calarasiLocalitati } from "../src/data/calarasiLocalitati.js";

const baseUrl = "https://oltenitaimobiliare.ro";
const distDir = path.resolve("dist");
const template = await readFile(path.join(distDir, "index.html"), "utf8");

const categories = {
  case: { label: "Case", singular: "casă" },
  apartamente: { label: "Apartamente", singular: "apartament" },
  terenuri: { label: "Terenuri", singular: "teren" },
  garsoniere: { label: "Garsoniere", singular: "garsonieră" },
  "spatii-comerciale": { label: "Spații comerciale", singular: "spațiu comercial" },
  garaje: { label: "Garaje", singular: "garaj" },
};

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

let generated = 0;

for (const locality of calarasiLocalitati) {
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
          {
            "@type": "ListItem",
            position: 2,
            name: "Județul Călărași",
            item: `${baseUrl}/observator-imobiliar`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: locality.name,
            item: localityCanonical,
          },
          { "@type": "ListItem", position: 4, name: category.label, item: canonical },
        ],
      },
    };
    const content = `<main style="max-width:1100px;margin:40px auto;padding:0 20px;font-family:Arial,sans-serif;line-height:1.6">
      <nav><a href="/">Acasă</a> › <a href="/observator-imobiliar">Județul Călărași</a> › <a href="/observator-imobiliar/${locality.slug}">${escapeHtml(locality.name)}</a> › ${escapeHtml(category.label)}</nav>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(description)}</p>
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

console.log(`Au fost pre-randate ${generated} pagini SEO pentru ${calarasiLocalitati.length} localități.`);
