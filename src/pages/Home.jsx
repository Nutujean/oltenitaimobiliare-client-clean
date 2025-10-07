import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "https://oltenitaimobiliare-backend.onrender.com/api";
const res = await fetch(`${API_URL}/listings`);

        const data = await res.json();
        console.log("✅ Date primite:", data);
        setListings(data);
      } catch (err) {
        console.error("Eroare la încărcarea anunțurilor:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Se încarcă anunțurile...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 🏠 Hero Section */}
      <section className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-3">
          Bine ai venit pe Oltenița Imobiliare
        </h1>
        <p className="text-gray-600">
          Găsește cele mai bune oferte din Oltenița și împrejurimi
        </p>
        <Link
          to="/adauga-anunt"
          className="inline-block mt-6 bg-blue-700 hover:bg-blue-800 text-white font-medium px-6 py-3 rounded-xl transition"
        >
          + Adaugă un anunț
        </Link>
      </section>

      {/* 📋 Lista de anunțuri */}
      {listings.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">
          Momentan nu există anunțuri disponibile.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {listings.map((listing) => {
            const isPromoted =
              listing.featuredUntil &&
              new Date(listing.featuredUntil).getTime() > Date.now();

            return (
              <div
                key={listing._id}
                className="relative bg-white border rounded-xl overflow-hidden shadow hover:shadow-lg transition"
              >
                <Link to={`/anunt/${listing._id}`}>
                  <div className="relative">
                    <img
                      src={
                        listing.images?.[0] ||
                        listing.imageUrl ||
                        "https://via.placeholder.com/400x250?text=Fără+imagine"
                      }
                      alt={listing.title}
                      className="w-full h-48 object-cover"
                    />

                    {/* 💎 Badge Promovat (cu text mic) */}
                    {isPromoted && (
                      <div className="absolute top-2 right-2 bg-blue-700 text-white text-xs px-2 py-1 rounded-lg shadow-md flex items-center gap-1">
                        💎 <span>Promovat</span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-1 truncate">
                    {listing.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-2 truncate">
                    {listing.location}
                  </p>
                  <p className="text-blue-700 font-bold text-lg">
                    {listing.price} €
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
