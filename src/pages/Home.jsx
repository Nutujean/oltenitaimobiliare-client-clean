import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/listings`);
        const data = await res.json();
        setListings(data.slice(0, 6)); // afișăm primele 6 anunțuri pe home
      } catch (error) {
        console.error("Eroare la încărcarea anunțurilor:", error);
      }
    };

    fetchListings();
  }, []);

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
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center px-4">
            Vânzări, Închirieri și Oferte Imobiliare în Oltenița și împrejurimi
          </h1>
        </div>
      </div>

      {/* CATEGORII */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">Categorii populare</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/anunturi?categorie=${cat.name}`}
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
            </Link>
          ))}
        </div>
      </div>

      {/* ANUNȚURI RECENTE */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">Anunțuri recente</h2>
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div
                key={listing._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition relative"
              >
                {/* Badge Rezervat (stil sticker) */}
                {listing.status === "rezervat" && (
                  <div className="absolute top-4 -left-10 bg-yellow-500 text-white text-xs font-bold px-12 py-1 transform -rotate-45 shadow-md">
                    Rezervat
                  </div>
                )}

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
                  <h2 className="text-lg font-bold mb-2">{listing.title}</h2>
                  <p className="text-gray-600 mb-2 truncate">
                    {listing.description}
                  </p>
                  <p className="text-blue-600 font-semibold mb-4">
                    {listing.price} €
                  </p>
                  <Link
                    to={`/anunt/${listing._id}`}
                    className="block text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Detalii
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">Nu există anunțuri disponibile.</p>
        )}
      </div>
    </div>
  );
}
