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

  // ✅ URL corect pentru distribuire (cu meta OG din backend)
  const shareUrl = `https://share.oltenitaimobiliare.ro/share/fb/${listing._id}`;

  // 🔵 Linkuri pentru rețele
  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
  `${shareUrl}?v=${Date.now()}`
)}`;
  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(
    `🏡 ${listing.title} – vezi detalii: ${shareUrl}`
  )}`;

  // 🟣 Pentru TikTok doar copiem linkul
  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("🔗 Link copiat! Poți să-l pui în TikTok sau oriunde dorești.");
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

      {/* ❤️ Favorite */}
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

      {/* Imagine */}
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

      {/* Detalii */}
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

        {/* 🔹 Butoane acțiune */}
        <div className="flex flex-col gap-2 mt-3">
          <Link
            to={`/anunt/${listing._id}`}
            className={`text-center font-medium py-2 rounded-lg ${
              isExpired
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 transition"
            }`}
          >
            {isExpired ? "Expirat" : "Vezi detalii"}
          </Link>

          {/* 🔹 Butoane de distribuire */}
          {!isExpired && (
            <div className="flex justify-between items-center gap-2 mt-2">
              {/* 📘 Facebook */}
              <a
                href={facebookShare}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#1877F2] text-white py-2 rounded-lg text-sm font-medium text-center hover:bg-[#145DBF]"
              >
                📘 Facebook
              </a>

              {/* 💬 WhatsApp */}
              <a
                href={whatsappShare}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#25D366] text-white py-2 rounded-lg text-sm font-medium text-center hover:bg-[#1DA851]"
              >
                💬 WhatsApp
              </a>

              {/* 🎵 TikTok */}
              <button
                onClick={copyLink}
                className="flex-1 bg-black text-white py-2 rounded-lg text-sm font-medium text-center hover:bg-gray-800"
              >
                🎵 TikTok
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
