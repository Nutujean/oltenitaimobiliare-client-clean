// src/components/ListingCard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toggleFav, getFavIds } from "../utils/favorites";

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

  // 🔵 FUNCȚIE SHARE UNIVERSALĂ – versiunea care arată imaginea garantat
  const handleShareFacebook = (e) => {
    e.preventDefault();

    // ⚙️ link direct către backend Render (servește meta-tags complete)
    const shareUrl = `https://oltenitaimobiliare-backend.onrender.com/share/${listing._id}`;
    const shareText = encodeURIComponent(
      "Vezi acest anunț imobiliar pe Oltenița Imobiliare 🏡"
    );

    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}&quote=${shareText}`;

    if (isIOS) {
      window.location.href = facebookUrl;
    } else {
      window.open(
        facebookUrl,
        "_blank",
        "noopener,noreferrer,width=600,height=500"
      );
    }
  };

  return (
    <div
      className={`relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
        isPromoted ? "border-2 border-yellow-400 shadow-yellow-200" : ""
      }`}
    >
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
          loading="lazy"
        />
      </Link>

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
          {listing.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2">
          {listing.location || "Oltenița și împrejurimi"}
        </p>

        {listing.price && (
          <p className="text-blue-700 font-bold text-lg">
            {listing.price.toLocaleString("ro-RO")} €
          </p>
        )}

        <div className="text-xs text-gray-500 flex flex-wrap gap-3">
          {listing.category && <span>🏠 {listing.category}</span>}
          {listing.dealType === "inchiriere" && <span>📅 Închiriere</span>}
          {listing.dealType === "vanzare" && <span>💰 Vânzare</span>}
          {listing.surface && <span>📏 {listing.surface} mp</span>}
          {listing.rooms && <span>🛏 {listing.rooms} camere</span>}
        </div>

        <div className="flex justify-between items-center mt-3 gap-2">
          <Link
            to={`/anunt/${listing._id}`}
            className={`flex-1 text-center font-medium py-2 rounded-lg ${
              isExpired
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 transition"
            }`}
          >
            {isExpired ? "Expirat" : "Vezi detalii"}
          </Link>

          {/* 🔵 Share Facebook */}
          <button
            onClick={handleShareFacebook}
            className="bg-[#1877F2] hover:bg-[#145DBF] text-white px-3 py-2 rounded-lg text-sm font-medium shadow-md flex items-center gap-1"
            title="Distribuie pe Facebook"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-2.9h2.5V9.5c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6v1.9H17l-.4 2.9h-2.9v7A10 10 0 0 0 22 12Z" />
            </svg>
            Distribuie
          </button>
        </div>
      </div>
    </div>
  );
}
