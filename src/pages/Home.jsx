import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import API_URL from "../api";

export default function Home() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`${API_URL}/listings`);
        if (!res.ok) throw new Error("Eroare la încărcarea anunțurilor");

        const data = await res.json();
        console.log("📦 Anunțuri primite:", data);
        setListings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Eroare la fetch listings:", err);
        setListings([]);
      }
    };

    fetchListings();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Oltenița Imobiliare - Cumpără, vinde sau închiriază</title>
        <meta
          name="description"
          content="Cumpără, vinde sau închiriază apartamente, case, terenuri și alte proprietăți în zona Oltenița."
        />
      </Helmet>

      {/* 🔹 Hero */}
      <section
        className="h-[500px] bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage: "url('/hero.jpg')",
        }}
      >
        <img
          src="/hero.jpg"
          alt="Hero"
          className="hidden"
          onError={(e) => {
            e.currentTarget.parentElement.style.backgroundImage =
              "url('https://via.placeholder.com/1200x500?text=Hero')";
          }}
        />
        <div className="bg-black bg-opacity-50 p-6 rounded-lg text-center">
          <h1 className="text-4xl font-bold mb-4">
            Bine ai venit la Oltenița Imobiliare
          </h1>
          <p className="mb-4">Caută, vinde sau închiriază proprietăți în zona ta</p>
          <Link
            to="/adauga-anunt"
            className="bg-green-600 px-6 py-3 rounded-lg font-bold hover:bg-green-700"
          >
            + Adaugă un anunț
          </Link>
        </div>
      </section>

      {/* 🔹 Categorii */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Categorii populare</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <Link to="/?categorie=apartamente" className="relative rounded-lg overflow-hidden shadow-lg">
            <img
              src="/apartament.jpg"
              alt="Apartamente"
              className="w-full h-40 object-cover"
              onError={(e) =>
                (e.currentTarget.src = "https://via.placeholder.com/400x250?text=Apartamente")
              }
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-lg font-bold">
              Apartamente
            </div>
          </Link>

          <Link to="/?categorie=case" className="relative rounded-lg overflow-hidden shadow-lg">
            <img
              src="/casa.jpg"
              alt="Case"
              className="w-full h-40 object-cover"
              onError={(e) =>
                (e.currentTarget.src = "https://via.placeholder.com/400x250?text=Case")
              }
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-lg font-bold">
              Case
            </div>
          </Link>

          <Link to="/?categorie=terenuri" className="relative rounded-lg overflow-hidden shadow-lg">
            <img
              src="/teren.jpg"
              alt="Terenuri"
              className="w-full h-40 object-cover"
              onError={(e) =>
                (e.currentTarget.src = "https://via.placeholder.com/400x250?text=Terenuri")
              }
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-lg font-bold">
              Terenuri
            </div>
          </Link>

          <Link to="/?categorie=garsoniere" className="relative rounded-lg overflow-hidden shadow-lg">
            <img
              src="/garsoniera.jpg"
              alt="Garsoniere"
              className="w-full h-40 object-cover"
              onError={(e) =>
                (e.currentTarget.src = "https://via.placeholder.com/400x250?text=Garsoniere")
              }
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-lg font-bold">
              Garsoniere
            </div>
          </Link>

          <Link to="/?categorie=garaje" className="relative rounded-lg overflow-hidden shadow-lg">
            <img
              src="/garaj.jpg"
              alt="Garaje"
              className="w-full h-40 object-cover"
              onError={(e) =>
                (e.currentTarget.src = "https://via.placeholder.com/400x250?text=Garaje")
              }
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-lg font-bold">
              Garaje
            </div>
          </Link>

          <Link to="/?categorie=spatiu-comercial" className="relative rounded-lg overflow-hidden shadow-lg">
            <img
              src="/spatiu.jpg"
              alt="Spațiu comercial"
              className="w-full h-40 object-cover"
              onError={(e) =>
                (e.currentTarget.src = "https://via.placeholder.com/400x250?text=Spatiu")
              }
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-lg font-bold">
              Spațiu comercial
            </div>
          </Link>
        </div>
      </section>

      {/* 🔹 Anunțuri recente */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Anunțuri recente</h2>
        {listings.length === 0 ? (
          <p className="text-gray-600">Momentan nu sunt anunțuri disponibile.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div
                key={listing._id}
                className="border rounded-lg shadow bg-white overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={
                    listing.imageUrl && listing.imageUrl !== "undefined"
                      ? listing.imageUrl
                      : "https://via.placeholder.com/400x250?text=Fără+imagine"
                  }
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 space-y-2">
                  <h2 className="text-lg font-bold">{listing.title}</h2>
                  <p className="text-gray-600">{listing.price} €</p>
                  <p className="text-sm text-gray-500 capitalize">{listing.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
