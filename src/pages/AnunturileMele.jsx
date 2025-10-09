import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../api";

export default function AnunturileMele() {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState("");

  // ✅ preluare token din localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        if (!token) {
          setError("Nu ești autentificat.");
          return;
        }

        const res = await fetch(`${API_URL}/listings/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Eroare la încărcarea anunțurilor mele");

        setListings(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Eroare la încărcarea anunțurilor mele:", e);
        setError(e.message);
      }
    };

    fetchMyListings();
  }, [token]);

  // ✅ ștergere anunț
  const handleDelete = async (id) => {
    if (!window.confirm("Sigur vrei să ștergi acest anunț?")) return;

    try {
      const res = await fetch(`${API_URL}/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare la ștergere");

      setListings((prev) => prev.filter((l) => l._id !== id));
      alert("Anunțul a fost șters.");
    } catch (e) {
      console.error("Eroare la ștergere:", e);
      alert(e.message);
    }
  };

  // ✅ promovare anunț (Stripe)
  const handlePromoveaza = async (listingId, plan) => {
    try {
      const res = await fetch(`${API_URL}/stripe/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listingId, plan }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare la promovare");

      window.location.href = data.url; // redirecționează către Stripe Checkout
    } catch (e) {
      console.error("Eroare promovare:", e);
      alert(e.message || "Eroare la inițierea plății");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Anunțurile Mele</h1>

      {error && (
        <p className="text-center text-red-600 font-medium mb-4">{error}</p>
      )}

      {!token ? (
        <div className="text-center">
          <p>Trebuie să te autentifici pentru a vedea anunțurile tale.</p>
          <Link
            to="/login"
            className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Autentificare
          </Link>
        </div>
      ) : listings.length === 0 ? (
        <p className="text-gray-600 text-center">Nu ai anunțuri adăugate.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {listings.map((l) => {
            const isFeatured =
              l.featuredUntil && new Date(l.featuredUntil).getTime() > Date.now();

            return (
              <div
                key={l._id}
                className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition relative"
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

                  <div className="flex gap-2 mt-3">
                    <Link
                      to={`/editeaza-anunt/${l._id}`}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      Editează
                    </Link>
                    <button
                      onClick={() => handleDelete(l._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      Șterge
                    </button>
                  </div>

                  {/* 🔹 Butoane de promovare */}
                  <div className="flex flex-col gap-2 mt-4">
                    <button
                      onClick={() => handlePromoveaza(l._id, "featured7")}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Promovează 7 zile – 8 €
                    </button>

                    <button
                      onClick={() => handlePromoveaza(l._id, "featured14")}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Promovează 14 zile – 15 €
                    </button>

                    <button
                      onClick={() => handlePromoveaza(l._id, "featured30")}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Promovează 30 zile – 25 €
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
