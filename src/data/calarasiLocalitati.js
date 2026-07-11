export const calarasiLocalitati = [
  { name: "Călărași", slug: "calarasi", type: "municipiu" },
  { name: "Oltenița", slug: "oltenita", type: "municipiu" },
  { name: "Budești", slug: "budesti", type: "oraș" },
  { name: "Fundulea", slug: "fundulea", type: "oraș" },
  { name: "Lehliu-Gară", slug: "lehliu-gara", type: "oraș" },
  { name: "Alexandru Odobescu", slug: "alexandru-odobescu", type: "comună" },
  { name: "Belciugatele", slug: "belciugatele", type: "comună" },
  { name: "Borcea", slug: "borcea", type: "comună" },
  { name: "Chirnogi", slug: "chirnogi", type: "comună" },
  { name: "Chiselet", slug: "chiselet", type: "comună" },
  { name: "Ciocănești", slug: "ciocanesti", type: "comună" },
  { name: "Căscioarele", slug: "cascioarele", type: "comună" },
  { name: "Cuza Vodă", slug: "cuza-voda", type: "comună" },
  { name: "Curcani", slug: "curcani", type: "comună" },
  { name: "Dichiseni", slug: "dichiseni", type: "comună" },
  { name: "Dor Mărunt", slug: "dor-marunt", type: "comună" },
  { name: "Dorobanțu", slug: "dorobantu", type: "comună" },
  { name: "Dragalina", slug: "dragalina", type: "comună" },
  { name: "Dragos Vodă", slug: "dragos-voda", type: "comună" },
  { name: "Frăsinet", slug: "frasinet", type: "comună" },
  { name: "Frumușani", slug: "frumusani", type: "comună" },
  { name: "Fundeni", slug: "fundeni", type: "comună" },
  { name: "Gălbinași", slug: "galbinasi", type: "comună" },
  { name: "Grădiștea", slug: "gradistea", type: "comună" },
  { name: "Gurbănești", slug: "gurbanesti", type: "comună" },
  { name: "Ileana", slug: "ileana", type: "comună" },
  { name: "Independența", slug: "independenta", type: "comună" },
  { name: "Jegălia", slug: "jegalia", type: "comună" },
  { name: "Lehliu", slug: "lehliu", type: "comună" },
  { name: "Luica", slug: "luica", type: "comună" },
  { name: "Lupșanu", slug: "lupsanu", type: "comună" },
  { name: "Mânăstirea", slug: "manastirea", type: "comună" },
  { name: "Mitreni", slug: "mitreni", type: "comună" },
  { name: "Modelu", slug: "modelu", type: "comună" },
  { name: "Nana", slug: "nana", type: "comună" },
  { name: "Nicolae Bălcescu", slug: "nicolae-balcescu", type: "comună" },
  { name: "Perișoru", slug: "perisoru", type: "comună" },
  { name: "Plătărești", slug: "plataresti", type: "comună" },
  { name: "Radovanu", slug: "radovanu", type: "comună" },
  { name: "Roseți", slug: "roseti", type: "comună" },
  { name: "Sărulești", slug: "sarulesti", type: "comună" },
  { name: "Sohatu", slug: "sohatu", type: "comună" },
  { name: "Spanțov", slug: "spantov", type: "comună" },
  { name: "Șoldanu", slug: "soldanu", type: "comună" },
  { name: "Ștefan cel Mare", slug: "stefan-cel-mare", type: "comună" },
  { name: "Ștefan Vodă", slug: "stefan-voda", type: "comună" },
  { name: "Tămădău Mare", slug: "tamadau-mare", type: "comună" },
  { name: "Ulmeni", slug: "ulmeni", type: "comună" },
  { name: "Ulmu", slug: "ulmu", type: "comună" },
  { name: "Unirea", slug: "unirea", type: "comună" },
  { name: "Valea Argovei", slug: "valea-argovei", type: "comună" },
  { name: "Vasilați", slug: "vasilati", type: "comună" },
  { name: "Vâlcelele", slug: "valcelele", type: "comună" }
];

export function normalizeLocality(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
