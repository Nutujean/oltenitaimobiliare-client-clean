// src/components/ListingCard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toggleFav, getFavIds } from "../utils/favorites"; // ✅ funcțiile de localStorage

export default function ListingCard({ listing }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(getFavIds());
  }, []);

  const isPromoted =
    listing.featuredUntil && new Date(listing.featuredUntil) > new Date();
  const isExpired =
    listing.expiresAt && new Date(listing.expiresAt) < new Date();
  const isFavorite = favorites.includes(listing._id);

  const handleFavorite = (e) => {
    e.preventDefault();
    const next = toggleFav(listing._id);
    setFavorites(next);
  };

  return (
    <div
      className={`relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
        isPromoted ? "border-2 border-yellow-400 shadow-yellow-200" : ""
      }`}
    >
      {/* 🏷️ Banner PROMOVAT / EXPIRAT */}
      {isPromoted && (
        <div className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-lg shadow-md z-10">
          ⭐ PROMOVAT
        </div>
      )}
      {isExpired && !isPromoted && (
        <div className="absolute top-3 left-3 bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-md z-10">
          ⏰ EXPIRAT
        </div>
      )}

      {/* ❤️ Buton Favorite */}
      <button
        onClick={handleFavorite}
        className={`absolute top-3 right-3 p-2 rounded-full z-20 shadow-md transition ${
          isFavorite
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-white text-gray-600 hover:text-red-500"
        }`}
        title={isFavorite ? "Elimină din favorite" : "Adaugă la favorite"}
      >
        ❤️
      </button>

      {/* Imagine anunț */}
      <Link to={`/anunt/${listing._id}`}>
        <img
          src={
            listing.images?.[0] ||
            listing.imageUrl ||
            "https://via.placeholder.com/400x250?text=Fără+imagine"
          }
          alt={listing.title}
          className={`w-full h-48 object-cover transition-transform duration-300 ${
            isExpired ? "opacity-70 grayscale" : "hover:scale-105"
          }`}
          loading="lazy" // ✅ Lazy loading pentru viteză
        />
      </Link>

      {/* Detalii anunț */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
          {listing.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2">
          {listing.location || "Oltenița și împrejurimi"}
        </p>

        {/* Preț */}
        {listing.price && (
          <p className="text-blue-700 font-bold text-lg">
            {listing.price.toLocaleString("ro-RO")} €
          </p>
        )}

        {/* Detalii rapide */}
        <div className="text-xs text-gray-500 flex flex-wrap gap-3">
          {listing.category && <span>🏠 {listing.category}</span>}
          {listing.dealType === "inchiriere" && <span>📅 Închiriere</span>}
          {listing.dealType === "vanzare" && <span>💰 Vânzare</span>}
          {listing.surface && <span>📏 {listing.surface} mp</span>}
          {listing.rooms && <span>🛏 {listing.rooms} camere</span>}
        </div>

        {/* Buton vezi detalii */}
        <Link
          to={`/anunt/${listing._id}`}
          className={`block text-center font-medium mt-3 py-2 rounded-lg ${
            isExpired
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 transition"
          }`}
        >
          {isExpired ? "Expirat" : "Vezi detalii"}
        </Link>
      </div>
    </div>
  );
}
