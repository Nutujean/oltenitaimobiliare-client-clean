import React, { useEffect, useState } from "react";
import ListingCard from "../components/ListingCard";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://oltenitaimobiliare-backend.onrender.com/api";

  // ✅ Preia userul curent dacă există token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => setUser(data))
        .catch(() => setUser(null));
    }
  }, []);

  // ✅ Încarcă toate anunțurile
  useEffect(() => {
    fetch(`${API_URL}/listings`)
      .then((res) => res.json())
      .then((data) => {
        setListings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Eroare la preluarea anunțurilor:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-8">Se încarcă anunțurile...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Anunțuri recente
      </h1>

      {listings.length === 0 ? (
        <p className="text-center text-gray-500">Momentan nu există anunțuri.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard
              key={listing._id}
              listing={listing}
              currentUser={user}
              // 🔹 nu trimitem onDelete aici (nu vrem buton de ștergere pe home)
            />
          ))}
        </div>
      )}
    </div>
  );
}
