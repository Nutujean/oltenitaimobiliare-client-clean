import { useEffect, useState } from "react";
import API_URL from "../api";

export default function Home() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`${API_URL}/listings`);
        if (!res.ok) throw new Error("Eroare la încărcarea anunțurilor");

        const data = await res.json();
        console.log("✅ Anunțuri primite:", data);
        setListings(data);
      } catch (err) {
        console.error("❌ Eroare la fetch listings:", err);
        setListings([]);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Anunțuri recente</h1>

      {listings.length === 0 ? (
        <p className="text-gray-600">Momentan nu sunt anunțuri disponibile.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg shadow bg-white overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={
                  listing.imageUrl && listing.imageUrl !== "undefined"
                    ? listing.imageUrl
                    : "https://via.placeholder.com/400x250?text=Fără+imagine"
                }
                alt={listing.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-2">
                <h2 className="text-lg font-bold">{listing.title}</h2>
                <p className="text-gray-600">{listing.price} €</p>
                <p className="text-sm text-gray-500 capitalize">{listing.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
