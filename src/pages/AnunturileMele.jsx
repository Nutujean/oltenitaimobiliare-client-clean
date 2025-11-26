// src/pages/AnunturileMele.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../api";

export default function AnunturileMele() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userPhone = localStorage.getItem("userPhone");

    // dacă nu e logat → trimitem la login
    if (!token || !userPhone) {
      setMessage("Trebuie să fii autentificat pentru a vedea anunțurile tale.");
      navigate("/login");
      return;
    }

    const fetchMyListings = async () => {
      try {
        setLoading(true);
        setMessage("⏳ Se încarcă anunțurile tale...");

        // luăm TOATE anunțurile și filtrăm pe client după telefon
        const res = await fetch(`${API_URL}/listings`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Eroare la încărcarea anunțurilor.");
        }

        const normalizedPhone = userPhone.replace(/\D/g, "");
        const myListings = (data || []).filter((item) => {
          if (!item.phone) return false;
          const itemPhone = String(item.phone).replace(/\D/g, "");
          return itemPhone === normalizedPhone;
        });

        if (myListings.length === 0) {
          setMessage(
            "Momentan nu ai niciun anunț publicat cu acest număr de telefon."
          );
        } else {
          setMessage("");
        }

        setListings(myListings);
      } catch (err) {
        console.error("Eroare la încărcarea anunțurilor mele:", err);
        setMessage(err.message || "A apărut o eroare la încărcarea anunțurilor.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, [navigate]);

  const handleAdaugaAnunt = () => {
    navigate("/adauga-anunt");
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Anunțurile mele</h1>
        <p>{message || "Se încarcă..."}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h1 className="text-2xl font-bold">Anunțurile mele</h1>
        <button
          onClick={handleAdaugaAnunt}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
        >
          ➕ Adaugă un anunț nou
        </button>
      </div>

      {message && (
        <div className="mb-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-900 whitespace-pre-line">
          {message}
        </div>
      )}

      {listings.length === 0 && !message && (
        <p className="text-gray-600">
          Nu am găsit niciun anunț asociat acestui număr de telefon.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {listings.map((listing) => (
          <div
            key={listing._id}
            className="border rounded-xl p-4 shadow-sm bg-white flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold text-blue-700 mb-1">
                {listing.title}
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                {listing.location} • {listing.category}
              </p>
              <p className="font-bold text-green-700 mb-2">
                {listing.price ? `${listing.price} €` : "Preț la cerere"}
              </p>
              <p className="text-sm text-gray-700 line-clamp-3">
                {listing.description}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to={`/anunt/${listing._id}`}
                className="text-sm px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Vezi detalii
              </Link>
              <Link
                to={`/editeaza-anunt/${listing._id}`}
                className="text-sm px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Editează
              </Link>
              <Link
                to={`/promovare-succes?anunt=${listing._id}`}
                className="text-sm px-3 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600"
              >
                Promovează
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
