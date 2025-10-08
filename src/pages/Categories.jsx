import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API_URL from "../api";

export default function Categories() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryNames = {
    apartamente: "Apartamente",
    case: "Case",
    terenuri: "Terenuri",
    garsoniere: "Garsoniere",
    garaje: "Garaje",
    "spatiu-comercial": "Spațiu comercial",
  };

  const displayName = categoryNames[slug] || "Anunțuri";

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/listings`);
        const data = await res.json();

        const filtered = Array.isArray(data)
          ? data.filter(
              (item) =>
                item.category?.toLowerCase().replace(/\s+/g, "-") === slug
            )
          : [];

        setListings(filtered);
      } catch (e) {
        console.error("Eroare la preluarea anunțurilor pe categorie:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* 🟦 Titlu + buton Înapoi */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-blue-800">{displayName}</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg border shadow-sm transition"
        >
          ← Înapoi
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center">Se încarcă anunțurile...</p>
      ) : listings.length === 0 ? (
        <p className="text-gray-600 text-center">
          Nu există anunțuri în această categorie momentan.
        </p>
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
  );
}
