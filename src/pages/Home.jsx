import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// ✅ URL API (din .env sau fallback)
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://oltenitaimobiliare-backend.onrender.com/api";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState("");

  // ✅ Alegem imaginea corectă din anunț
  const getImageUrl = (listing) => {
    if (listing.images && listing.images.length > 0) {
      return listing.images[0];
    }
    if (listing.imageUrl) {
      return listing.imageUrl;
    }
    return "https://via.placeholder.com/400x250?text=Fara+imagine";
  };

  useEffect(() => {
    console.log("[HOME] API_URL =", API_URL);
    fetch(`${API_URL}/listings`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setListings(data);
        else setError("Răspuns invalid de la API.");
      })
      .catch((e) => {
        console.error("Eroare la fetch listings:", e);
        setError(e.message || "Eroare necunoscută");
      });
  }, []);

  // ✅ Categorii - folosim poze din client/public
  const categories = [
    { name: "Apartamente", path: "/apartamente", image: "/apartamente.jpg" },
    { name: "Case", path: "/case", image: "/case.jpg" },
    { name: "Terenuri", path: "/terenuri", image: "/terenuri.jpg" },
    { name: "Garsoniere", path: "/garsoniere", image: "/garsoniere.jpg" },
    { name: "Garaje", path: "/garaje", image: "/garaje.jpg" },
    { name: "Spațiu comercial", path: "/spatiu-comercial", image: "/spatiu-comercial.jpg" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HERO */}
      <section
        className="relative h-[60vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: "url('/fundal.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl font-bold mb-4">Oltenița Imobiliare</h1>
          <p className="text-lg">
            Cumpără, vinde sau închiriază locuințe în zona ta
          </p>
        </div>
      </section>

      {/* Căutare + Adaugă Anunț */}
      <section className="-mt-8 px-6 max-w-5xl mx-auto flex flex-col md:flex-row gap-4 items-center bg-white shadow rounded-xl py-4 relative z-10">
        <input
          type="text"
          placeholder="Caută după titlu sau locație..."
          className="flex-1 border rounded-lg px-4 py-2 w-full"
        />
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
          Caută
        </button>
        <Link
          to="/adauga-anunt"
          className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          + Adaugă anunț
        </Link>
      </section>

      {/* Eroare vizibilă */}
      {error && (
        <div className="max-w-5xl mx-auto mt-6 px-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <strong>Eroare la încărcarea anunțurilor:</strong> {error}
          </div>
        </div>
      )}

      {/* Categorii */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Categorii populare</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link key={cat.name} to={cat.path} className="relative group">
              <div
                className="h-40 rounded-xl shadow-md bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: `url(${cat.image})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition"></div>
                <h3 className="text-white text-xl font-bold z-10">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Anunțuri recente */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Anunțuri recente</h2>
        {listings.length === 0 && !error ? (
          <p className="text-gray-500">Nu există anunțuri momentan.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Link
                key={listing._id}
                to={`/anunt/${listing._id}`}
                className="bg-white shadow-md rounded-xl overflow-hidden block hover:shadow-lg transition"
              >
                <img
                  src={getImageUrl(listing)}
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold">{listing.title}</h3>
                  <p className="text-gray-600">{listing.price} €</p>
                  <p className="text-sm text-gray-500">{listing.location}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
