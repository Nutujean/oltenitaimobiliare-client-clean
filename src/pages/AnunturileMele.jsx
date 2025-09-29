import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AnunturileMele() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    if (!isLoggedIn) return; // dacă nu e logat, nu facem fetch

    const fetchMyListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/listings/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Eroare la încărcarea anunțurilor");
        const data = await res.json();
        setListings(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchMyListings();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-600 text-lg">
          Trebuie să fii logat pentru a vedea <b>Anunțurile Mele</b>.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Mergi la Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Anunțurile Mele</h1>
      {listings.length === 0 ? (
        <p>Nu ai adăugat încă niciun anunț.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white"
            >
              <img
                src={
                  listing.imageUrl ||
                  (listing.images && listing.images[0]) ||
                  "https://via.placeholder.com/400x250?text=Fără+imagine"
                }
                alt={listing.title}
                className="w-full h-40 object-cover rounded mb-4"
              />
              <h2 className="text-lg font-bold mb-1">{listing.title}</h2>

              {/* Categoria mică sub titlu */}
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
                className="inline-block px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Detalii
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
