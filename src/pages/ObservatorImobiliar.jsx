import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { calarasiLocalitati } from "../data/calarasiLocalitati";

export default function ObservatorImobiliar() {
  const orase = calarasiLocalitati.filter((item) => item.type !== "comună");
  const comune = calarasiLocalitati.filter((item) => item.type === "comună");

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Observatorul Pieței Imobiliare din județul Călărași",
    description:
      "Statistici bazate pe anunțurile publicate pe OltenitaImobiliare.ro pentru localitățile din județul Călărași.",
    url: "https://oltenitaimobiliare.ro/observator-imobiliar",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Helmet>
        <title>Observatorul Pieței Imobiliare Călărași</title>
        <meta
          name="description"
          content="Vezi statistici imobiliare pentru Călărași, Oltenița, Budești, Fundulea, Lehliu-Gară și toate comunele județului Călărași."
        />
        <link
          rel="canonical"
          href="https://oltenitaimobiliare.ro/observator-imobiliar"
        />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <section className="rounded-2xl bg-slate-900 text-white p-6 md:p-10 mb-10">
        <p className="text-sm uppercase tracking-widest text-amber-300 mb-2">
          Date locale, actualizate automat
        </p>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Observatorul Pieței Imobiliare Călărași
        </h1>
        <p className="text-slate-200 max-w-3xl leading-relaxed">
          Urmărește oferta imobiliară din întreg județul Călărași. Statisticile
          sunt calculate exclusiv din anunțurile publicate pe platformă și devin
          mai precise pe măsură ce numărul proprietăților crește.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Municipii și orașe</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {orase.map((item) => (
            <Link
              key={item.slug}
              to={`/observator-imobiliar/${item.slug}`}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-blue-400 transition"
            >
              <p className="text-xs uppercase text-slate-500 mb-1">{item.type}</p>
              <h3 className="text-xl font-bold text-slate-900">{item.name}</h3>
              <p className="text-sm text-blue-700 mt-3">Vezi statistici →</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Comunele județului Călărași</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {comune.map((item) => (
            <Link
              key={item.slug}
              to={`/observator-imobiliar/${item.slug}`}
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-800 hover:border-blue-400 hover:text-blue-700 transition"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
