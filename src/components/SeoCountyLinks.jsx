import { Link } from "react-router-dom";

const localities = [
  ["Oltenița", "oltenita"],
  ["Călărași", "calarasi"],
  ["Fundulea", "fundulea"],
  ["Budești", "budesti"],
  ["Lehliu-Gară", "lehliu-gara"],
  ["Chirnogi", "chirnogi"],
  ["Modelu", "modelu"],
  ["Dragalina", "dragalina"]
];

const categories = [
  ["Case", "case"],
  ["Apartamente", "apartamente"],
  ["Terenuri", "terenuri"],
  ["Garsoniere", "garsoniere"],
  ["Spații comerciale", "spatii-comerciale"],
  ["Garaje", "garaje"]
];

export default function SeoCountyLinks() {
  return (
    <section className="border-t bg-slate-50" aria-label="Navigare imobiliară județul Călărași">
      <div className="max-w-7xl mx-auto px-5 py-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-blue-700">Județul Călărași</p>
            <h2 className="text-2xl font-black text-slate-900 mt-1">Explorează piața imobiliară locală</h2>
          </div>
          <Link to="/observator-imobiliar" className="font-bold text-blue-700 hover:text-blue-900">
            Vezi Observatorul Imobiliar →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-7">
          <div>
            <h3 className="font-bold text-slate-900 mb-3">Localități principale</h3>
            <div className="flex flex-wrap gap-2">
              {localities.map(([name, slug]) => (
                <Link key={slug} to={`/observator-imobiliar/${slug}`} className="rounded-full border bg-white px-3 py-2 text-sm hover:border-blue-500 hover:text-blue-700">
                  {name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-3">Căutări populare în Oltenița</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(([name, slug]) => (
                <Link key={slug} to={`/imobiliare/${slug}/oltenita`} className="rounded-full border bg-white px-3 py-2 text-sm hover:border-blue-500 hover:text-blue-700">
                  {name} în Oltenița
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
