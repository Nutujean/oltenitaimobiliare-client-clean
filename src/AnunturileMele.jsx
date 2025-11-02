import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

export default function AnunturileMele() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔹 Încărcăm anunțurile utilizatorului
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetch(`${API_URL}/listings/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setListings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Eroare la încărcarea anunțurilor:", err);
        setLoading(false);
      });
  }, [token, navigate]);

  // 🔹 Ștergere anunț
  const handleDelete = async (id) => {
    if (!window.confirm("Sigur vrei să ștergi acest anunț?")) return;
    try {
      const res = await fetch(`${API_URL}/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare la ștergere");
      alert("✅ Anunț șters cu succes!");
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (e) {
      alert("❌ " + e.message);
    }
  };

  // 🔹 Promovare reală (Stripe)
  const handlePromote = async (id, plan) => {
    try {
      const res = await fetch(`${API_URL}/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: id, plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare la inițializarea plății");
      window.location.href = data.url; // redirecționează la Stripe Checkout
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-600">
        Se încarcă anunțurile...
      </div>
    );

  if (listings.length === 0)
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 mb-4">Nu ai încă anunțuri publicate.</p>
        <button
          onClick={() => navigate("/adauga-anunt")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Adaugă un anunț
        </button>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Anunțurile Mele</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {listings.map((l) => {
          const isPromoted =
            l.featuredUntil && new Date(l.featuredUntil) > new Date();

          return (
            <div
              key={l._id}
              className="bg-white shadow-md rounded-xl overflow-hidden relative border border-gray-200 hover:shadow-lg transition"
            >
              {isPromoted && (
                <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full shadow">
                  🎖️ Promovat
                </span>
              )}

              {l.images?.[0] ? (
                <img
                  src={l.images[0]}
                  alt={l.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                  Fără imagine
                </div>
              )}

              <div className="p-4">
                <h2 className="text-lg font-bold text-gray-800 mb-1">
                  {l.title}
                </h2>
                <p className="text-blue-700 font-semibold mb-1">
                  {l.price} €
                </p>
                {l.location && (
                  <p className="text-gray-600 text-sm mb-1">{l.location}</p>
                )}
                {l.phone && (
                  <p className="text-gray-700 text-sm mb-2">📞 {l.phone}</p>
                )}

                <div className="flex gap-2 mt-3 flex-wrap">
                  <button
                    onClick={() => handleDelete(l._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                  >
                    Șterge
                  </button>

                  {/* 🔹 Butoane reale Stripe */}
                  {!isPromoted && (
                    <>
                      <button
                        onClick={() => handlePromote(l._id, "featured7")}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                      >
                        ⭐ 7 zile / 50 lei
                      </button>
                      <button
                        onClick={() => handlePromote(l._id, "featured14")}
                        className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 text-sm"
                      >
                        ⭐ 14 zile / 85 lei
                      </button>
                      <button
                        onClick={() => handlePromote(l._id, "featured30")}
                        className="bg-yellow-700 text-white px-3 py-1 rounded hover:bg-yellow-800 text-sm"
                      >
                        ⭐ 30 zile / 125 lei
                      </button>
                    </>
                  )}

                  {isPromoted && (
                    <span className="text-xs text-green-700 font-semibold">
                      Activ până la{" "}
                      {new Date(l.featuredUntil).toLocaleDateString("ro-RO")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
