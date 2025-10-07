import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ListingsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://oltenitaimobiliare-backend.onrender.com/api";

  // ✅ 1. verificăm dacă userul e logat
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.ok ? res.json() : null)
        .then((data) => setUser(data))
        .catch(() => setUser(null));
    }
  }, []);

  // ✅ 2. preluăm detaliile anunțului
  useEffect(() => {
    fetch(`${API_URL}/listings/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setListing(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Eroare la preluarea anunțului:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center mt-8">Se încarcă anunțul...</p>;
  if (!listing) return <p className="text-center mt-8">Anunțul nu a fost găsit.</p>;

  // ✅ verificăm dacă userul este proprietarul
  const isOwner = user && listing.user && user._id === listing.user;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <img
        src={listing.images?.[0] || listing.imageUrl || "https://via.placeholder.com/800x500?text=Fără+imagine"}
        alt={listing.title}
        className="w-full h-96 object-cover rounded-lg mb-6"
      />

      <h1 className="text-3xl font-semibold text-gray-800 mb-2">
        {listing.title}
      </h1>

      <p className="text-gray-600 mb-4">{listing.description}</p>

      <p className="text-lg text-blue-600 font-bold mb-2">
        {listing.price ? `${listing.price} €` : "Preț la cerere"}
      </p>

      <p className="text-gray-500 mb-2">{listing.location}</p>

      {listing.featuredUntil && new Date(listing.featuredUntil) > new Date() && (
        <p className="text-yellow-600 font-medium mb-4">
          ⭐ Promovat până la: {new Date(listing.featuredUntil).toLocaleDateString("ro-RO")}
        </p>
      )}

      {/* 🔒 buton de editare doar pentru proprietar */}
      {isOwner && (
        <button
          onClick={() => navigate(`/editeaza/${listing._id}`)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Editează anunțul
        </button>
      )}
    </div>
  );
}
