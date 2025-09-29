import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // state pentru search
  const [searchText, setSearchText] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/listings`);
        if (!res.ok) throw new Error("Eroare la încărcarea anunțurilor");
        const data = await res.json();
        setListings(data);
        setFiltered(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  // funcție pentru filtrare
  const handleSearch = (e) => {
    e.preventDefault();
    let results = listings;

    if (searchText) {
      results = results.filter(
        (l) =>
          l.title.toLowerCase().includes(searchText.toLowerCase()) ||
          l.description?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (searchCategory) {
      results = results.filter((l) => l.category === searchCategory);
    }

    if (searchLocation) {
      results = results.filter((l) =>
        l.location.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    setFiltered(results);
  };

  return (
    <div>
      {/* ✅ Hero cu fundal și search bar */}
      <div
        className="h-80 bg-cover bg-center flex flex-col items-center justify-center text-white"
        style={{
          backgroundImage:
            "url('https://source.unsplash.com/1600x500/?real-estate,city')",
        }}
      >
        <h1 className="text-3xl md:text-5xl font-bold bg-black bg-opacity-50 p-4 rounded mb-4">
          Găsește-ți locuința ideală în Oltenița
        </h1>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="bg-white text-black p-4 rounded shadow flex flex-col md:flex-row gap-3 md:gap-4 w-11/12 md:w-3/4 lg:w-2/3"
        >
          <input
            type="text"
            placeholder="Caută după titlu sau descriere"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 border p-2 rounded"
          />

          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Categorie</option>
            <option value="apartament">Apartament</option>
            <option value="casa">Casă</option>
            <option value="teren">Teren</option>
            <option value="garsoniera">Garsonieră</option>
            <option value="garaj">Garaj</option>
            <option value="spatiu comercial">Spațiu comercial</option>
          </select>

          <input
            type="text"
            placeholder="Localitate"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="border p-2 rounded"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Caută
          </button>
        </form>
      </div>

      {/* ✅ Listă anunțuri */}
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Anunțuri disponibile</h2>

        {loading && <p className="text-center mt-6">Se încarcă...</p>}
        {error && <p className="text-center text-red-500 mt-6">{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <p className="text-center">Nu există anunțuri care să corespundă criteriilor.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((listing) => (
            <div
              key={listing._id}
              className="relative border rounded shadow hover:shadow-lg bg-white"
            >
              {listing.rezervat && (
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                  Rezervat
                </span>
              )}

              {listing.images?.length > 0 ? (
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-48 object-cover rounded-t"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t">
                  <span className="text-gray-500">Fără imagine</span>
                </div>
              )}

              <div className="p-4">
                <h3 className="text-lg font-bold">{listing.title}</h3>
                <p className="text-gray-600">{listing.location}</p>
                <p className="text-blue-600 font-semibold">{listing.price} EUR</p>

                <Link
                  to={`/anunt/${listing._id}`}
                  className="block mt-4 bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700"
                >
                  Vezi detalii
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
