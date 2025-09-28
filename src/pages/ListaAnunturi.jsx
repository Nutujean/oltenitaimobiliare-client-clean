import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AnuntCard from "../components/AnuntCard";

export default function ListaAnunturi() {
  const [anunturi, setAnunturi] = useState([]);
  const [filtre, setFiltre] = useState({
    locatie: "",
    categorie: "",
    tranzactie: "",
    camere: "",
    pretMin: "",
    pretMax: "",
    sort: "",
  });

  const location = useLocation();

  // Citește parametrii din URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setFiltre((prev) => ({
      ...prev,
      locatie: params.get("locatie") || "",
      categorie: params.get("categorie") || "",
      camere: params.get("camere") || "",
    }));
  }, [location.search]);

  // Fetch anunțuri din backend
  useEffect(() => {
    fetch("https://imobila-market-backend.onrender.com/api/anunturi")
      .then((res) => res.json())
      .then((data) => setAnunturi(data))
      .catch((err) => console.error("Eroare la încărcare anunțuri:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltre({ ...filtre, [name]: value });
  };

  // Aplica filtre + sortare
  const anunturiFiltrate = anunturi
    .filter((a) =>
      filtre.locatie
        ? a.locatie?.toLowerCase().includes(filtre.locatie.toLowerCase())
        : true
    )
    .filter((a) => (filtre.categorie ? a.categorie === filtre.categorie : true))
    .filter((a) => (filtre.tranzactie ? a.tranzactie === filtre.tranzactie : true))
    .filter((a) => (filtre.camere ? a.camere === filtre.camere : true))
    .filter((a) => (filtre.pretMin ? a.pret >= filtre.pretMin : true))
    .filter((a) => (filtre.pretMax ? a.pret <= filtre.pretMax : true))
    .sort((a, b) => {
      if (filtre.sort === "asc") return a.pret - b.pret;
      if (filtre.sort === "desc") return b.pret - a.pret;
      if (filtre.sort === "nou")
        return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">🔍 Caută anunțuri</h1>

      {/* FILTRE */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 bg-white p-4 rounded-lg shadow mb-8">
        <input
          type="text"
          name="locatie"
          placeholder="Locație"
          value={filtre.locatie}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
        />
        <select
          name="categorie"
          value={filtre.categorie}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Categorie</option>
          <option value="apartament">Apartament</option>
          <option value="casa">Casă / Vilă</option>
          <option value="teren">Teren</option>
          <option value="garaj">Garaj</option>
        </select>
        <select
          name="tranzactie"
          value={filtre.tranzactie}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Tranzacție</option>
          <option value="vanzare">Vânzare</option>
          <option value="inchiriere">Închiriere</option>
        </select>
        <select
          name="camere"
          value={filtre.camere}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Camere</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4+">4+</option>
        </select>
        <input
          type="number"
          name="pretMin"
          placeholder="Preț minim"
          value={filtre.pretMin}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
        />
        <input
          type="number"
          name="pretMax"
          placeholder="Preț maxim"
          value={filtre.pretMax}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
        />
      </div>

      {/* SORTARE */}
      <div className="flex justify-end mb-6">
        <select
          name="sort"
          value={filtre.sort}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Sortează după</option>
          <option value="nou">Cele mai noi</option>
          <option value="asc">Preț crescător</option>
          <option value="desc">Preț descrescător</option>
        </select>
      </div>

      {/* LISTĂ ANUNȚURI */}
      {anunturiFiltrate.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {anunturiFiltrate.map((anunt) => (
            <AnuntCard key={anunt._id} anunt={anunt} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">
          Nu există anunțuri pentru criteriile alese.
        </p>
      )}
    </div>
  );
}
