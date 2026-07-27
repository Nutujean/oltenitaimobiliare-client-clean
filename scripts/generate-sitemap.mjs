import { mkdir, writeFile } from "node:fs/promises";
import { calarasiLocalitati } from "../src/data/calarasiLocalitati.js";

const baseUrl = "https://oltenitaimobiliare.ro";
const categories = ["case", "apartamente", "terenuri", "garsoniere", "spatii-comerciale", "garaje"];
const staticPaths = [
  "/",
  "/anunturi",
  "/despre-noi",
  "/contact",
  "/ghid-imobiliar",
  "/observator-imobiliar",
  "/case",
  "/apartamente",
  "/terenuri",
  "/spatii-comerciale",
  "/garsoniere",
  "/garaje",
  ...categories.map((category) => `/categorie/${category}`),
];

const urls = new Set(staticPaths.map((route) => `${baseUrl}${route}`));

for (const locality of calarasiLocalitati) {
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
    return `  <url>\n    <loc>${escapeXml(url)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${isSeoCombination ? "weekly" : isLocalityHub ? "weekly" : "daily"}</changefreq>\n    <priority>${url === `${baseUrl}/` ? "1.0" : isSeoCombination ? "0.8" : isLocalityHub ? "0.7" : "0.6"}</priority>\n  </url>`;
  })
  .join("\n")}
</urlset>\n`;

await mkdir("public", { recursive: true });
await writeFile("public/sitemap.xml", xml, "utf8");
console.log(`Sitemap generat cu ${urls.size} URL-uri pentru ${calarasiLocalitati.length} localități.`);
