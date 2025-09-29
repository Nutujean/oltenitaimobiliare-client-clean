import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Anunturi() {
  const [listings, setListings] = useState([]);
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const categorie = params.get("categorie");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/listings`);
        const data = await res.json();

        if (categorie) {
          const filtrate = data.filter(
            (item) =>
              item.category &&
              item.category.toLowerCase().replace(" ", "-") === categorie
          );
          setListings(filtrate);
        } else {
          setListings(data);
        }
      } catch (error) {
        console.error("Eroare la încărcarea anunțurilor:", error);
      }
    };
    fetchListings();
  }, [categorie]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {categorie ? `Anunțuri - ${categorie}` : "Toate Anunțurile"}
      </h1>

      {listings.length === 0 ? (
        <p className="text-center text-gray-500">Nu există anunțuri în această categorie.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="relative border rounded-lg shadow hover:shadow-lg transition bg-white"
            >
              {/* Badge Rezervat */}
              {listing.status === "rezervat" && (
                <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                  Rezervat
                </span>
              )}

              <img
                src={
                  listing.imageUrl ||
                  (listing.images && listing.images[0]) ||
                  "https://via.placeholder.com/400x250?text=Fără+imagine"
                }
                alt={listing.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold mb-1">{listing.title}</h3>

                {listing.category && (
                  <Link
                    to={`/anunturi?categorie=${listing.category}`}
                    className="text-sm text-gray-500 hover:underline block mb-2 capitalize"
                  >
                    {listing.category}
                  </Link>
                )}

                <p className="text-gray-600 mb-2">{listing.price} €</p>
                <Link
                  to={`/anunt/${listing._id}`}
                  className="inline-block mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
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
