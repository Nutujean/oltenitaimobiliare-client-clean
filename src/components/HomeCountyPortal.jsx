import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const localitatiPrincipale = [
  { name: "Călărași", slug: "calarasi" },
  { name: "Oltenița", slug: "oltenita" },
  { name: "Fundulea", slug: "fundulea" },
  { name: "Budești", slug: "budesti" },
  { name: "Lehliu-Gară", slug: "lehliu-gara" },
  { name: "Chirnogi", slug: "chirnogi" },
  { name: "Modelu", slug: "modelu" },
  { name: "Dragalina", slug: "dragalina" },
  { name: "Borcea", slug: "borcea" },
  { name: "Curcani", slug: "curcani" },
  { name: "Mânăstirea", slug: "manastirea" },
  { name: "Spanțov", slug: "spantov" },
];

const categorii = [
  { label: "Case", slug: "case" },
  { label: "Apartamente", slug: "apartamente" },
  { label: "Terenuri", slug: "terenuri" },
  { label: "Garsoniere", slug: "garsoniere" },
  { label: "Spații comerciale", slug: "spatii-comerciale" },
  { label: "Garaje", slug: "garaje" },
];

export default function HomeCountyPortal() {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white border-t border-blue-100">
      <Helmet>
        <title>Oltenița Imobiliare | Anunțuri imobiliare în tot județul Călărași</title>
        <meta
          name="description"
          content="Anunțuri imobiliare din întreg județul Călărași: Oltenița, Călărași, Fundulea, Budești, Lehliu-Gară și toate comunele. Publică gratuit case, apartamente, terenuri și spații comerciale."
        />
        <link rel="canonical" href="https://oltenitaimobiliare.ro/" />
        <meta property="og:title" content="Anunțuri imobiliare în județul Călărași | Oltenița Imobiliare" />
        <meta
          property="og:description"
          content="Caută sau publică proprietăți în toate localitățile județului Călărași."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="rounded-3xl bg-gradient-to-r from-blue-800 via-blue-700 to-cyan-600 text-white p-7 md:p-10 shadow-xl">
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 items-center">
            <div>
              <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                Platformă pentru întreg județul Călărași
              </span>
              <h2 className="mt-4 text-3xl md:text-4xl font-black leading-tight">
                Găsește sau publică proprietăți în orice localitate din județ
              </h2>
              <p className="mt-4 text-blue-50 max-w-3xl leading-7">
                OltenitaImobiliare.ro păstrează identitatea locală a brandului, dar acoperă acum municipiile,
                orașele și comunele din tot județul Călărași. Anunțurile sunt organizate automat după
                localitate și categorie.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/adauga-anunt"
                  className="inline-flex justify-center rounded-xl bg-white text-blue-800 font-bold px-5 py-3 hover:bg-blue-50 transition"
                >
                  ➕ Publică gratuit un anunț
                </Link>
                <Link
                  to="/observator-imobiliar"
                  className="inline-flex justify-center rounded-xl border border-white/40 bg-white/10 text-white font-bold px-5 py-3 hover:bg-white/20 transition"
                >
                  📊 Vezi Observatorul Imobiliar
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/15 p-5">
                <div className="text-3xl font-black">50+</div>
                <div className="mt-1 text-sm text-blue-50">localități acoperite</div>
              </div>
              <div className="rounded-2xl bg-white/15 p-5">
                <div className="text-3xl font-black">6</div>
                <div className="mt-1 text-sm text-blue-50">categorii imobiliare</div>
              </div>
              <div className="rounded-2xl bg-white/15 p-5 col-span-2">
                <div className="text-lg font-bold">Date reale, fără prețuri inventate</div>
                <div className="mt-1 text-sm text-blue-50">
                  Statisticile sunt calculate din anunțurile publicate pe platformă.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-2xl font-bold text-gray-900">Localități căutate</h3>
            <p className="mt-2 text-gray-600">Acces rapid la Observatorul Imobiliar local.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {localitatiPrincipale.map((localitate) => (
                <Link
                  key={localitate.slug}
                  to={`/observator-imobiliar/${localitate.slug}`}
                  className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800 hover:bg-blue-100 transition"
                >
                  {localitate.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-2xl font-bold text-gray-900">Explorează după categorie</h3>
            <p className="mt-2 text-gray-600">Exemple de pagini locale pentru Oltenița.</p>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categorii.map((categorie) => (
                <Link
                  key={categorie.slug}
                  to={`/imobiliare/${categorie.slug}/oltenita`}
                  className="rounded-xl border border-gray-200 px-4 py-3 font-semibold text-gray-800 hover:border-blue-400 hover:text-blue-700 transition"
                >
                  {categorie.label} în Oltenița →
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
