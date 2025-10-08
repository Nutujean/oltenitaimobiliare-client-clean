import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function AnunturileMele() {
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        if (!token) {
          setError("Trebuie să fii autentificat pentru a-ți vedea anunțurile.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_URL}/listings/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Eroare la încărcarea anunțurilor mele");
        setMyListings(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Sigur vrei să ștergi acest anunț?")) return;

    try {
      const res = await fetch(`${API_URL}/listings/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare la ștergerea anunțului");

      setMyListings((prev) => prev.filter((item) => item._id !== id));
      alert("✅ Anunț șters cu succes.");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-600">Se încarcă anunțurile tale...</div>
    );

  if (error)
    return (
      <div className="text-center mt-10 text-red-600">
        {error}
        <div className="mt-4">
          <Link to="/login" className="text-blue-600 underline">
            Autentifică-te
          </Link>
        </div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Anunțurile mele
      </h1>

      {myListings.length === 0 ? (
        <p className="text-center text-gray-600">
          Nu ai adăugat încă niciun anunț.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {myListings.map((listing) => (
            <div
              key={listing._id}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
            >
              <Link to={`/anunt/${listing._id}`}>
                <img
                  src={
                    listing.images?.[0] ||
                    listing.imageUrl ||
                    "https://via.placeholder.com/400x250?text=Fara+imagine"
                  }
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
              </Link>

              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{listing.title}</h3>
                <p className="text-blue-700 font-bold">{listing.price} €</p>
                <p className="text-sm text-gray-500 mb-2">{listing.location}</p>

                {/* ✅ Afișăm butoanele doar dacă utilizatorul logat este proprietarul */}
                {user && String(user._id) === String(listing.user) && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => navigate(`/editeaza-anunt/${listing._id}`)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Editează
                    </button>
                    <button
                      onClick={() => handleDelete(listing._id)}
                      className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      Șterge
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
