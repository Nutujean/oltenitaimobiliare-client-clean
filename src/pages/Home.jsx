import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

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

  const handleSearch = async (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (searchText) params.append("title", searchText);
    if (searchCategory) params.append("category", searchCategory);
    if (searchLocation) params.append("location", searchLocation);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/listings/search?${params.toString()}`
      );
      if (!res.ok) throw new Error("Eroare la căutare");
      const data = await res.json();
      setFiltered(data);
    } catch (err) {
      console.error("❌ Eroare search:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Formular căutare */}
      <form onSubmit={handleSearch} className="grid grid-cols-4 gap-2 mb-6">
        <input
          type="text"
          placeholder="Caută după titlu..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Toate categoriile</option>
          <option value="Apartament">Apartament</option>
          <option value="Casă">Casă</option>
          <option value="Garsoniera">Casă</option>
          <option value="Teren">Teren</option>
          <option value="Garaj">Garaj</option>
          <option value="Spațiu comercial">Spațiu comercial</option>
        </select>
        <input
          type="text"
          placeholder="Localitate..."
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white rounded px-4">
          Caută
        </button>
      </form>

      {/* Listă anunțuri */}
      <div className="grid grid-cols-3 gap-6">
        {filtered.map((listing) => (
          <div key={listing._id} className="border rounded shadow relative">
            {listing.rezervat && (
              <span className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-sm rounded">
                Rezervat
              </span>
            )}
            <img
              src={listing.images?.[0] || "https://via.placeholder.com/400x250?text=Fără+imagine"}
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
