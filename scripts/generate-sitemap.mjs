import { mkdir, writeFile } from "node:fs/promises";
import { calarasiLocalitati } from "../src/data/calarasiLocalitati.js";

const baseUrl = "https://oltenitaimobiliare.ro";
const categories = ["case", "apartamente", "terenuri", "garsoniere", "spatii-comerciale", "garaje"];
const staticPaths = [
  "/",
  "/anunturi",
  "/adauga-anunt",
  "/ghid-imobiliar",
  "/observator-imobiliar",
  "/case",
  "/apartamente",
  "/terenuri",
  "/spatii-comerciale",
  "/garsoniere",
  "/garaje"
];

const urls = new Set(staticPaths.map((path) => `${baseUrl}${path}`));

for (const locality of calarasiLocalitati) {
  urls.add(`${baseUrl}/observator-imobiliar/${locality.slug}`);
  for (const category of categories) {
    urls.add(`${baseUrl}/imobiliare/${category}/${locality.slug}`);
  }
}

const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...urls]
  .map((url) => `  <url>\n    <loc>${url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${url.includes("observator") ? "weekly" : "daily"}</changefreq>\n    <priority>${url === baseUrl + "/" ? "1.0" : url.includes("/imobiliare/") ? "0.8" : "0.7"}</priority>\n  </url>`)
  .join("\n")}
</urlset>\n`;

await mkdir("public", { recursive: true });
await writeFile("public/sitemap.xml", xml, "utf8");
console.log(`Sitemap generat cu ${urls.size} URL-uri.`);
