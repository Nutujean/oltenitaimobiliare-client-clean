import React, { useEffect, useState } from "react";

export default function Home() {
  const [listings, setListings] = useState([]);

  const categories = [
    {
      name: "Apartamente",
      img: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Case",
      img: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Terenuri",
      img: "https://images.unsplash.com/photo-1523978591478-c753949ff840?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Garsoniere",
      img: "/garsoniera.jpg",
    },
    {
      name: "Garaje",
      img: "/garaj.jpg",
    },
    {
      name: "Spații comerciale",
      img: "/spatiu_comercial.jpg",
    },
  ];

  useEffect(() => {
    const fetchListings = async () => {
      try {
        console.log("🌍 API_URL este:", import.meta.env.VITE_API_URL);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/listings`);
        console.log("📡 Răspuns brut:", res);

        const data = await res.json();
        console.log("✅ Date primite:", data);

        setListings(data);
      } catch (error) {
        console.error("Eroare la încărcarea anunțurilor:", error);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HERO SECTION */}
      <div
        className="relative h-[400px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center px-4">
            Bine ai venit la Oltenița Imobiliare
          </h1>
        </div>
      </div>

      {/* CATEGORII */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Categorii populare
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="relative rounded-xl overflow-hidden shadow-lg group cursor-pointer"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-56 object-cover transform group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-xl font-bold text-white">{cat.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LISTA ANUNȚURI */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">Anunțuri recente</h2>

        {listings.length === 0 ? (
          <p className="text-gray-500 text-center">
            Momentan nu există anunțuri.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <div
                key={listing._id}
                className="group relative bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <img
                  src={
                    listing.imageUrl ||
                    "https://via.placeholder.com/400x250?text=Fără+imagine"
                  }
                  alt={listing.title}
                  className="h-48 w-full object-cover"
                />

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {listing.title}
                  </h3>
                  <p className="text-gray-600">{listing.price} €</p>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-50">
                    Vezi anunț
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
