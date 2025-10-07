import React from "react";
import { useNavigate } from "react-router-dom";

export default function ListingCard({ listing, currentUser, onDelete }) {
  const navigate = useNavigate();

  // Verificăm dacă utilizatorul este logat
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  // Verificăm dacă userul logat este proprietarul anunțului
  const isOwner =
    currentUser && listing.user && currentUser._id === listing.user;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-200">
      <div
        className="cursor-pointer"
        onClick={() => navigate(`/anunt/${listing._id}`)}
      >
        <img
          src={listing.images?.[0] || listing.imageUrl || "https://via.placeholder.com/400x250?text=Fără+imagine"}
          alt={listing.title}
          className="w-full h-52 object-cover"
        />
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-1 truncate">
            {listing.title}
          </h2>
          <p className="text-sm text-gray-500 mb-2">{listing.location}</p>
          <p className="text-blue-600 font-bold text-lg">
            {listing.price ? `${listing.price} €` : "Preț la cerere"}
          </p>

          {listing.featuredUntil && new Date(listing.featuredUntil) > new Date() && (
            <div className="text-xs text-yellow-600 font-medium mt-1">
              ⭐ Promovat până la: {new Date(listing.featuredUntil).toLocaleDateString("ro-RO")}
            </div>
          )}
        </div>
      </div>

      {/* 🔒 Butoanele de acțiune (doar dacă userul e logat și e proprietar) */}
      {isLoggedIn && isOwner && (
        <div className="flex justify-between items-center px-4 pb-3">
          <button
            onClick={() => navigate(`/editeaza/${listing._id}`)}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
          >
            Editează
          </button>
          <button
            onClick={() => onDelete && onDelete(listing._id)}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
          >
            Șterge
          </button>
        </div>
      )}
    </div>
  );
}
