import { useEffect, useState } from "react";
import API_URL from "../api";

export default function AnunturileMele() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/listings/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Eroare la încărcarea anunțurilor mele");

        const data = await res.json();
        setListings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌", err);
        setListings([]);
      }
    };

    fetchMyListings();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Anunțurile Mele</h1>
      {listings.length === 0 ? (
        <p className="text-gray-600">Nu ai încă anunțuri publicate.</p>
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
                <p className="text-gray-600">
                  <strong>Preț:</strong> {listing.price} €
                </p>
                <p className="text-sm text-gray-500 capitalize">
                  {listing.category}
                </p>
                {listing.location && (
                  <p className="text-sm text-gray-500">📍 {listing.location}</p>
                )}
                {listing.phone && (
                  <p className="text-sm text-gray-500">
                    📞{" "}
                    <a
                      href={`tel:${listing.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {listing.phone}
                    </a>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
