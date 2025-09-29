import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/listings`);
        const data = await res.json();
        // sortăm descrescător după createdAt și luăm doar 6
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setListings(sorted.slice(0, 6));
      } catch (err) {
        console.error("❌ Eroare la preluarea anunțurilor:", err);
      }
    };
    fetchListings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <div
        className="relative bg-cover bg-center h-[400px] flex items-center justify-center text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1350&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Găsește-ți locuința ideală în Oltenița
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Vânzări • Închirieri • Terenuri • Spații comerciale
          </p>
          <a
            href="/adauga-anunt"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg"
          >
            Adaugă un anunț
          </a>
        </div>
      </div>

      {/* CATEGORII */}
      {/* rămâne fix cum ți-am dat mai devreme cu 6 carduri */}

      {/* ULTIMELE ANUNȚURI */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Ultimele anunțuri</h2>
          <button
            onClick={() => navigate("/toate-anunturile")}
            className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Vezi toate
          </button>
        </div>

        {listings.length === 0 ? (
          <p className="text-gray-600">Nu există anunțuri momentan.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div
                key={listing._id}
                onClick={() => navigate(`/anunt/${listing._id}`)}
                className="bg-white shadow hover:shadow-lg rounded-lg overflow-hidden cursor-pointer transition-transform transform hover:scale-105"
              >
                <img
                  src={
                    listing.images && listing.images.length > 0
                      ? listing.images[0]
                      : "https://via.placeholder.com/400x250?text=Fără+imagine"
                  }
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {listing.title}
                  </h3>
                  <p className="text-gray-600 mb-2">{listing.location}</p>
                  <p className="text-blue-600 font-bold">
                    {listing.price} EUR
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
