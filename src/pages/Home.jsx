import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PromoBanner from "../components/PromoBanner";
import API_URL from "../api";

const fundal = "/fundal.jpg";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔹 "Ping" rapid pentru a trezi backend-ul Render
    fetch(`${API_URL}/health`).catch(() => {});

    const fetchListings = async () => {
      try {
        const res = await fetch(`${API_URL}/listings`);
        const data = await res.json();
        setListings(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Eroare la preluarea anunțurilor:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <div>
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
          <Link
            to="/anunturi"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium"
          >
            Vezi Anunțurile
          </Link>
        </div>
      </div>

      {/* 🏘️ CATEGORII */}
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

      {/* 🔹 Banner partener */}
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
        ) : listings.length === 0 ? (
          <p className="text-gray-600">Nu există anunțuri momentan.</p>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fadeIn"
            style={{
              animation: "fadeIn 0.6s ease-in-out",
            }}
          >
            {listings.map((l) => {
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

      {/* 🔹 Efect fade-in definit inline */}
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
