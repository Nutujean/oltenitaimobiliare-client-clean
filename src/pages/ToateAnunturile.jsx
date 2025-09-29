import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ToateAnunturile() {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/listings`);
        const data = await res.json();
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setListings(sorted);
      } catch (err) {
        console.error("❌ Eroare la preluarea anunțurilor:", err);
      }
    };
    fetchListings();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Toate anunțurile</h1>
      {listings.length === 0 ? (
        <p className="text-gray-600">Nu există anunțuri momentan.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div
              key={listing._id}
              onClick={() => navigate(`/anunt/${listing._id}`)}
              className="bg-white shadow hover:shadow-lg rounded-lg overflow-hidden cursor-pointer transition-transform transform hover:scale-105"
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
                <h3 className="text-lg font-semibold mb-2">
                  {listing.title}
                </h3>
                <p className="text-gray-600 mb-2">{listing.location}</p>
                <p className="text-blue-600 font-bold">
                  {listing.price} EUR
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ToateAnunturile;
