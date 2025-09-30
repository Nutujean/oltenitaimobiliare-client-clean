import { useEffect, useState } from "react";

export default function Favorite() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("favorites");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        } else {
          setFavorites([]);
        }
      }
    } catch (err) {
      console.warn("❌ Eroare la citirea din localStorage:", err);
      setFavorites([]);
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Favorite</h1>
      {favorites.length === 0 ? (
        <p>Nu ai adăugat încă anunțuri la favorite.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {favorites.map((fav, idx) => (
            <div
              key={idx}
              className="border rounded-lg shadow p-4 bg-white hover:shadow-lg transition"
            >
              <img
                src={
                  fav.imageUrl && fav.imageUrl !== "undefined"
                    ? fav.imageUrl
                    : "https://via.placeholder.com/400x250?text=Fără+imagine"
                }
                alt={fav.title}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h2 className="text-lg font-bold">{fav.title}</h2>
              <p className="text-gray-600">{fav.price} €</p>
              <p className="text-sm text-gray-500 capitalize">{fav.category}</p>

              {/* 👇 locația afișată aici */}
              {fav.location && (
                <p className="text-sm text-gray-500">📍 {fav.location}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
