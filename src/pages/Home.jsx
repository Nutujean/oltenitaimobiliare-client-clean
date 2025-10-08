import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await fetch(
          "https://oltenitaimobiliare-backend.onrender.com/api/listings"
        );
        const data = await res.json();
        setListings(data);
      } catch (err) {
        console.error("Eroare la încărcarea anunțurilor:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  const categories = [
    { name: "Apartamente", image: "/apartamente.jpg", link: "/categorie/apartamente" },
    { name: "Case", image: "/case.jpg", link: "/categorie/case" },
    { name: "Terenuri", image: "/terenuri.jpg", link: "/categorie/terenuri" },
    { name: "Garsoniere", image: "/garsoniere.jpg", link: "/categorie/garsoniere" },
    { name: "Garaje", image: "/garaje.jpg", link: "/categorie/garaje" },
    { name: "Spațiu comercial", image: "/spatiu-comercial.jpg", link: "/categorie/spatiu-comercial" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Se încarcă anunțurile...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pb-12">
      {/* 🏠 HERO SECTION */}
      <section
        className="relative h-[420px] flex flex-col justify-center items-center text-center text-white mb-12 rounded-2xl overflow-hidden shadow-lg"
        style={{
          backgroundImage: "url('/fundal.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Strat subtil pentru lizibilitate */}
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            Bine ai venit pe <span className="text-blue-400">Oltenița Imobiliare</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-100 drop-shadow-md">
            Găsește cele mai bune oferte din Oltenița și împrejurimi
          </p>

          <Link
            to="/adauga-anunt"
            className="inline-block mt-6 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            + Adaugă un anunț
          </Link>
        </div>
      </section>

      {/* 🔷 CATEGORII */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Categorii populare
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.link}
              className="relative group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition"></div>
              <h3 className="absolute bottom-3 left-0 right-0 text-center text-white text-lg font-semibold drop-shadow-lg">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* 📋 LISTĂ ANUNȚURI */}
      <section>
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Ultimele anunțuri adăugate
        </h2>

        {listings.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">
            Momentan nu există anunțuri disponibile.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((listing) => {
              const isPromoted =
                listing.featuredUntil &&
                new Date(listing.featuredUntil).getTime() > Date.now();

              return (
                <div
                  key={listing._id}
                  className="relative bg-white border rounded-xl overflow-hidden shadow hover:shadow-lg transition"
                >
                  <Link to={`/anunt/${listing._id}`}>
                    <div className="relative">
                      <img
                        src={
                          listing.images?.[0] ||
                          listing.imageUrl ||
                          "https://via.placeholder.com/400x250?text=Fără+imagine"
                        }
                        alt={listing.title}
                        className="w-full h-48 object-cover"
                      />
                      {isPromoted && (
                        <div className="absolute top-2 right-2 bg-blue-700 text-white text-xs px-2 py-1 rounded-lg shadow-md flex items-center gap-1">
                          💎 <span>Promovat</span>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-4">
                    <h2 className="text-lg font-semibold mb-1 truncate">
                      {listing.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-2 truncate">
                      {listing.location}
                    </p>
                    <p className="text-blue-700 font-bold text-lg">
                      {listing.price} €
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
