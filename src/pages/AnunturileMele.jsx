import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../api";

export default function AnunturileMele() {
  const [anunturi, setAnunturi] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/api/anunturile-mele`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setAnunturi(Array.isArray(data) ? data : []))
      .catch((e) => console.error("Eroare:", e))
      .finally(() => setLoading(false));
  }, []);

  const stergeAnunt = async (id) => {
    if (!window.confirm("Sigur vrei să ștergi acest anunț?")) return;
    try {
      const res = await fetch(`${API_URL}/api/anunturi/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setAnunturi((prev) => prev.filter((a) => a._id !== id));
    } catch (e) {
      alert("❌ Eroare la ștergere");
    }
  };

  const handlePromote = async (id, planKey) => {
    try {
      const res = await fetch(`${API_URL}/stripe/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ listingId: id, plan: planKey }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare la inițializarea plății");

      window.location.href = data.url; // Stripe redirect
    } catch (err) {
      alert("Eroare la promovare: " + err.message);
    }
  };

  if (!token)
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 mb-4">
          Trebuie să fii logat pentru a-ți vedea anunțurile.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Autentifică-te
        </button>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* ✅ Header cu buton de adăugare + profil */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          📋 Anunțurile Mele
        </h1>

        <div className="flex gap-3">
          <Link
            to="/adauga-anunt"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition inline-block"
          >
            + Adaugă anunț
          </Link>
          <Link
            to="/profil"
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition inline-block"
          >
            ⚙️ Profilul meu
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Se încarcă anunțurile...</p>
      ) : anunturi.length === 0 ? (
        <div className="text-center bg-white p-8 rounded-xl shadow">
          <p className="text-gray-600 mb-4">Nu ai adăugat încă niciun anunț.</p>
          <Link
            to="/adauga-anunt"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg transition inline-block"
          >
            ➕ Adaugă primul tău anunț
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {anunturi.map((a) => {
            const estePromovat =
              a.featuredUntil && new Date(a.featuredUntil) > new Date();

            return (
              <div
                key={a._id}
                className="relative bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
              >
                {/* 🔹 Badge Promovat */}
                {estePromovat && (
                  <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-semibold px-2 py-1 rounded-full shadow">
                    🎖️ Promovat
                  </span>
                )}

                {/* 🔹 Imagine */}
                {a.images?.[0] ? (
                  <img
                    src={a.images[0]}
                    alt={a.titlu}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                    Fără imagine
                  </div>
                )}

                <div className="p-4">
                  <h2 className="font-bold text-lg mb-1 line-clamp-2">
                    {a.titlu}
                  </h2>
                  <p className="text-blue-700 font-semibold mb-1">{a.pret} €</p>
                  <p className="text-sm text-gray-500 mb-3">{a.categorie}</p>

                  {/* 🔹 Butoane Editare / Ștergere */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <button
                      onClick={() => navigate(`/editeaza-anunt/${a._id}`)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                    >
                      ✏️ Editează
                    </button>
                    <button
                      onClick={() => stergeAnunt(a._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                      🗑️ Șterge
                    </button>
                  </div>

                  {/* 🔹 Promovare (Stripe) */}
                  {!estePromovat ? (
                    <div className="mt-3 border-t pt-3">
                      <p className="text-sm font-semibold text-blue-700 mb-1">
                        Promovează anunțul:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handlePromote(a._id, "featured7")}
                          className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-sm"
                        >
                          7 zile / 50 lei
                        </button>
                        <button
                          onClick={() => handlePromote(a._id, "featured14")}
                          className="bg-blue-700 text-white px-2 py-1 rounded hover:bg-blue-800 text-sm"
                        >
                          14 zile / 85 lei
                        </button>
                        <button
                          onClick={() => handlePromote(a._id, "featured30")}
                          className="bg-blue-800 text-white px-2 py-1 rounded hover:bg-blue-900 text-sm"
                        >
                          30 zile / 125 lei
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-green-700 mt-2 font-medium">
                      ✅ Promovat până la{" "}
                      {new Date(a.featuredUntil).toLocaleDateString("ro-RO")}.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
