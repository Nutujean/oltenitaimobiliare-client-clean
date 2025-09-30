import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AnunturileMele() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let user = null;
  try {
    const stored = localStorage.getItem("user");
    user = stored ? JSON.parse(stored) : null;
  } catch {
    user = null;
  }

  const [listings, setListings] = useState([]);

  useEffect(() => {
    if (!token) return;

    const fetchMyListings = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/listings/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Eroare la încărcarea anunțurilor");
        const data = await res.json();
        setListings(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchMyListings();
  }, [token]);

  if (!token) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-600 text-lg">
          Trebuie să fii logat pentru a vedea <b>Anunțurile Mele</b>.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Mergi la Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Anunțurile Mele</h1>
      {listings.length === 0 ? (
        <p>Nu ai adăugat încă niciun anunț.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="relative border rounded-lg p-4 shadow hover:shadow-lg transition bg-white"
            >
              <h2 className="text-lg font-bold mb-1">{listing.title}</h2>
              <p className="text-gray-600 mb-2">{listing.price} €</p>
              <Link
                to={`/editeaza-anunt/${listing._id}`}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
              >
                Editează
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
