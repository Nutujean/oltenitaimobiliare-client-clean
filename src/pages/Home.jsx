import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        console.log("🌍 API_URL este:", import.meta.env.VITE_API_URL);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/listings`);
        const data = await res.json();
        console.log("📦 Toate anunțurile:", data);
        setListings(data);
      } catch (error) {
        console.error("❌ Eroare la preluarea anunțurilor:", error);
      }
    };
    fetchListings();
  }, []);

  const categories = [
    {
      name: "Apartamente",
      img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Case",
      img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Terenuri",
      img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Garsonieră",
      img: "https://images.unsplash.com/photo-1600607687797-6fb886090d91?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Garaje",
      img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Spații comerciale",
      img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=400&q=80",
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* HERO */}
      <div
        className="relative h-[300px] md:h-[400px] flex items-center justify-center text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1500&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <h1 className="relative text-3xl md:text-5xl font-bold text-center">
          Găsește-ți locuința de vis în Oltenița
        </h1>
      </div>

      {/* CATEGORII */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Alege categoria dorită
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/search?category=${cat.name}`}
              className="relative group rounded-lg overflow-hidden shadow-lg"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-60 transition">
                <span className="text-white text-lg font-semibold">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* LISTĂ ANUNȚURI */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Anunțuri recente</h2>
        {listings.length === 0 ? (
          <p className="text-center text-gray-600">
            Nu există anunțuri momentan.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Link
                key={listing._id}
                to={`/anunt/${listing._id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={listing.images?.[0] || "https://via.placeholder.com/400x250?text=Fără+imagine"}
                  alt={listing.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{listing.title}</h3>
                  <p className="text-gray-600 truncate">{listing.description}</p>
                  <p className="text-blue-600 font-bold mt-2">
                    {listing.price} €
                  </p>
                  <p className="text-sm text-gray-500">{listing.location}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
