import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
        const res = await fetch(`${import.meta.env.VITE_API_URL}/listings`);
        const data = await res.json();
        setListings(data.slice(-6).reverse()); // ultimele 6 anunțuri
      } catch (error) {
        console.error("Eroare la încărcarea anunțurilor:", error);
      }
    };
    fetchListings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HERO */}
      <div
        className="relative h-[400px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center">
            Vânzări • Închirieri • Apartamente • Case • Terenuri
          </h1>
        </div>
      </div>

      {/* CATEGORII */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">Categorii populare</h2>
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

      {/* ULTIMELE ANUNȚURI */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">Ultimele anunțuri</h2>
        {listings.length === 0 ? (
          <p className="text-center text-gray-500">Nu există anunțuri încă.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <div
                  key={listing._id}
                  className="border rounded-lg shadow hover:shadow-lg transition bg-white"
                >
                  <img
                    src={
                      listing.imageUrl ||
                      (listing.images && listing.images[0]) ||
                      "https://via.placeholder.com/400x250?text=Fără+imagine"
                    }
                    alt={listing.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2">{listing.title}</h3>
                    <p className="text-gray-600 mb-2">{listing.price} €</p>
                    <Link
                      to={`/anunt/${listing._id}`}
                      className="inline-block mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Vezi detalii
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Buton pentru toate anunțurile */}
            <div className="text-center mt-8">
              <Link
                to="/anunturi"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Vezi toate anunțurile →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
