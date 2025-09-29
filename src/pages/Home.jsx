import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/listings`);
        if (!res.ok) throw new Error("Eroare la încărcarea anunțurilor");
        const data = await res.json();
        setListings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  if (loading) return <p className="text-center mt-6">Se încarcă...</p>;
  if (error) return <p className="text-center text-red-500 mt-6">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Anunțuri disponibile</h2>
      {listings.length === 0 ? (
        <p className="text-center">Nu există anunțuri disponibile.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="relative border rounded shadow hover:shadow-lg bg-white"
            >
              {/* ✅ Badge Rezervat */}
              {listing.rezervat && (
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                  Rezervat
                </span>
              )}

              {/* ✅ Prima poză */}
              {listing.images?.length > 0 ? (
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-48 object-cover rounded-t"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t">
                  <span className="text-gray-500">Fără imagine</span>
                </div>
              )}

              <div className="p-4">
                <h3 className="text-lg font-bold">{listing.title}</h3>
                <p className="text-gray-600">{listing.location}</p>
                <p className="text-blue-600 font-semibold">{listing.price} EUR</p>

                <Link
                  to={`/anunt/${listing._id}`}
                  className="block mt-4 bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700"
                >
                  Vezi detalii
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
