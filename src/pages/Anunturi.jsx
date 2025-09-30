import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

export default function Anunturi() {
  const [listings, setListings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("token");

  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("categorie");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        let url = `${import.meta.env.VITE_API_URL}/listings`;
        if (category) url += `?category=${category}`;

        const res = await fetch(url);
        const data = await res.json();
        setListings(data);
      } catch (error) {
        console.error("Eroare la încărcarea anunțurilor:", error);
      }
    };

    const fetchFavorites = async () => {
      if (!isLoggedIn) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/favorites`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        setFavorites(data.map((fav) => fav._id));
      } catch (error) {
        console.error("Eroare la favorite:", error);
      }
    };

    fetchListings();
    fetchFavorites();
  }, [category, isLoggedIn]);

  const toggleFavorite = async (listingId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/favorites/${listingId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setFavorites(data);
    } catch (error) {
      console.error("Eroare la toggle favorite:", error);
    }
  };

  const sortedListings = [...listings].sort((a, b) => {
    if (sortOrder === "price-asc") return a.price - b.price;
    if (sortOrder === "price-desc") return b.price - a.price;
    if (sortOrder === "date-new")
      return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOrder === "date-old")
      return new Date(a.createdAt) - new Date(b.createdAt);
    return 0;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {category ? `Anunțuri din categoria: ${category}` : "Toate anunțurile"}
      </h1>

      {/* Dropdown sortare */}
      <div className="mb-6">
        <label className="mr-3 font-semibold">Sortează după:</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="">Fără sortare</option>
          <option value="price-asc">Preț crescător</option>
          <option value="price-desc">Preț descrescător</option>
          <option value="date-new">Cel mai nou</option>
          <option value="date-old">Cel mai vechi</option>
        </select>
      </div>

      {sortedListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sortedListings.map((listing) => (
            <div
              key={listing._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition relative"
            >
              {/* Badge Rezervat */}
              {listing.status === "rezervat" && (
                <div className="absolute top-4 -left-10 bg-yellow-500 text-white text-xs font-bold px-12 py-1 transform -rotate-45 shadow-md">
                  Rezervat
                </div>
              )}

              {/* Favorite ❤️ */}
              {isLoggedIn && (
                <button
                  onClick={() => toggleFavorite(listing._id)}
                  className="absolute top-2 right-2 text-2xl"
                >
                  {favorites.includes(listing._id) ? "❤️" : "🤍"}
                </button>
              )}

              <img
                src={
                  listing.images && listing.images.length > 0
                    ? listing.images[0]
                    : "https://via.placeholder.com/400x250?text=Fără+imagine"
                }
                alt={listing.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-bold mb-2">{listing.title}</h2>
                <p className="text-gray-600 mb-2 truncate">
                  {listing.description}
                </p>
                <p className="text-blue-600 font-semibold mb-4">
                  {listing.price} €
                </p>
                <Link
                  to={`/anunt/${listing._id}`}
                  className="block text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Detalii
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Nu există anunțuri disponibile.</p>
      )}
    </div>
  );
}
