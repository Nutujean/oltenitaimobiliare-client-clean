import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Angajari() {
  useEffect(() => {
    document.title = "Angajări | Oltenița Imobiliare";

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.setAttribute(
      "content",
      "Angajări în Oltenița și împrejurimi: locuri de muncă, colaborări și servicii. Publică un anunț sau caută rapid."
    );
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f6fb] px-4 py-10">
      <div className="mx-auto w-full max-w-5xl">
        <div className="bg-white rounded-2xl shadow-md border p-8">
          <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Angajări</h1>
              <p className="mt-2 text-gray-600">
                Aici vor fi anunțuri de locuri de muncă, colaborări și servicii în
                Oltenița și localitățile din jur.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/"
                  className="px-4 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50"
                >
                  ← Înapoi acasă
                </Link>

                <Link
                  to="/adauga-anunt"
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:opacity-90"
                >
                  ➕ Postează anunț
                </Link>
              </div>
            </div>

            <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl">
              💼
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border bg-gray-50 p-5">
              <h3 className="font-semibold text-gray-900">Pentru candidați</h3>
              <p className="mt-1 text-sm text-gray-600">
                În curând vei putea filtra joburile pe domenii și localități.
              </p>
            </div>

            <div className="rounded-xl border bg-gray-50 p-5">
              <h3 className="font-semibold text-gray-900">Pentru angajatori</h3>
              <p className="mt-1 text-sm text-gray-600">
                Publică un anunț clar: rol, cerințe, program, salariu (dacă vrei) și
                contact.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-dashed p-6 text-center text-gray-600">
            Secțiunea este în pregătire. Dacă vrei, facem și un formular dedicat
            “Publică job” + listare separată față de anunțurile imobiliare.
          </div>
        </div>
      </div>
    </div>
  );
}
