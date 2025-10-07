import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await fetch("https://oltenitaimobiliare-backend.onrender.com/api/listings");
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

  return (
    <div className="pt-20">
      {/* HERO */}
      <section
        className="relative bg-cover bg-center h-[420px] flex flex-col justify-center items-center text-white"
        style={{
          backgroundImage: "url('https://oltenitaimobiliare.ro/images/hero-oltenita.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-blue-900/70" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Găsește locuința ideală în Oltenița
          </h1>
          <p className="text-lg text-gray-200 mb-8">
            Caută apartamente, case și terenuri la cele mai bune prețuri
          </p>

          {/* Bara de căutare */}
          <div className="bg-white rounded-xl shadow-md p-3 flex flex-col sm:flex-row items-center gap-3 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Caută după titlu sau locație..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600">
              <option>Toate categoriile</option>
              <option>Apartamente</option>
              <option>Case</option>
              <option>Terenuri</option>
              <option>Garsoniere</option>
            </select>
            <button className="bg-blue-700 hover:bg-blue-800 text-white font-medium px-5 py-2 rounded-lg transition">
              Caută
            </button>
          </div>
        </div>
      </section>

      {/* LISTA DE ANUNȚURI */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-700">Anunțuri recente</h2>
          <Link
            to="/adauga-anunt"
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg transition"
          >
            + Adaugă anunț
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-600 text-center">Se încarcă anunțurile...</p>
        ) : listings.length === 0 ? (
          <p className="text-gray-500 text-center">
            Nu există anunțuri disponibile momentan.
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
                    <h3 className="text-lg font-semibold truncate">
                      {listing.title}
                    </h3>
                    <p className="text-gray-600 text-sm truncate">
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
      </div>
    </div>
  );
}
