import { useEffect, useState } from "react";
import { API_URL } from "../config";
import { Link } from "react-router-dom";

export default function AnunturileMele() {
  const [anunturi, setAnunturi] = useState([]);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      return; // nu apelăm backendul
    }

    setIsLoggedIn(true);

    const fetchMyListings = async () => {
      try {
        const res = await fetch(`${API_URL}/listings/my`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Eroare la încărcarea anunțurilor mele");
        setAnunturi(data);
      } catch (err) {
        console.error("Eroare la încărcarea anunțurilor mele:", err);
        setError(err.message);
      }
    };

    fetchMyListings();
  }, []);

  // 🟥 Dacă utilizatorul nu e logat
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Trebuie să fii autentificat pentru a accesa această pagină
        </h2>
        <Link
          to="/login"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Autentifică-te
        </Link>
      </div>
    );
  }

  // 🔶 Dacă există eroare
  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  // 🔹 Dacă nu există anunțuri
  if (anunturi.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-600">
        <p>Nu ai încă niciun anunț postat.</p>
        <Link
          to="/adauga-anunt"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Adaugă un anunț
        </Link>
      </div>
    );
  }

  // ✅ Dacă e logat și are anunțuri
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Anunțurile Mele</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {anunturi.map((a) => (
          <div
            key={a._id}
            className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition relative"
          >
            <img
              src={a.images?.[0] || "https://via.placeholder.com/400x250?text=Fără+imagine"}
              alt={a.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg line-clamp-2">{a.title}</h3>
              <p className="text-gray-600">{a.price} €</p>
              <p className="text-sm text-gray-500">{a.location}</p>

              <div className="flex justify-between mt-4 text-sm">
                <Link
                  to={`/editeaza-anunt/${a._id}`}
                  className="text-blue-600 hover:underline"
                >
                  Editează
                </Link>
                <Link
                  to={`/anunt/${a._id}`}
                  className="text-green-600 hover:underline"
                >
                  Vizualizează
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
