import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`${API_URL}/listings`);
        const data = await res.json();

        // Separăm promovatele (featuredUntil în viitor)
        const now = Date.now();
        const promoted = data.filter(
          (l) =>
            l.featuredUntil && new Date(l.featuredUntil).getTime() > now
        );
        setFeatured(promoted.slice(0, 6));
        setListings(data.slice(0, 6));
      } catch (err) {
        console.error("Eroare la încărcare:", err);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO SECTION */}
      <div
        className="relative bg-cover bg-center h-[480px] flex flex-col items-center justify-center text-white"
        style={{
          backgroundImage: "url('/fundal.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-blue-900/50"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Oltenița Imobiliare
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Cumpără, vinde sau închiriază locuințe în zona ta
          </p>

          {/* SEARCH BAR */}
          <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col md:flex-row gap-3 max-w-3xl mx-auto">
            <input
              type="text"
              placeholder="Cuvinte cheie (ex: 2 camere)"
              className="flex-1 border rounded-lg px-3 py-2 text-gray-700"
            />
            <select className="border rounded-lg px-3 py-2 text-gray-700">
              <option>Toate categoriile</option>
              <option>Apartamente</option>
              <option>Case</option>
              <option>Terenuri</option>
              <option>Garsoniere</option>
              <option>Garaje</option>
              <option>Spațiu comercial</option>
            </select>
            <select className="border rounded-lg px-3 py-2 text-gray-700">
              <option>Toate locațiile</option>
              <option>Oltenița</option>
              <option>Chirnogi</option>
              <option>Ulmeni</option>
              <option>Mitreni</option>
              <option>Spantov</option>
              <option>Chiselet</option>
              <option>Curcani</option>
              <option>Budesti</option>
              <option>Valea Rosie</option>
              <option>Luica</option>
              <option>Nana</option>
              <option>Cascioarele</option>
              <option>Radovanu</option>
              <option>Manastirea</option>
              <option>Soldanu</option>
              <option>Negoiesti</option>
              <option>Clătești</option>
            </select>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg">
              Caută
            </button>
          </div>
        </div>
      </div>

      {/* CATEGORII POPULARE */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Categorii populare</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { title: "Apartamente", img: "/apartamente.jpg", slug: "apartamente" },
            { title: "Case", img: "/case.jpg", slug: "case" },
            { title: "Terenuri", img: "/terenuri.jpg", slug: "terenuri" },
            { title: "Garsoniere", img: "/garsoniere.jpg", slug: "garsoniere" },
            { title: "Garaje", img: "/garaje.jpg", slug: "garaje" },
            { title: "Spațiu comercial", img: "/spatiu-comercial.jpg", slug: "spatiu-comercial" },
          ].map((cat) => (
            <Link
              key={cat.slug}
              to={`/categorie/${cat.slug}`}
              className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition group"
            >
              <img
                src={cat.img}
                alt={cat.title}
                className="w-full h-48 object-cover transform group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition"></div>
              <h3 className="absolute inset-0 flex items-center justify-center text-white font-semibold text-xl">
                {cat.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* ANUNȚURI PROMOVATE */}
      {featured.length > 0 && (
        <section className="bg-white py-10 border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">
              ⭐ Anunțuri promovate
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {featured.map((l) => (
                <Link
                  key={l._id}
                  to={`/anunt/${l._id}`}
                  className="bg-yellow-50 shadow-md rounded-xl overflow-hidden hover:shadow-lg transition relative"
                >
                  <div className="absolute top-2 right-2 bg-yellow-400 text-xs font-semibold px-2 py-1 rounded-full text-white">
                    ⭐ Promovat
                  </div>
                  <img
                    src={l.images?.[0] || "/apartamente.jpg"}
                    alt={l.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-2">{l.title}</h3>
                    <p className="text-blue-600 font-bold">{l.price} €</p>
                    <p className="text-gray-500 text-sm">{l.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ANUNȚURI RECENTE */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold mb-6">Anunțuri recente</h2>
        {listings.length === 0 ? (
          <p className="text-gray-600">Momentan nu sunt anunțuri disponibile.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {listings.map((l) => (
              <Link
                key={l._id}
                to={`/anunt/${l._id}`}
                className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={l.images?.[0] || "/apartamente.jpg"}
                  alt={l.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-2">{l.title}</h3>
                  <p className="text-blue-600 font-bold">{l.price} €</p>
                  <p className="text-gray-500 text-sm">{l.location}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
