import { useEffect, useState } from "react";
import { API_URL } from "../config";

export default function AnunturileMele() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeListing, setActiveListing] = useState(null);
  const token = localStorage.getItem("token");

  // 🔹 Încarcă anunțurile utilizatorului logat
  const fetchMyListings = async () => {
    try {
      const res = await fetch(`${API_URL}/listings/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare la încărcarea anunțurilor mele");
      setListings(data);
    } catch (err) {
      console.error("Eroare la încărcarea anunțurilor mele:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchMyListings();
  }, [token]);

  // 🔹 Șterge anunț
  const handleDelete = async (id) => {
    if (!confirm("Sigur dorești să ștergi acest anunț?")) return;
    try {
      const res = await fetch(`${API_URL}/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare la ștergerea anunțului");
      alert("✅ Anunț șters cu succes!");
      fetchMyListings();
    } catch (err) {
      alert(err.message);
    }
  };

  // 🔹 Deschide popup pentru alegerea planului
  const openPromoteOptions = (listingId) => {
    setActiveListing(listingId);
  };

  // 🔹 Trimite către Stripe planul ales
  const handlePromote = async (plan) => {
    if (!activeListing) return;
    try {
      const res = await fetch(`${API_URL}/stripe/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ listingId: activeListing, plan }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare la promovare");
      window.location.href = data.url;
    } catch (err) {
      console.error("Eroare la promovare:", err);
      alert(err.message);
    }
  };

  if (!token) {
    return (
      <div className="p-6 text-center text-gray-600">
        <p>🔒 Trebuie să te autentifici pentru a vedea anunțurile tale.</p>
      </div>
    );
  }

  if (loading) return <p className="p-6 text-gray-500">Se încarcă anunțurile...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 relative">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Anunțurile Mele</h1>

      {listings.length === 0 ? (
        <p className="text-gray-600">Nu ai adăugat încă niciun anunț.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {listings.map((listing) => {
            const featuredUntil = listing.featuredUntil
              ? new Date(listing.featuredUntil)
              : null;
            const now = new Date();
            const isFeatured = featuredUntil && featuredUntil > now;
            const dateText = featuredUntil
              ? featuredUntil.toLocaleDateString("ro-RO", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : null;

            return (
              <div
                key={listing._id}
                className={`border rounded-lg shadow-md p-4 flex flex-col justify-between relative ${
                  isFeatured ? "border-yellow-400" : ""
                }`}
              >
                {/* Badge pentru proprietar */}
                {isFeatured && (
                  <span className="absolute top-2 right-2 bg-yellow-400 text-white text-xs px-2 py-1 rounded-full shadow">
                    ⭐ Promovat până la {dateText}
                  </span>
                )}

                <div>
                  {listing.images?.length > 0 ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-48 object-cover rounded-md mb-3"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                      Fără imagine
                    </div>
                  )}

                  <h2 className="text-xl font-semibold">{listing.title}</h2>
                  <p className="text-gray-700 mb-2">{listing.price} €</p>
                  <p className="text-sm text-gray-500 mb-3">
                    {listing.location} • {listing.category}
                  </p>
                </div>

                <div className="flex justify-between gap-2 mt-3">
                  <button
                    onClick={() => (window.location.href = `/editeaza-anunt/${listing._id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                  >
                    Editează
                  </button>

                  <button
                    onClick={() => handleDelete(listing._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Șterge
                  </button>

                  <button
                    onClick={() => openPromoteOptions(listing._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                  >
                    Promovează
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Popup alegere plan */}
      {activeListing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl w-80">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Alege tipul de promovare
            </h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handlePromote("featured7")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                7 zile – 8 €
              </button>
              <button
                onClick={() => handlePromote("featured14")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                14 zile – 15 €
              </button>
              <button
                onClick={() => handlePromote("featured30")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                30 zile – 25 €
              </button>
            </div>

            <button
              onClick={() => setActiveListing(null)}
              className="mt-5 text-gray-500 hover:text-gray-700 block w-full text-center"
            >
              ✖ Anulează
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
