import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/listings`);
        if (!res.ok) throw new Error("Eroare la preluarea anunțurilor");
        const data = await res.json();
        setListings(data);
        setFiltered(data);
      } catch (err) {
        console.error("❌ Eroare fetch:", err);
      }
    };
    fetchListings();
  }, []);

  // filtrează după categorie când dai click pe card
  const filterByCategory = (category) => {
    const filteredData = listings.filter((l) => l.category === category);
    setFiltered(filteredData);
  };

  return (
    <div>
      {/* ✅ Hero cu imagine fundal */}
      <div
        className="h-96 bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <h1 className="text-4xl md:text-6xl font-bold bg-black bg-opacity-50 px-6 py-3 rounded">
          Oltenița Imobiliare
        </h1>
      </div>

      {/* ✅ Carduri categorii */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6 p-6">
        <div
          onClick={() => filterByCategory("Apartament")}
          className="cursor-pointer bg-white shadow hover:shadow-lg rounded-lg p-4 text-center"
        >
          <img
            src="https://via.placeholder.com/150?text=Apartament"
            alt="Apartamente"
            className="mx-auto mb-2 rounded"
          />
          <h3 className="font-semibold">Apartamente</h3>
        </div>
        <div
          onClick={() => filterByCategory("Casă")}
          className="cursor-pointer bg-white shadow hover:shadow-lg rounded-lg p-4 text-center"
        >
          <img
            src="https://via.placeholder.com/150?text=Casa"
            alt="Case"
            className="mx-auto mb-2 rounded"
          />
          <h3 className="font-semibold">Case</h3>
        </div>
        <div
          onClick={() => filterByCategory("Teren")}
          className="cursor-pointer bg-white shadow hover:shadow-lg rounded-lg p-4 text-center"
        >
          <img
            src="https://via.placeholder.com/150?text=Teren"
            alt="Terenuri"
            className="mx-auto mb-2 rounded"
          />
          <h3 className="font-semibold">Terenuri</h3>
        </div>
        <div
          onClick={() => filterByCategory("Garaj")}
          className="cursor-pointer bg-white shadow hover:shadow-lg rounded-lg p-4 text-center"
        >
          <img
            src="https://via.placeholder.com/150?text=Garaj"
            alt="Garaje"
            className="mx-auto mb-2 rounded"
          />
          <h3 className="font-semibold">Garaje</h3>
        </div>
        <div
          onClick={() => filterByCategory("Spațiu comercial")}
          className="cursor-pointer bg-white shadow hover:shadow-lg rounded-lg p-4 text-center"
        >
          <img
            src="https://via.placeholder.com/150?text=Spatiu"
            alt="Spații comerciale"
            className="mx-auto mb-2 rounded"
          />
          <h3 className="font-semibold">Spații comerciale</h3>
        </div>
      </div>

      {/* ✅ Lista anunțuri */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {filtered.map((listing) => (
          <div key={listing._id} className="border rounded shadow relative">
            {listing.rezervat && (
              <span className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-sm rounded">
                Rezervat
              </span>
            )}
            <img
              src={
                listing.images?.[0] ||
                "https://via.placeholder.com/400x250?text=Fără+imagine"
              }
              alt={listing.title}
              className="w-full h-48 object-cover rounded-t"
            />
            <div className="p-4">
              <h2 className="font-bold text-lg">{listing.title}</h2>
              <p className="text-blue-600 font-semibold">{listing.price} EUR</p>
              <p className="text-gray-500">{listing.location}</p>
              <Link
                to={`/anunt/${listing._id}`}
                className="mt-2 inline-block text-blue-500 underline"
              >
                Vezi detalii
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
