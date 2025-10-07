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

  return (
    <div className="pt-20">
      {/* 🟦 HERO cu imagine și overlay */}
      <section
        className="relative bg-cover bg-center h-[480px] flex flex-col justify-center items-center text-white"
        style={{ backgroundImage: "url('/images/hero-oltenita.jpg')" }}
      >
        <div className="absolute inset-0 bg-blue-900/60" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">
            Oltenița Imobiliare
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 mb-8">
            Cumpără, vinde sau închiriază locuințe în zona ta
          </p>

          {/* 🔍 Bara complexă de căutare */}
          <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 max-w-4xl mx-auto">
            <input
              type="text"
              placeholder="Cuvinte cheie (ex: 2 camere, centru)"
              className="flex-1 min-w-[200px] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <select className="min-w-[160px] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600">
              <option>Toate categoriile</option>
              <option>Apartamente</option>
              <option>Case</option>
              <option>Terenuri</option>
              <option>Garsoniere</option>
              <option>Garaje</option>
              <option>Spațiu comercial</option>
            </select>
            <select className="min-w-[160px] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600">
              <option>Toate locațiile</option>
              <option>Oltenița</option>
              <option>Chirnogi</option>
              <option>Căscioarele</option>
              <option>Spanțov</option>
            </select>
            <select className="min-w-[160px] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600">
              <option>Toate tipurile</option>
              <option>Vânzare</option>
              <option>Închiriere</option>
            </select>
            <input
              type="number"
              placeholder="Camere min."
              className="w-[130px] border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="number"
              placeholder="Preț max."
              className="w-[130px] border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-lg transition">
              Caută
            </button>
            <Link
              to="/adauga-anunt"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              + Adaugă anunț
            </Link>
          </div>
        </div>
      </section>

      {/* 🏡 Categorii populare */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center">
          Categorii populare
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {[
            {
              name: "Apartamente",
              img: "/images/cat-apartamente.jpg",
              desc: "Blocuri moderne și apartamente luminoase",
              slug: "apartamente",
            },
            {
              name: "Case",
              img: "/images/cat-case.jpg",
              desc: "Locuințe spațioase și curți private",
              slug: "case",
            },
            {
              name: "Terenuri",
              img: "/images/cat-terenuri.jpg",
              desc: "Terenuri pentru construcții sau agricultură",
              slug: "terenuri",
            },
            {
              name: "Garsoniere",
              img: "/images/cat-garsoniere.jpg",
              desc: "Spații mici, perfecte pentru o persoană",
              slug: "garsoniere",
            },
            {
              name: "Garaje",
              img: "/images/cat-garaje.jpg",
              desc: "Garaje individuale și boxe auto",
              slug: "garaje",
            },
            {
              name: "Spațiu comercial",
              img: "/images/cat-spatiu.jpg",
              desc: "Spații pentru afaceri și birouri",
              slug: "spatiu-comercial",
            },
          ].map((cat, i) => (
            <Link
              key={i}
              to={`/categorie/${cat.slug}`}
              className="relative rounded-xl overflow-hidden shadow hover:shadow-2xl transition group"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-40 object-cover group-hover:scale-110 group-hover:brightness-110 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-2">
                <p className="text-white text-lg font-semibold mb-1 drop-shadow">
                  {cat.name}
                </p>
                <p className="text-gray-200 text-sm">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🏠 Anunțuri recente */}
      <section className="max-w-7xl mx-auto px-4 pb-10">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          Anunțuri recente
        </h2>

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
      </section>
    </div>
  );
}
