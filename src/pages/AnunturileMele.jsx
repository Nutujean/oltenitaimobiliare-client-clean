import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../api";

export default function AnunturileMele() {
  const [successMsg, setSuccessMsg] = useState("");
  const [anunturi, setAnunturi] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ✅ Redirecționează automat dacă nu e logat
  useEffect(() => {
    if (!token || token === "undefined" || token === "null") {
      navigate("/login");
      return;
    }

    fetch(`${API_URL}/listings/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setAnunturi(Array.isArray(data) ? data : []))
      .catch((e) => console.error("Eroare:", e))
      .finally(() => setLoading(false));
  }, [token, navigate]);

  // ✅ Preia mesajul de succes (după adăugarea anunțului)
  useEffect(() => {
    const msg = sessionStorage.getItem("anuntAdaugat");
    if (msg) {
      setSuccessMsg(msg);
      sessionStorage.removeItem("anuntAdaugat");
      setTimeout(() => setSuccessMsg(""), 4000);
    }
  }, []);

  // ✅ Reîncarcă automat lista după adăugare anunț
  useEffect(() => {
    if (sessionStorage.getItem("refreshAnunturi") === "true") {
      sessionStorage.removeItem("refreshAnunturi");

      fetch(`${API_URL}/listings/my`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => setAnunturi(Array.isArray(data) ? data : []))
        .catch((e) => console.error("Eroare:", e))
        .finally(() => setLoading(false));
    }
  }, []);

       const stergeAnunt = async (id) => {
          if (!window.confirm("Sigur vrei să ștergi acest anunț?")) return;
         try {
       const stergeAnunt = async (id) => {
        if (!window.confirm("Sigur vrei să ștergi acest anunț?")) return;
         try {
    const res = await fetch(`${API_URL}/api/listings/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setAnunturi((prev) => prev.filter((a) => a._id !== id));
     } catch (e) {
    alert("❌ Eroare la ștergere");
      }
    };
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

  if (loading)
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Se încarcă anunțurile...</p>
      </div>
    );

  if (!anunturi.length)
    return (
      <div className="text-center bg-white p-8 rounded-xl shadow mt-10 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-3 text-gray-800">
          📋 Anunțurile mele
        </h1>
        <p className="text-gray-600 mb-4">Nu ai adăugat încă niciun anunț.</p>
        <Link
          to="/adauga-anunt"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg transition inline-block"
        >
          ➕ Adaugă primul tău anunț
        </Link>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* ✅ Mesaj verde elegant */}
      {successMsg && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg text-center font-semibold shadow-sm transition-opacity duration-700 ease-in-out">
          {successMsg}
        </div>
      )}

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {anunturi.map((a) => {
          const estePromovat =
            a.featuredUntil && new Date(a.featuredUntil) > new Date();

          const titlu = a.titlu || a.title;
          const pret = a.pret || a.price;
          const categorie = a.categorie || a.category;

          return (
            <div
              key={a._id}
              className="relative bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
            >
              {estePromovat && (
                <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-semibold px-2 py-1 rounded-full shadow">
                  🎖️ Promovat
                </span>
              )}

              {a.intent && (
                <span
                  className={`absolute top-2 right-2 text-white text-xs font-semibold px-2 py-1 rounded-full shadow ${
                    a.intent === "vand"
                      ? "bg-green-600"
                      : a.intent === "cumpar"
                      ? "bg-blue-600"
                      : a.intent === "inchiriez"
                      ? "bg-yellow-500 text-gray-900"
                      : "bg-purple-600"
                  }`}
                >
                  {a.intent === "vand"
                    ? "🏠 Vând"
                    : a.intent === "cumpar"
                    ? "🛒 Cumpăr"
                    : a.intent === "inchiriez"
                    ? "🔑 Închiriez"
                    : "♻️ Schimb"}
                </span>
              )}

              {a.images?.[0] ? (
                <img
                  src={a.images[0]}
                  alt={titlu}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                  Fără imagine
                </div>
              )}

              <div className="p-4">
                <h2 className="font-bold text-lg mb-1 line-clamp-2">{titlu}</h2>
                <p className="text-blue-700 font-semibold mb-1">{pret} €</p>
                <p className="text-sm text-gray-500 mb-3">{categorie}</p>

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
    </div>
  );
}
