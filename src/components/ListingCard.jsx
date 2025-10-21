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

  // ✅ Distribuire Facebook
  const handleShareFacebook = (e) => {
    e.preventDefault();
    const shareUrl = `https://share.oltenitaimobiliare.ro/share/${listing._id}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(facebookUrl, "_blank", "noopener,noreferrer,width=600,height=500");
  };

  // ✅ Distribuire WhatsApp
  const handleShareWhatsApp = (e) => {
    e.preventDefault();
    const shareUrl = `https://share.oltenitaimobiliare.ro/share/${listing._id}`;
    const msg = `🏡 ${listing.title}\n🔗 ${shareUrl}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
  };

  // ✅ Copiere link TikTok / clipboard
  const handleCopyLink = (e) => {
    e.preventDefault();
    const shareUrl = `https://share.oltenitaimobiliare.ro/share/${listing._id}`;
    navigator.clipboard.writeText(shareUrl);
    alert("🔗 Link copiat! Poți lipi direct în TikTok, Facebook sau mesaj.");
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

        {/* 🔘 Butoane principale */}
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

          {/* 🔗 Distribuire Social Media */}
          <div className="flex flex-wrap gap-2 justify-between">
            <button
              onClick={handleShareFacebook}
              className="flex-1 bg-[#1877F2] hover:bg-[#145DBF] text-white px-3 py-2 rounded-lg text-sm font-medium shadow-md"
            >
              📘 Facebook
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="flex-1 bg-[#25D366] hover:bg-[#1DA851] text-white px-3 py-2 rounded-lg text-sm font-medium shadow-md"
            >
              💬 WhatsApp
            </button>
            <button
              onClick={handleCopyLink}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-md"
            >
              🎵 TikTok / Copiază
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
