import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../api";

export default function AnunturileMele() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Nu ești autentificat.");

        const res = await fetch(`${API_URL}/listings/my`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ token trimis corect
          },
        });

        const data = await res.json();
        if (!res.ok)
          throw new Error(data?.error || "Eroare la încărcarea anunțurilor mele");

        setListings(data);
      } catch (err) {
        console.error("Eroare la încărcarea anunțurilor mele:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, []);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-600">Se încarcă anunțurile...</div>
    );

  if (error)
    return (
      <div className="p-6 text-center text-red-600">
        <p>{error}</p>
        <Link to="/login" className="text-blue-600 hover:underline">
          Autentificare
        </Link>
      </div>
    );

  if (!listings.length)
    return (
      <div className="p-6 text-center text-gray-500">
        Nu ai încă niciun anunț publicat.
        <br />
        <Link to="/adauga-anunt" className="text-blue-600 hover:underline">
          Adaugă primul tău anunț
        </Link>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Anunțurile mele</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => {
          const isPromoted =
            listing.featuredUntil &&
            new Date(listing.featuredUntil).getTime() > Date.now();

          return (
            <div
              key={listing._id}
              className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden transition"
            >
              <Link to={`/anunt/${listing._id}`}>
                <img
                  src={
                    listing.images?.[0] ||
                    "/noimage.jpg"
                  }
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
              </Link>

              <div className="p-4">
                <h2 className="font-semibold text-lg truncate">
                  {listing.title}
                </h2>
                <p className="text-blue-600 font-bold">{listing.price} €</p>
                <p className="text-gray-500 text-sm">{listing.location}</p>
                {isPromoted && (
                  <p className="text-yellow-600 text-sm font-medium mt-1">
                    🌟 Promovat
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
