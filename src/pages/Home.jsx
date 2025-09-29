import React, { useState, useEffect } from "react";

function Home() {
  const [listings, setListings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch anunțuri din backend
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/listings`);
        const data = await res.json();
        setListings(data);
        setFiltered(data); // la început afișăm toate
        console.log("✅ Anunțuri primite:", data);
      } catch (err) {
        console.error("❌ Eroare la preluarea anunțurilor:", err);
      }
    };
    fetchListings();
  }, []);

  const filterByCategory = (category) => {
    setSelectedCategory(category);
    if (!category) {
      setFiltered(listings);
    } else {
      setFiltered(listings.filter((item) => item.category === category));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO SECTION */}
      <div
        className="relative bg-cover bg-center h-[400px] flex items-center justify-center text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1350&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Găsește-ți locuința ideală în Oltenița
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Vânzări • Cumparari • Inchirieri • Apartamente • Case • Garsoniere • Spații comerciale • Terenuri • Garaje
          </p>
          <a
            href="/adauga-anunt"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg"
          >
            Adaugă un anunț
          </a>
        </div>
      </div>

      {/* CARDURI CATEGORII */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6 p-6">
        <div
          onClick={() => filterByCategory("Apartament")}
          className="cursor-pointer bg-white shadow hover:shadow-lg rounded-lg p-4 text-center"
        >
          <img
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80"
            alt="Apartamente"
            className="mx-auto mb-2 rounded h-28 w-full object-cover"
          />
          <h3 className="font-semibold">Apartamente</h3>
        </div>

        <div
          onClick={() => filterByCategory("Casă")}
          className="cursor-pointer bg-white shadow hover:shadow-lg rounded-lg p-4 text-center"
        >
          <img
            src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=400&q=80"
            alt="Case"
            className="mx-auto mb-2 rounded h-28 w-full object-cover"
          />
          <h3 className="font-semibold">Case</h3>
        </div>

        <div
          onClick={() => filterByCategory("Teren")}
          className="cursor-pointer bg-white shadow hover:shadow-lg rounded-lg p-4 text-center"
        >
          <img
            src="https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=400&q=80"
            alt="Terenuri"
            className="mx-auto mb-2 rounded h-28 w-full object-cover"
          />
          <h3 className="font-semibold">Terenuri</h3>
        </div>

        <div
          onClick={() => filterByCategory("Garaj")}
          className="cursor-pointer bg-white shadow hover:shadow-lg rounded-lg p-4 text-center"
        >
          <img
            src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=400&q=80"
            alt="Garaje"
            className="mx-auto mb-2 rounded h-28 w-full object-cover"
          />
          <h3 className="font-semibold">Garaje</h3>
        </div>

        <div
          onClick={() => filterByCategory("Spațiu comercial")}
          className="cursor-pointer bg-white shadow hover:shadow-lg rounded-lg p-4 text-center"
        >
          <img
            src="https://images.unsplash.com/photo-1598970434795-0c54fe7c0642?auto=format&fit=crop&w=400&q=80"
            alt="Spații comerciale"
            className="mx-auto mb-2 rounded h-28 w-full object-cover"
          />
          <h3 className="font-semibold">Spații comerciale</h3>
        </div>
      </div>

      {/* LISTĂ ANUNȚURI */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {selectedCategory ? `Anunțuri la ${selectedCategory}` : "Ultimele anunțuri"}
          </h2>
          {selectedCategory && (
            <button
              onClick={() => filterByCategory(null)}
              className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
            >
              Resetează filtrul
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <p className="text-gray-600">Nu există anunțuri momentan.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((listing) => (
              <div
                key={listing._id}
                className="bg-white shadow hover:shadow-lg rounded-lg overflow-hidden cursor-pointer"
              >
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
                  <h3 className="text-lg font-semibold mb-2">
                    {listing.title}
                  </h3>
                  <p className="text-gray-600 mb-2">{listing.location}</p>
                  <p className="text-blue-600 font-bold">
                    {listing.price} EUR
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
