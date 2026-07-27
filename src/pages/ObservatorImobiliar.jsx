import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { calarasiLocalitati } from "../data/calarasiLocalitati";

const typeOrder = { municipiu: 0, "oraș": 1, "comună": 2, sat: 3 };
const sortedLocalities = [...calarasiLocalitati].sort((a, b) => {
  const typeDifference = (typeOrder[a.type] ?? 9) - (typeOrder[b.type] ?? 9);
  if (typeDifference !== 0) return typeDifference;
  return a.name.localeCompare(b.name, "ro");
});

export default function ObservatorImobiliar() {
  const municipiiOrase = sortedLocalities.filter(
    (item) => item.type === "municipiu" || item.type === "oraș"
  );
  const comune = sortedLocalities.filter((item) => item.type === "comună");
  const sate = sortedLocalities.filter((item) => item.type === "sat");

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Imobiliare în toate localitățile județului Călărași",
    description:
      "Pagini imobiliare locale pentru municipiile, orașele, comunele și satele disponibile pe OltenitaImobiliare.ro.",
    url: "https://oltenitaimobiliare.ro/observator-imobiliar",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: sortedLocalities.length,
      itemListElement: sortedLocalities.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: `https://oltenitaimobiliare.ro/observator-imobiliar/${item.slug}`,
      })),
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Helmet>
        <title>Imobiliare în toate localitățile din județul Călărași</title>
        <meta
          name="description"
          content={`Explorează pagini imobiliare pentru ${sortedLocalities.length} de localități din județul Călărași: case, apartamente, terenuri, garsoniere, spații comerciale și garaje.`}
        />
        <link
          rel="canonical"
          href="https://oltenitaimobiliare.ro/observator-imobiliar"
        />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <section className="rounded-2xl bg-slate-900 text-white p-6 md:p-10 mb-10">
        <p className="text-sm uppercase tracking-widest text-amber-300 mb-2">
          Toate localitățile județului Călărași
        </p>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Imobiliare locale în județul Călărași
        </h1>
        <p className="text-slate-200 max-w-3xl leading-relaxed">
          Alege localitatea pentru a vedea anunțurile active și paginile dedicate
          pentru case, apartamente, terenuri, garsoniere, spații comerciale și garaje.
        </p>
        <p className="mt-4 text-slate-300">
          Sunt incluse {municipiiOrase.length} municipii și orașe, {comune.length} comune
          și {sate.length} sate sau localități componente.
        </p>
      </section>

      <LocalitySection
        title="Municipii și orașe"
        items={municipiiOrase}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        prominent
      />

      <LocalitySection
        title="Comunele județului Călărași"
        items={comune}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
      />

      <LocalitySection
        title="Sate și localități componente"
        items={sate}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
      />
    </div>
  );
}

function LocalitySection({ title, items, className, prominent = false }) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className={className}>
        {items.map((item) => (
          <Link
            key={item.slug}
            to={`/observator-imobiliar/${item.slug}`}
            className={
              prominent
                ? "rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-blue-400 transition"
                : "rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-800 hover:border-blue-400 hover:text-blue-700 transition"
            }
          >
            {prominent ? (
              <>
                <p className="text-xs uppercase text-slate-500 mb-1">{item.type}</p>
                <h3 className="text-xl font-bold text-slate-900">{item.name}</h3>
                <p className="text-sm text-blue-700 mt-3">Vezi toate categoriile →</p>
              </>
            ) : (
              item.name
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
