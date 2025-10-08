import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../api";
import fundal from "/public/fundal.jpg";

export default function Home() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`${API_URL}/listings`);
        const data = await res.json();
        setListings(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Eroare la preluarea anunțurilor:", e);
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
            to="/categorie/apartamente"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium"
          >
            Vezi Anunțurile
          </Link>
        </div>
      </div>

      {/* LISTĂ ANUNȚURI */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Ultimele Anunțuri</h2>
        {listings.length === 0 ? (
          <p className="text-gray-600">Nu există anunțuri momentan.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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

                  {/* BADGE PROMOVAT */}
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
    </div>
  );
}
