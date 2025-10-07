import React from "react";
import { Link } from "react-router-dom";

export default function ListingCard({ listing, onEdit, onDelete }) {
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const isOwner = listing.user === currentUser?._id;

  return (
    <div className="border rounded-lg shadow hover:shadow-md transition overflow-hidden">
      <Link to={`/anunt/${listing._id}`}>
        <img
          src={listing.images?.[0] || listing.imageUrl || "https://via.placeholder.com/400x250?text=Fără+imagine"}
          alt={listing.title}
          className="w-full h-48 object-cover"
        />
      </Link>

      <div className="p-3">
        <h3 className="text-lg font-semibold">{listing.title}</h3>
        <p className="text-gray-600">{listing.location}</p>
        <p className="font-bold text-blue-600">{listing.price} €</p>

        {isOwner && (
          <div className="flex justify-between mt-3">
            <button
              onClick={() => onEdit(listing._id)}
              className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500"
            >
              Editează
            </button>
            <button
              onClick={() => onDelete(listing._id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Șterge
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
