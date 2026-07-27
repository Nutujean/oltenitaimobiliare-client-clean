import { LOCATII } from "../constants/localitati.js";

const MUNICIPII = new Set(["calarasi", "oltenita"]);
const ORASE = new Set(["budesti", "fundulea", "lehliu-gara"]);
const COMUNE = new Set([
  "alexandru-odobescu",
  "belciugatele",
  "borcea",
  "cascioarele",
  "chirnogi",
  "chiselet",
  "ciocanesti",
  "crivat",
  "curcani",
  "cuza-voda",
  "dichiseni",
  "dor-marunt",
  "dorobantu",
  "dragalina",
  "dragos-voda",
  "frasinet",
  "frumusani",
  "fundeni",
  "galbinasi",
  "gradistea",
  "gurbanesti",
  "ileana",
  "independenta",
  "jegalia",
  "lehliu",
  "luica",
  "lupsanu",
  "manastirea",
  "mitreni",
  "modelu",
  "nana",
  "nicolae-balcescu",
  "perisoru",
  "plataresti",
  "radovanu",
  "roseti",
  "sarulesti",
  "sohatu",
  "spantov",
  "soldanu",
  "stefan-cel-mare",
  "stefan-voda",
  "tamadau-mare",
  "ulmeni",
  "ulmu",
  "unirea",
  "valea-argovei",
  "vasilati",
  "valcelele",
  "vlad-tepes",
]);

export function normalizeLocality(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getLocalityType(slug) {
  if (MUNICIPII.has(slug)) return "municipiu";
  if (ORASE.has(slug)) return "oraș";
  if (COMUNE.has(slug)) return "comună";
  return "sat";
}

export const calarasiLocalitati = LOCATII.map((name) => {
  const slug = normalizeLocality(name);
  return {
    name,
    slug,
    type: getLocalityType(slug),
    isUat: MUNICIPII.has(slug) || ORASE.has(slug) || COMUNE.has(slug),
  };
});
