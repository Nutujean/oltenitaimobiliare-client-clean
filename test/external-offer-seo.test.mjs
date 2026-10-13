import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { externalOfferImageByCategory, imageForExternalOffer, externalOfferImageAlt } from "../src/utils/externalOfferImages.js";

test("imagini locale reutilizate pentru toate categoriile și etichetate ca ilustrative", async () => {
  for (const [category, image] of Object.entries(externalOfferImageByCategory)) {
    assert.equal(imageForExternalOffer(category), image);
    assert.ok(image.startsWith("/") && !image.startsWith("//"), category);
    assert.match(externalOfferImageAlt(category), /nu este fotografia ofertei/);
    await access("public" + image);
  }
  assert.equal(imageForExternalOffer("altceva"), "/fundal.jpg");
});

test("pagina de referințe este noindex în HTML, însă homepage și sitemap păstrează indexarea", async () => {
  const external = await readFile("dist/oferte-externe/index.html", "utf8");
  const home = await readFile("dist/index.html", "utf8");
  const sitemap = await readFile("dist/sitemap-pages.xml", "utf8");
  assert.match(external, /name="robots" content="noindex, follow"/);
  assert.match(external, /rel="canonical" href="https:\/\/oltenitaimobiliare.ro\/oferte-externe"/);
  assert.match(home, /name="robots" content="index, follow"/);
  assert.doesNotMatch(sitemap, /<loc>https:\/\/oltenitaimobiliare.ro\/oferte-externe<\/loc>/);
});

test("UI marchează clar imaginile și nu importă fotografii ale surselor externe", async () => {
  const source = await readFile("src/components/ExternalOffers.jsx", "utf8");
  assert.match(source, /Imagine ilustrativă/);
  assert.match(source, /robots="noindex, follow"/);
  assert.match(source, /src=\{image\}/);
  assert.match(source, /Verifică|Vezi fotografiile reale/);
  assert.doesNotMatch(source, /src=\{offer\.(?:image|photo)/);
});
