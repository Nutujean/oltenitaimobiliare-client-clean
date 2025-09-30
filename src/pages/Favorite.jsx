import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function Favorite() {
  const [favorites, setFavorites] = useState([]);

  const optimizeImage = (url) => {
    if (!url || !url.includes("cloudinary.com")) return url;
    return url.replace("/upload/", "/upload/f_auto,q_auto/");
  };

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Helmet>
        <title>Anunțuri favorite - Oltenița Imobiliare</title>
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">Anunțurile mele favorite</h1>
      {favorites.length === 0 ? (
        <p className="text-gray-600">Nu ai anunțuri favorite.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <div
              key={fav._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={
                  fav.images && fav.images.length > 0
                    ? optimizeImage(fav.images[0])
                    : "https://via.placeholder.com/400x250?text=Fără+imagine"
                }
                alt={fav.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-bold mb-2">{fav.title}</h2>
                <p className="text-blue-600 font-semibold mb-4">
                  Preț: {fav.price} €
                </p>
                <Link
                  to={`/anunt/${fav._id}`}
                  className="block text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Vezi detalii
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
