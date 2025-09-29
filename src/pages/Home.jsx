import React, { useState, useEffect } from "react";

function Home() {
  const [listings, setListings] = useState([]);

  // Exemplu fetch anunțuri (poți adapta după backend-ul tău)
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/listings`);
        const data = await res.json();
        setListings(data);
      } catch (err) {
        console.error("Eroare la preluarea anunțurilor:", err);
      }
    };
    fetchListings();
  }, []);

  const filterByCategory = (category) => {
    if (!category) return listings;
    return listings.filter((item) => item.category === category);
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
            Vânzări • Închirieri • Terenuri • Spații comerciale
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
    </div>
  );
}

export default Home;
