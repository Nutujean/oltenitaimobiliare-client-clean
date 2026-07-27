import { mkdir, writeFile } from "node:fs/promises";
import { calarasiLocalitati } from "../src/data/calarasiLocalitati.js";

const baseUrl = "https://oltenitaimobiliare.ro";
const categories = ["case", "apartamente", "terenuri", "garsoniere", "spatii-comerciale", "garaje"];
const seoLocalitati = calarasiLocalitati.filter((locality) => locality.isUat);

const staticPaths = [
  "/",
  "/anunturi",
  "/despre-noi",
  "/contact",
  "/ghid-imobiliar",
  "/ghid-imobiliar/cum-scrii-un-anunt-bun",
  "/ghid-imobiliar/cum-faci-poze-bune",
  "/ghid-imobiliar/la-ce-sa-fii-atent-cand-cumperi-un-apartament",
  "/ghid-imobiliar/acte-necesare-pentru-vanzarea-unui-imobil",
  "/ghid-imobiliar/cum-alegi-un-chirias-potrivit",
  "/ghid-imobiliar/ce-trebuie-sa-verifici-inainte-sa-inchiriezi-o-locuinta",
  "/observator-imobiliar",
  "/case",
  "/apartamente",
  "/terenuri",
  "/spatii-comerciale",
  "/garsoniere",
  "/garaje",
];

const urls = new Set(staticPaths.map((route) => `${baseUrl}${route}`));

for (const locality of seoLocalitati) {
  urls.add(`${baseUrl}/observator-imobiliar/${locality.slug}`);
  for (const category of categories) {
    urls.add(`${baseUrl}/imobiliare/${category}/${locality.slug}`);
  }
}

const today = new Date().toISOString().slice(0, 10);
const escapeXml = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...urls]
  .map((url) => {
    const isSeoCombination = url.includes("/imobiliare/");
    const isLocalityHub = url.includes("/observator-imobiliar/");
    const isGuide = url.includes("/ghid-imobiliar/");
    return `  <url>\n    <loc>${escapeXml(url)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${isSeoCombination || isLocalityHub ? "weekly" : isGuide ? "monthly" : "daily"}</changefreq>\n    <priority>${url === `${baseUrl}/` ? "1.0" : isSeoCombination ? "0.75" : isLocalityHub ? "0.7" : isGuide ? "0.7" : "0.8"}</priority>\n  </url>`;
  })
  .join("\n")}
</urlset>\n`;

await mkdir("public", { recursive: true });
await writeFile("public/sitemap.xml", xml, "utf8");
console.log(`Sitemap generat cu ${urls.size} URL-uri prioritare pentru ${seoLocalitati.length} UAT-uri.`);
