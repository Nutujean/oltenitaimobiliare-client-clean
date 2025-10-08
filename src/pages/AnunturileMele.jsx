import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function AnunturileMele() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("Nu ești autentificat.");
      setLoading(false);
      return;
    }

    const fetchMyListings = async () => {
      try {
        const res = await fetch(`${API_URL}/listings/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Eroare la încărcarea anunțurilor mele");
        }
        const data = await res.json();
        setListings(data);
      } catch (e) {
        console.error("Eroare la încărcarea anunțurilor mele:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, [token]);

  const handleDelete = async (id) => {
    if (!token) return alert("Trebuie să fii autentificat.");
    if (!window.confirm("Sigur vrei să ștergi acest anunț?")) return;

    try {
      const res = await fetch(`${API_URL}/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Eroare la ștergere.");
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (e) {
      alert("Eroare la ștergere: " + e.message);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p>Se încarcă anunțurile tale...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-3">
          {error}
        </h2>
        <Link
          to="/login"
          className="text-blue-600 hover:underline"
        >
          Autentifică-te pentru a-ți vedea anunțurile
        </Link>
      </div>
    );

  if (!listings.length)
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 mb-4">
          Nu ai adăugat încă niciun anunț.
        </p>
        <Link
          to="/adauga-anunt"
          className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
        >
          + Adaugă primul tău anunț
        </Link>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Anunțurile mele</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div
            key={listing._id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <img
              src={
                listing.images?.[0] ||
                listing.imageUrl ||
                "https://via.placeholder.com/400x250?text=Fără+imagine"
              }
              alt={listing.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{listing.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{listing.location}</p>
              <p className="text-blue-700 font-bold">{listing.price} €</p>

              {/* butoane doar dacă e logat */}
              {token && (
                <div className="flex justify-between mt-4">
                  <Link
                    to={`/editeaza-anunt/${listing._id}`}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition"
                  >
                    ✏️ Editează
                  </Link>
                  <button
                    onClick={() => handleDelete(listing._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
                  >
                    🗑️ Șterge
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
