import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PromoBanner from "../components/PromoBanner";
import API_URL from "../api";

const fundal = "/fundal.jpg";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("newest");
  const [intent, setIntent] = useState("");
  const [view, setView] = useState("grid");

  useEffect(() => {
    fetch(`${API_URL}/health`).catch(() => {});
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchListings = async (overrideSort) => {
    try {
      setLoading(true);
      const sortParam = overrideSort || sort || "newest";
      const res = await fetch(`${API_URL}/listings?sort=${sortParam}`);
      const data = await res.json();
      setListings(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Eroare la preluarea anunțurilor:", e);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let results = [...listings];

    const normalize = (str) =>
      (str || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    if (location) {
      const locFilter = normalize(location);
      results = results.filter((l) =>
        normalize(l.location).includes(locFilter)
      );
    }

    if (intent) {
      results = results.filter(
        (l) => l.intent && l.intent.toLowerCase() === intent.toLowerCase()
      );
    }

    setFiltered(results);
  }, [listings, location, intent]);

  const LOCATII = [
    "Localitate",
    "Oltenița",
    "Chirnogi",
    "Ulmeni",
    "Mitreni",
    "Clătești",
    "Spanțov",
    "Căscioarele",
    "Șoldanu",
    "Negoești",
    "Valea Roșie",
    "Radovanu",
    "Curcani",
    "Luica",
    "Nana",
    "Chiselet",
    "Mănăstirea",
    "Budești",
  ];

  return (
    <div className="min-h-screen bg-[#f4f6fb]">
      {/* HERO */}
      <div
        className="relative h-[60vh] flex items-center justify-center text-center text-white"
        style={{
          backgroundImage: `url(${fundal})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Găsește casa potrivită în Oltenița
          </h1>
          <p className="text-lg mb-2">
            Cele mai noi anunțuri imobiliare din Oltenița și împrejurimi
          </p>
          <p className="text-sm text-white/80">
            Oltenița • Chirnogi • Ulmeni • Mitreni • Spanțov • Budești
          </p>
        </div>
      </div>

      {/* FILTRE */}
      <section className="-mt-8 max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6 z-20 relative flex flex-col md:flex-row gap-4">
        <select
          className="border rounded-lg px-4 py-2 flex-1"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          {LOCATII.map((loc) => (
            <option key={loc} value={loc === "Localitate" ? "" : loc}>
              {loc}
            </option>
          ))}
        </select>

        <select
          className="border rounded-lg px-4 py-2 flex-1"
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
        >
          <option value="">Toate tipurile</option>
          <option value="vand">Vând</option>
          <option value="cumpar">Cumpăr</option>
          <option value="inchiriez">Închiriez</option>
          <option value="schimb">Schimb</option>
        </select>

        <select
          className="border rounded-lg px-4 py-2 flex-1"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Cele mai noi</option>
          <option value="cheapest">Preț crescător</option>
          <option value="expensive">Preț descrescător</option>
        </select>

        <button
          onClick={() => fetchListings()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Caută
        </button>

        <Link
          to="/adauga-anunt"
          className="bg-green-600 text-white px-6 py-2 rounded-lg text-center"
        >
          ➕ Postează anunț
        </Link>
      </section>

      {/* LISTĂ */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Ultimele anunțuri</h2>

        {loading ? (
          <p className="text-center text-gray-500">Se încarcă…</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500">Nu există anunțuri.</p>
        ) : (
          <div
            className={
              view === "grid"
                ? "grid grid-cols-2 md:grid-cols-3 gap-4"
                : "flex flex-col gap-4"
            }
          >
            {filtered.map((l) => {
              const isFeatured =
                l.featuredUntil &&
                new Date(l.featuredUntil).getTime() > Date.now();

              return (
                <Link
                  key={l._id}
                  to={`/anunt/${l._id}`}
                  className="relative bg-white rounded-xl shadow hover:shadow-lg overflow-hidden"
                >
                  {l.images?.[0] ? (
                    <img
                      src={l.images[0]}
                      alt={l.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      Fără imagine
                    </div>
                  )}

                  {isFeatured && (
                    <span className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-xs font-bold px-2 py-1 rounded">
                      ⭐ PROMOVAT
                    </span>
                  )}

                  <div className="p-4">
                    <h3 className="font-bold line-clamp-2">{l.title}</h3>
                    <p className="text-blue-700 font-semibold">{l.price} €</p>
                    <p className="text-sm text-gray-500">{l.location}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* BANNER */}
      <section className="max-w-6xl mx-auto px-4 mb-12">
        <PromoBanner />
      </section>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
