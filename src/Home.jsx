import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PromoBanner from "../components/PromoBanner";
import hero from "../assets/hero.jpg";
import bannerBebeking from "../assets/banner-bebeking.jpg";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://oltenitaimobiliare-backend.onrender.com/api";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState("");
  const [intent, setIntent] = useState(""); // 🆕 tip tranzacție
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("newest");

  const getImageUrl = (listing) => {
    if (listing.images && listing.images.length > 0) return listing.images[0];
    if (listing.imageUrl) return listing.imageUrl;
    return "https://via.placeholder.com/400x250?text=Fara+imagine";
  };

  const fetchListings = async () => {
    try {
      setError("");
      const res = await fetch(`${API_URL}/listings`);
      const data = await res.json();

      if (Array.isArray(data)) {
        let filtered = [...data];

        if (intent) filtered = filtered.filter((l) => l.intent === intent);
        if (location)
          filtered = filtered.filter((l) =>
            l.location?.toLowerCase().includes(location.toLowerCase())
          );

        setListings(filtered);
      } else setError("Răspuns invalid de la API.");
    } catch (e) {
      console.error("Eroare la fetch listings:", e);
      setError(e.message || "Eroare necunoscută");
    }
  };

  useEffect(() => {
    fetchListings();
  }, [intent, location, sort]);

  const categories = [
    { name: "Apartamente", path: "/apartamente", image: "/images/categorii/apartamente.jpg" },
    { name: "Case", path: "/case", image: "/images/categorii/case.jpg" },
    { name: "Terenuri", path: "/terenuri", image: "/images/categorii/terenuri.jpg" },
    { name: "Garsoniere", path: "/garsoniere", image: "/images/categorii/garsoniere.jpg" },
    { name: "Garaje", path: "/garaje", image: "/images/categorii/garaje.jpg" },
    { name: "Spațiu comercial", path: "/spatiu-comercial", image: "/images/categorii/spatiu-comercial.jpg" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <PromoBanner inline />

      <section
        className="relative h-[60vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: `url(${hero})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl font-bold mb-4">Oltenița Imobiliare</h1>
          <p className="text-lg">Cumpără, vinde sau închiriază locuințe în zona ta</p>
        </div>
      </section>

      {/* 🔎 FILTRE */}
      <section className="-mt-8 px-6 max-w-5xl mx-auto flex flex-col md:flex-row flex-wrap gap-4 items-center bg-white shadow rounded-xl py-4 relative z-10">
        {/* Localitate */}
        <input
          type="text"
          placeholder="Caută localitate..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border rounded-lg px-4 py-2 flex-1 w-full"
        />

        {/* Sortare */}
        <select
          className="border rounded-lg px-4 py-2"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Cele mai noi</option>
          <option value="cheapest">Preț crescător</option>
          <option value="expensive">Preț descrescător</option>
        </select>

        {/* 🆕 Tip tranzacție */}
        <select
          className="border rounded-lg px-4 py-2"
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
        >
          <option value="">Toate tipurile</option>
          <option value="vand">🏠 Vânzare</option>
          <option value="inchiriez">🔑 Închiriere</option>
          <option value="cumpar">💰 Cumpărare</option>
          <option value="schimb">🔄 Schimb</option>
        </select>

        <Link
          to="/adauga-anunt"
          className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          + Adaugă anunț
        </Link>
      </section>

      {error && (
        <div className="max-w-5xl mx-auto mt-6 px-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <strong>Eroare la încărcarea anunțurilor:</strong> {error}
          </div>
        </div>
      )}

      {/* 🔹 Categorii */}
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

      {/* 🏠 ANUNȚURI */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Anunțuri recente</h2>
        {listings.length === 0 && !error ? (
          <p className="text-gray-500">Nu există anunțuri momentan.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div
                key={listing._id}
                className="relative bg-white shadow-md rounded-xl overflow-hidden"
              >
                {/* 🆕 Badge intent */}
                {listing.intent && (
                  <span
                    className={`absolute top-2 left-2 text-xs font-semibold px-3 py-1 rounded-full shadow ${
                      listing.intent === "vand"
                        ? "bg-green-500 text-white"
                        : listing.intent === "inchiriez"
                        ? "bg-blue-500 text-white"
                        : listing.intent === "cumpar"
                        ? "bg-yellow-500 text-white"
                        : "bg-purple-500 text-white"
                    }`}
                  >
                    {listing.intent === "vand" && "🏠 Vând"}
                    {listing.intent === "inchiriez" && "🔑 Închiriez"}
                    {listing.intent === "cumpar" && "💰 Cumpăr"}
                    {listing.intent === "schimb" && "🔄 Schimb"}
                  </span>
                )}

                <img
                  src={getImageUrl(listing)}
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />

                <div className="p-4">
                  <h3 className="text-lg font-bold">{listing.title}</h3>
                  <p className="text-blue-700 font-semibold">{listing.price} €</p>
                  <p className="text-sm text-gray-500">{listing.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <PromoBanner inline />
      </section>
    </div>
  );
}
