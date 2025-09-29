import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

export default function Anunturi() {
  const [listings, setListings] = useState([]);
  const [sortOrder, setSortOrder] = useState(""); // "", "price-asc", "price-desc", "date-new", "date-old"
  const location = useLocation();

  // extragem categoria din query string (ex: /anunturi?categorie=Case)
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

    fetchListings();
  }, [category]);

  // funcție pentru sortare
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
      {/* Titlu */}
      <h1 className="text-3xl font-bold mb-6">
        {category ? `Anunțuri din categoria: ${category}` : "Toate anunțurile"}
      </h1>

      {/* Dropdown unic pentru sortare */}
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

      {/* Listă anunțuri */}
      {sortedListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sortedListings.map((listing) => (
            <div
              key={listing._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
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
