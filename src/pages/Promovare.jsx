// src/pages/Promovare.jsx
import { useEffect } from "react";
import { Link } from "react-router-dom";

const PACKS = [
  { id: "featured7", days: 7, price: 30, badge: "⭐" },
  { id: "featured14", days: 14, price: 50, badge: "⭐⭐" },
  { id: "featured30", days: 30, price: 80, badge: "⭐⭐⭐" },
];

export default function Promovare() {
  useEffect(() => {
    document.title = "Promovare anunț | Oltenița Imobiliare";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.setAttribute(
      "content",
      "Promovează-ți anunțul pe Oltenița Imobiliare: pachete 7/14/30 zile, prețuri, cum funcționează și ce avantaje primești."
    );
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f6fb]">
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-14">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Promovează-ți anunțul
          </h1>
          <p className="text-gray-600 mt-2">
            Anunțurile promovate apar evidențiat și au vizibilitate mai mare pe prima pagină.
          </p>

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <Link
              to="/anunturile-mele"
              className="inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-5 py-2 rounded-lg transition"
            >
              ⚡ Mergi la anunțurile mele
            </Link>
            <Link
              to="/adauga-anunt"
              className="inline-flex items-center justify-center bg-white border hover:bg-gray-50 text-gray-800 font-semibold px-5 py-2 rounded-lg transition"
            >
              ➕ Postează un anunț
            </Link>
          </div>

          <p className="text-xs text-gray-500 mt-3">
            Notă: plata se face din pagina anunțului, apăsând „Promovează anunțul” (doar proprietarul anunțului poate promova).
          </p>
        </div>

        {/* Pachete */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pachete și prețuri</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PACKS.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl shadow-sm border p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="text-2xl">{p.badge}</div>
                  <span className="text-xs px-3 py-1 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-900 font-semibold">
                    {p.days} zile
                  </span>
                </div>

                <div className="mt-3 text-3xl font-extrabold text-gray-900">
                  {p.price} lei
                </div>
                <div className="text-sm text-gray-600 mt-1">plată unică</div>

                <ul className="mt-4 text-sm text-gray-700 space-y-2">
                  <li>✅ Evidențiere „PROMOVAT” pe card</li>
                  <li>✅ Prioritate mai bună în listă</li>
                  <li>✅ Mai multe șanse să fii văzut rapid</li>
                </ul>

                <div className="mt-5 text-xs text-gray-500">
                  Pachet: <span className="font-mono">{p.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cum funcționează */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Cum funcționează</h3>
            <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
              <li>Postezi un anunț (gratuit).</li>
              <li>Intri în anunțul tău și apeși „Promovează anunțul”.</li>
              <li>Alegi pachetul 7 / 14 / 30 zile.</li>
              <li>Plătești securizat, apoi anunțul devine „PROMOVAT”.</li>
            </ol>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Întrebări frecvente</h3>
            <div className="text-sm text-gray-700 space-y-3">
              <div>
                <div className="font-semibold">Pot promova orice anunț?</div>
                <div className="text-gray-600">
                  Doar proprietarul (contul/telefonul care a postat) poate promova.
                </div>
              </div>

              <div>
                <div className="font-semibold">Se poate prelungi promovarea?</div>
                <div className="text-gray-600">
                  Da, poți cumpăra un nou pachet după expirare.
                </div>
              </div>

              <div>
                <div className="font-semibold">Unde se vede promovarea?</div>
                <div className="text-gray-600">
                  Pe prima pagină și în listări, cu eticheta „PROMOVAT”.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA final */}
        <div className="mt-10 bg-gradient-to-r from-yellow-50 to-white border border-yellow-200 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Vrei vizibilitate mai mare?
              </h3>
              <p className="text-sm text-gray-700">
                Promovarea îți aduce mai mulți vizitatori și contacte mai rapide.
              </p>
            </div>

            <Link
              to="/anunturile-mele"
              className="inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-5 py-2 rounded-lg transition"
            >
              📋 Vezi anunțurile mele
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
