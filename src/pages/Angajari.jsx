import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../api";

export default function Angajari() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

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
      "Angajări în Oltenița și împrejurimi: locuri de muncă, colaborări și servicii. Publicarea este disponibilă doar contra cost."
    );
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await fetch(`${API_URL}/listings?section=angajari&sort=newest`);
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
      } catch (e) {
        setErr("Nu pot încărca anunțurile de angajare.");
        setJobs([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f6fb] px-4 py-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="bg-white rounded-2xl shadow-md border p-8">
          <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Angajări</h1>
              <p className="mt-2 text-gray-600">
                Anunțuri de locuri de muncă și colaborări în Oltenița și localitățile din jur.
                <span className="font-semibold"> Publicarea este doar plătită</span> și anunțul devine automat promovat.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/"
                  className="px-4 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50"
                >
                  ← Înapoi acasă
                </Link>

                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-blue-700 text-white hover:opacity-90"
                  onClick={() => alert("Următorul pas: publicare job (plătit) – legăm Stripe.")}
                >
                  💼 Publică job (plătit)
                </button>
              </div>
            </div>

            <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl">
              💼
            </div>
          </div>

          <div className="mt-8">
            {loading && <div className="text-gray-600">Se încarcă...</div>}
            {err && <div className="text-red-600">{err}</div>}

            {!loading && !err && jobs.length === 0 && (
              <div className="rounded-xl border border-dashed p-6 text-center text-gray-600">
                Nu există încă anunțuri de angajare.
                <div className="mt-2 text-sm text-gray-500">
                  Publică primul anunț (plătit) și va fi afișat aici.
                </div>
              </div>
            )}

            {!loading && !err && jobs.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((j) => (
                  <div
                    key={j._id}
                    className="relative bg-white rounded-xl border shadow-sm p-5"
                  >
                    {j.featuredUntil && new Date(j.featuredUntil).getTime() > Date.now() && (
                      <span className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                        ⭐ PROMOVAT
                      </span>
                    )}

                    <h3 className="text-lg font-bold text-gray-900">{j.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{j.location}</p>

                    {j.description && (
                      <p className="text-sm text-gray-700 mt-3 line-clamp-4">
                        {j.description}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {j.createdAt
                          ? `Publicat: ${new Date(j.createdAt).toLocaleDateString("ro-RO")}`
                          : ""}
                      </span>
                      <span>ID: {String(j._id).slice(-6).toUpperCase()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
