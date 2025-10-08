import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config";

export default function AnunturileMele() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        if (!token) {
          setError("Nu ești autentificat.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_URL}/listings/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Eroare la încărcarea anunțurilor mele");
        const data = await res.json();
        setListings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, [token]);

  if (loading) return <p className="p-6">Se încarcă...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  if (listings.length === 0)
    return <p className="p-6 text-gray-600">Nu ai adăugat încă niciun anunț.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Anunțurile mele</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div
            key={listing._id}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            <img
              src={
                listing.images?.[0] ||
                "https://via.placeholder.com/400x250?text=Fără+imagine"
              }
              alt={listing.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{listing.title}</h3>
              <p className="text-gray-600 mb-2">{listing.price} €</p>
              <p className="text-sm text-gray-500">{listing.location}</p>

              {token ? (
                <div className="flex gap-2 mt-3">
                  <Link
                    to={`/editeaza-anunt/${listing._id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Editează
                  </Link>
                  <button
                    onClick={async () => {
                      if (
                        window.confirm(
                          "Sigur vrei să ștergi acest anunț?"
                        )
                      ) {
                        const res = await fetch(
                          `${API_URL}/listings/${listing._id}`,
                          {
                            method: "DELETE",
                            headers: { Authorization: `Bearer ${token}` },
                          }
                        );
                        if (res.ok)
                          setListings((prev) =>
                            prev.filter((a) => a._id !== listing._id)
                          );
                        else alert("Eroare la ștergere");
                      }
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Șterge
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-400 mt-3 italic">
                  * Autentifică-te pentru a edita sau șterge anunțurile tale
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
