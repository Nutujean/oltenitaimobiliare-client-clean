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
  const [intent, setIntent] = useState(""); // tip anunț
  const [view, setView] = useState("grid"); // "grid" sau "list"

  useEffect(() => {
    // ping backend
    fetch(`${API_URL}/health`).catch(() => {});
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔹 Încărcare anunțuri din backend (fără filtre locale)
  const fetchListings = async (overrideSort) => {
    try {
      setLoading(true);

      const sortParam = overrideSort || sort || "newest";
      const res = await fetch(`${API_URL}/listings?sort=${sortParam}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setListings(data); // salvăm TOATE anunțurile
      } else {
        setListings([]);
      }
    } catch (e) {
      console.error("Eroare la preluarea anunțurilor:", e);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Aplică filtrele local de fiecare dată când se schimbă datele sau filtrele
  useEffect(() => {
    let results = [...listings];

    // normalizare pentru a ignora diacriticele
    const normalize = (str) =>
      (str || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    if (location) {
      const locFilter = normalize(location);
      results = results.filter((l) => {
        const loc = normalize(l.location);
        return loc.includes(locFilter);
      });
    }

    if (intent) {
      const intentFilter = intent.toLowerCase();
      results = results.filter(
        (l) =>
          l.intent &&
          l.intent.toLowerCase() === intentFilter
      );
    }

    setFiltered(results);
  }, [listings, location, intent]);

  const handleFilter = () => {
    // reface request-ul (în caz că s-au mai adăugat anunțuri între timp)
    fetchListings();
  };

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
      {/* HERO cu fundal */}
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
          <p className="text-lg mb-6">
            Cele mai noi anunțuri imobiliare din zonă
          </p>
        </div>
      </div>

      {/* 🔍 Filtru căutare */}
      <section className="-mt-8 max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6 z-20 relative flex flex-col md:flex-row gap-4 items-center justify-between">
        <select
          className="border rounded-lg px-4 py-2 flex-1 bg-white"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          {LOCATII.map((loc) => (
            <option key={loc} value={loc === "Localitate" ? "" : loc}>
              {loc}
            </option>
          ))}
        </select>

        {/* Filtru pentru tipul de anunț */}
        <select
          className="border rounded-lg px-4 py-2 flex-1 bg-white"
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
          className="border rounded-lg px-4 py-2 flex-1 bg-white"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            // dacă vrei sortare live când schimbi dropdown-ul:
            // fetchListings(e.target.value);
          }}
        >
          <option value="newest">Cele mai noi</option>
          <option value="cheapest">Preț crescător</option>
          <option value="expensive">Preț descrescător</option>
        </select>

        <button
          onClick={handleFilter}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg w-full md:w-auto"
        >
          Caută
        </button>

        <Link
          to="/adauga-anunt"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg w-full md:w-auto text-center"
        >
          + Adaugă anunț
        </Link>
      </section>

      {/* 🏘️ Categorii */}
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
              className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition" />
              <h3 className="absolute bottom-4 left-4 text-white text-xl font-semibold">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Banner partener */}
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
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600 border-solid"></div>
            <p className="ml-3 text-gray-500">Se încarcă anunțurile...</p>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-gray-600">
            Nu există anunțuri pentru filtrul selectat.
          </p>
        ) : (
          <div
  className={
    view === "grid"
      ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-fadeIn"
      : "flex flex-col gap-4 animate-fadeIn"
  }
  style={{ animation: "fadeIn 0.6s ease-in-out" }}
>
            {filtered.map((l) => {
  const isFeatured =
    l.featuredUntil && new Date(l.featuredUntil).getTime() > Date.now();

  // 🔸 considerăm anunț NOU dacă are max. 5 zile vechime
  let isNew = false;
  if (l.createdAt) {
    const created = new Date(l.createdAt);
    const diffMs = Date.now() - created.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    isNew = diffDays <= 5; // poți schimba 5 în 3, 7 etc.
  }

  return (
    <Link
      key={l._id}
      to={`/anunt/${l._id}`}
      className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
    >
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

      {/* 🔖 Badge „PROMOVAT” sau „NOU” */}
      {isFeatured ? (
        <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded shadow">
          PROMOVAT
        </span>
      ) : (
        isNew && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded shadow">
            NOU
          </span>
        )
      )}

      {/* Etichetă tip tranzacție */}
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
    </Link>
  );
})}
          </div>
        )}
      </div>

      {/* 🗺️ Harta Oltenița */}
      <div className="mt-16 mb-10 text-center px-4">
        <h2 className="text-2xl font-bold text-blue-700 mb-3">
          Zona noastră - Oltenița și împrejurimi
        </h2>
        <p className="text-gray-600 mb-4">
          Caută locuințe, terenuri și spații comerciale în Oltenița,Chrinogi,Ulmeni,Spantov,Radovanu și restul localităților din jur.
        </p>
        <iframe
          title="Harta Oltenița"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2842.6318092784483!2d26.6383!3d44.0836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1974a2fa07a5d%3A0x92ad81d23c90249f!2sOlteni%C8%9Ba!5e0!3m2!1sro!2sro!4v1699999999999"
          width="100%"
          height="320"
          style={{ border: 0, borderRadius: "12px" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

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
