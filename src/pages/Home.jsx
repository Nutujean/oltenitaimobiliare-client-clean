import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Categories from "../components/Categories";
import { API_URL } from "../config";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchLocation, setSearchLocation] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        console.log("🌍 API_URL este:", API_URL);
        const res = await fetch(`${API_URL}/listings`);
        console.log("📡 Răspuns brut:", res);

        if (!res.ok) throw new Error("Eroare la preluarea anunțurilor");

        const data = await res.json();
        console.log("✅ Date primite:", data);
        setListings(data);
      } catch (error) {
        console.error("❌ Eroare fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchLocation) params.append("location", searchLocation);
    if (category) params.append("category", category);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);

    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HERO */}
      <div className="relative bg-gray-800 text-white">
        <img
          src="https://picsum.photos/1920/600?random=10"
          alt="Hero"
          className="w-full h-[400px] object-cover opacity-80"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Anunțuri imobiliare în Oltenița
          </h1>
          <p className="mb-6 text-lg">
            Cumpără, vinde sau închiriază rapid și ușor
          </p>
          <Link
            to="/adauga-anunt"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md transition"
          >
            + Adaugă un anunț
          </Link>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="max-w-4xl mx-auto -mt-10 relative z-10">
        <div className="bg-white shadow-lg rounded-xl p-4 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Caută după locație..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="flex-1 p-3 border rounded-lg"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 border rounded-lg"
          >
            <option value="">Toate categoriile</option>
            <option value="apartamente">Apartamente</option>
            <option value="case">Case</option>
            <option value="terenuri">Terenuri</option>
            <option value="garsoniere">Garsoniere</option>
            <option value="spatii">Spații comerciale</option>
          </select>
          <input
            type="number"
            placeholder="Preț min €"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="p-3 border rounded-lg w-28"
          />
          <input
            type="number"
            placeholder="Preț max €"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="p-3 border rounded-lg w-28"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Caută
          </button>
        </div>
      </div>

      {/* CATEGORII */}
      <Categories />

      {/* LISTĂ ANUNȚURI */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Anunțuri recente</h2>
        {loading ? (
          <p className="text-center text-gray-600">Se încarcă anunțurile...</p>
        ) : listings.length === 0 ? (
          <p className="text-center text-gray-600">Nu există anunțuri încă.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Link
                key={listing._id}
                to={`/listing/${listing._id}`}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
              >
                <img
                  src={
                    listing.images?.[0] ||
                    "https://via.placeholder.com/400x250?text=Fără+imagine"
                  }
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    {listing.title}
                  </h3>
                  <p className="text-blue-600 font-bold">
                    {listing.price} €
                  </p>
                  <p className="text-gray-600">{listing.location}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
