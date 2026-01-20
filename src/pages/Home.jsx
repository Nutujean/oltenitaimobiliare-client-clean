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
            Cele mai noi anunțuri imobiliare din zonă
          </p>
          <p className="text-sm text-white/80">
            Oltenița • Chirnogi • Ulmeni • Mitreni • Spanțov • Budești • Chiselet • Spantov • Valea rosie • Negoiesti • Manastirea • Curcani • Soldanu • Radovanu • Cascioarele
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

        <Link
          to="/adauga-anunt"
          className="bg-green-600 text-white px-6 py-2 rounded-lg text-center"
        >
          ➕ Postează anunț
        </Link>
      </section>

      {/* CATEGORII */}
      <section className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">
          Categorii populare
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { name: "Apartamente", path: "/categorie/apartamente", img: "/apartamente.jpg" },
            { name: "Case", path: "/categorie/case", img: "/case.jpg" },
            { name: "Terenuri", path: "/categorie/terenuri", img: "/terenuri.jpg" },
            { name: "Garsoniere", path: "/categorie/garsoniere", img: "/garsoniere.jpg" },
            { name: "Garaje", path: "/categorie/garaje", img: "/garaje.jpg" },
            { name: "Spațiu comercial", path: "/categorie/spatiu-comercial", img: "/spatiu-comercial.jpg" },
          ].map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="relative rounded-xl overflow-hidden shadow-lg"
            >
              <img src={cat.img} alt={cat.name} className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-black/40" />
              <h3 className="absolute bottom-4 left-4 text-white text-xl font-semibold">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* BANNER PARTENER */}
      <section className="max-w-7xl mx-auto mt-12 px-4">
        <div className="bg-white rounded-2xl shadow-md p-6 flex justify-center">
          <PromoBanner />
        </div>
      </section>

      {/* LISTĂ ANUNȚURI */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Ultimele Anunțuri</h2>
<div className="flex justify-end gap-2 mb-4">
  <button
    type="button"
    onClick={() => setView("grid")}
    className={`px-3 py-2 rounded-lg border text-sm ${
      view === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-700"
    }`}
  >
    Carduri
  </button>

  <button
    type="button"
    onClick={() => setView("list")}
    className={`px-3 py-2 rounded-lg border text-sm ${
      view === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-700"
    }`}
  >
    Listă
  </button>
</div>

        {loading ? (
          <p>Se încarcă...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((l) => {
  const isFeatured =
    l.featuredUntil && new Date(l.featuredUntil).getTime() > Date.now();

  const isNew =
    l.createdAt &&
    (Date.now() - new Date(l.createdAt)) / (1000 * 60 * 60 * 24) <= 5;

  const isExpired =
    l.status === "expirat" ||
    (l.expiresAt && new Date(l.expiresAt) < new Date());

  const CardContent = (
    <>
      {l.images?.length > 0 ? (
        <img
          src={l.images[0]}
          alt={l.title}
          className="w-full h-56 object-cover"
        />
      ) : (
        <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-400">
          Fără imagine
        </div>
      )}

      {/* EXPIRAT */}
      {isExpired && (
        <span className="absolute top-2 left-2 bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded">
          EXPIRAT
        </span>
      )}

      {/* PROMOVAT */}
      {!isExpired && isFeatured && (
        <span className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-yellow-900 text-xs font-bold px-2 py-1 rounded shadow-md border border-yellow-700">
          ⭐ PROMOVAT
        </span>
      )}

      {/* NOU */}
      {!isExpired && !isFeatured && isNew && (
        <span className="absolute top-2 left-2 bg-gray-700 text-white text-xs px-2 py-1 rounded shadow">
          NOU
        </span>
      )}

      {/* Tip tranzacție */}
      {l.intent && (
        <span
          className={`absolute top-2 right-2 text-white text-xs font-semibold px-2 py-1 rounded-full shadow ${
            l.intent === "vand"
              ? "bg-green-600"
              : l.intent === "cumpar"
              ? "bg-blue-600"
              : l.intent === "inchiriez"
              ? "bg-yellow-500"
              : "bg-purple-600"
          }`}
        >
          {l.intent === "vand"
            ? "🏠 Vând"
            : l.intent === "cumpar"
            ? "🛒 Cumpăr"
            : l.intent === "inchiriez"
            ? "🔑 Închiriez"
            : "♻️ Schimb"}
        </span>
      )}

      <div className="p-4">
        <h3 className="font-bold text-lg line-clamp-2">{l.title}</h3>
        <p className="text-blue-700 font-semibold">{l.price} €</p>
        <p className="text-sm text-gray-500">{l.location}</p>
      </div>
    </>
  );

  return isExpired ? (
    <div
      key={l._id}
      className="relative bg-gray-100 rounded-xl shadow-md overflow-hidden opacity-70 cursor-not-allowed"
    >
      {CardContent}
    </div>
  ) : (
    <Link
      key={l._id}
      to={`/anunt/${l._id}`}
      className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
    >
      {CardContent}
    </Link>
  );
})}
      {/* HARTĂ */}
      <div className="mt-16 mb-10 text-center px-4">
        <h2 className="text-2xl font-bold text-blue-700 mb-3">
          Zona noastră - Oltenița și împrejurimi
        </h2>

        <iframe
          title="Harta Oltenița"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2842.6318092784483!2d26.6382815!3d44.0835869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1974a2fa07a5d%3A0x92ad81d23c90249f!2sOlteni%C8%9Ba!5e0!3m2!1sro!2sro!4v1699999999999"
          width="100%"
          height="320"
          style={{ border: 0, borderRadius: "12px" }}
          loading="lazy"
        />
      </div>
    </div>
  );
}
