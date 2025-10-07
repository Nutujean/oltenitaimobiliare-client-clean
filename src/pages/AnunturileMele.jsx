import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AnunturileMele() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    async function fetchMyListings() {
      try {
        const res = await fetch(
          "https://oltenitaimobiliare-backend.onrender.com/api/listings/my",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Eroare la încărcarea anunțurilor mele");
        const data = await res.json();
        setListings(data);
      } catch (err) {
        console.error("Eroare la încărcarea anunțurilor mele:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMyListings();
  }, [token, navigate]);

  // 🔹 Funcție pentru promovare Stripe
  const handlePromoveaza = async (listingId, plan) => {
    try {
      const res = await fetch(
        "https://oltenitaimobiliare-backend.onrender.com/api/stripe/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ listingId, plan }),
        }
      );

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Eroare la inițierea plății.");
      }
    } catch (err) {
      console.error("Eroare la promovare:", err);
      alert("Eroare la inițierea plății.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Se încarcă anunțurile tale...
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-blue-700 mb-3">
          Anunțurile mele
        </h1>
        <p className="text-gray-600 mb-6">Nu ai publicat încă niciun anunț.</p>
        <Link
          to="/adauga-anunt"
          className="bg-blue-700 hover:bg-blue-800 text-white font-medium px-5 py-3 rounded-xl transition"
        >
          + Adaugă primul tău anunț
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Anunțurile mele</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => {
          const isPromoted =
            listing.featuredUntil &&
            new Date(listing.featuredUntil).getTime() > Date.now();

          const formattedDate = isPromoted
            ? new Date(listing.featuredUntil).toLocaleDateString("ro-RO", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : null;

          const showMenu = selectedPlan[listing._id];

          return (
            <div
              key={listing._id}
              className="relative bg-white border rounded-xl overflow-hidden shadow hover:shadow-lg transition"
            >
              <Link to={`/anunt/${listing._id}`}>
                <div className="relative">
                  <img
                    src={
                      listing.images?.[0] ||
                      listing.imageUrl ||
                      "https://via.placeholder.com/400x250?text=Fără+imagine"
                    }
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                  />

                  {isPromoted && (
                    <div className="absolute top-2 right-2 bg-blue-700 text-white text-xs px-2 py-1 rounded-lg shadow-md flex items-center gap-1">
                      💎 <span>Promovat</span>
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-4">
                <h2 className="text-lg font-semibold mb-1 truncate">
                  {listing.title}
                </h2>
                <p className="text-gray-600 text-sm mb-2 truncate">
                  {listing.location}
                </p>
                <p className="text-blue-700 font-bold text-lg mb-2">
                  {listing.price} €
                </p>

                {isPromoted ? (
                  <p className="text-xs text-green-700 font-medium">
                    Activ până la: {formattedDate}
                  </p>
                ) : (
                  <div className="mt-3">
                    {!showMenu ? (
                      <button
                        onClick={() =>
                          setSelectedPlan({ [listing._id]: true })
                        }
                        className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-sm font-medium px-3 py-2 rounded-lg shadow hover:opacity-90 transition"
                      >
                        💳 Promovează anunțul
                      </button>
                    ) : (
                      <div className="bg-gray-100 p-3 rounded-lg shadow-inner space-y-2">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Alege perioada:
                        </p>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() =>
                              handlePromoveaza(listing._id, "featured7")
                            }
                            className="bg-blue-700 text-white text-xs py-1.5 rounded hover:bg-blue-800"
                          >
                            7 zile – 5 €
                          </button>
                          <button
                            onClick={() =>
                              handlePromoveaza(listing._id, "featured14")
                            }
                            className="bg-blue-700 text-white text-xs py-1.5 rounded hover:bg-blue-800"
                          >
                            14 zile – 9 €
                          </button>
                          <button
                            onClick={() =>
                              handlePromoveaza(listing._id, "featured30")
                            }
                            className="bg-blue-700 text-white text-xs py-1.5 rounded hover:bg-blue-800"
                          >
                            30 zile – 15 €
                          </button>
                          <button
                            onClick={() => setSelectedPlan({})}
                            className="text-gray-500 text-xs mt-1 hover:underline"
                          >
                            Anulează
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-3 flex justify-between text-sm">
                  <Link
                    to={`/editeaza-anunt/${listing._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    ✏️ Editează
                  </Link>

                  <Link
                    to={`/anunt/${listing._id}`}
                    className="text-gray-700 hover:text-blue-600"
                  >
                    🔍 Vezi
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
