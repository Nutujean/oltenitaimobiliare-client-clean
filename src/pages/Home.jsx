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

  useEffect(() => {
    // Ping backend to wake it up
    fetch(`${API_URL}/health`).catch(() => {});

    const fetchListings = async () => {
      try {
        const res = await fetch(`${API_URL}/listings`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setListings(data);
          setFiltered(data);
        }
      } catch (e) {
        console.error("Eroare la preluarea anunțurilor:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // 🔹 Funcție pentru aplicarea filtrelor
  const handleFilter = () => {
    let results = [...listings];

    if (location) {
      results = results.filter(
        (l) =>
          l.location?.toLowerCase().includes(location.toLowerCase()) ||
          l.location === location
      );
    }

    switch (sort) {
      case "newest":
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "cheap":
        results.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "expensive":
        results.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      default:
        break;
    }

    setFiltered(results);
  };

  const LOCATII = [
    "Localitate",
    "Oltenita",
    "Chirnogi",
    "Ulmeni",
    "Mitreni",
    "Clatesti",
    "Spantov",
    "Cascioarele",
    "Soldanu",
    "Negoiesti",
    "Valea Rosie",
    "Radovanu",
    "Curcani",
    "Luica",
    "Nana",
    "Chiselet",
    "Manastirea",
    "Budesti",
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
          <p className="text-lg mb-6">Cele mai noi anunțuri imobiliare din zonă</p>
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
            <option key={loc} value={loc === "Toate" ? "" : loc}>
              {loc}
            </option>
          ))}
        </select>

        <select
          className="border rounded-lg px-4 py-2 flex-1 bg-white"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Cele mai noi</option>
          <option value="oldest">Cele mai vechi</option>
          <option value="cheap">Preț crescător</option>
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
      <div className="max-w-sm mx-auto mt-10">
        <PromoBanner />
      </div>

      {/* LISTĂ ANUNȚURI */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Ultimele Anunțuri</h2>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600 border-solid"></div>
            <p className="ml-3 text-gray-500">Se încarcă anunțurile...</p>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-gray-600">Nu există anunțuri pentru filtrul selectat.</p>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fadeIn"
            style={{ animation: "fadeIn 0.6s ease-in-out" }}
          >
            {filtered.map((l) => {
              const isFeatured =
                l.featuredUntil && new Date(l.featuredUntil).getTime() > Date.now();

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

                  {isFeatured && (
                    <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded shadow">
                      PROMOVAT
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
          Caută locuințe, terenuri și spații comerciale în Oltenița și localitățile din jur.
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

      {/* 🔹 Efect fade-in */}
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
