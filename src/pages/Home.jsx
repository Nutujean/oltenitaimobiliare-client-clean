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
        if (!res.ok) throw new Error("Nu s-au putut încărca anunțurile.");
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

  if (loading) return <p className="text-center mt-6">Se încarcă anunțurile...</p>;
  if (error) return <p className="text-center mt-6 text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Toate Anunțurile</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <Link
            key={listing._id}
            to={`/anunt/${listing._id}`}
            className="border rounded p-4 shadow bg-white hover:shadow-lg transition block"
          >
            <h3 className="font-bold">{listing.title}</h3>

            {/* ✅ Doar prima poză pe homepage */}
            {listing.images?.length > 0 && (
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="rounded mt-2 h-40 w-full object-cover"
              />
            )}

            <p className="mt-2 font-semibold">{listing.price} EUR</p>
            <p className="text-gray-600">{listing.location}</p>
            <p className="mt-2">
              {listing.rezervat ? (
                <span className="text-red-600 font-bold">Rezervat</span>
              ) : (
                <span className="text-green-600">Disponibil</span>
              )}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
