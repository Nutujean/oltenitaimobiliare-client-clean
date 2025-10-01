import { useState } from "react";
import { Link } from "react-router-dom";

const CATEGORIES = [
  "Apartamente",
  "Case",
  "Terenuri",
  "Garsoniere",
  "Garaje",
  "Spațiu comercial",
];

const LOCATII = [
  "Oltenita",
  "Chirnogi",
  "Ulmeni",
  "Mitreni",
  "Clatesti",
  "Spantov",
  "Cascioarele",
  "Soldanu",
  "Negoiesti",
  "Valea Rosie",
  "Radovanu",
  "Chiselet",
  "Manastirea",
  "Budesti",
];

export default function SearchBar({ onSearch, initial = {} }) {
  const [q, setQ] = useState(initial.q || "");
  const [category, setCategory] = useState(initial.category || "");
  const [location, setLocation] = useState(initial.location || "");
  const [sort, setSort] = useState(initial.sort || "latest"); // latest | oldest | price_asc | price_desc

  const submit = (e) => {
    e.preventDefault();
    onSearch({
      q: q.trim(),
      category,
      location,
      sort,
    });
  };

  return (
    <form
      onSubmit={submit}
      className="px-6 -mt-8 max-w-6xl mx-auto grid gap-3 items-center bg-white shadow rounded-xl py-4 relative z-10
                 grid-cols-1 md:grid-cols-[1.6fr,1.1fr,1.1fr,1.1fr,auto,auto]"
    >
      {/* Caută (text) */}
      <input
        type="text"
        placeholder="Caută titlu sau cuvinte-cheie…"
        className="border rounded-lg px-4 py-2 w-full"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {/* Categorie (dropdown) */}
      <select
        className="border rounded-lg px-3 py-2 bg-white"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        aria-label="Categorie"
      >
        <option value="">Toate categoriile</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* Locație (dropdown exact) */}
      <select
        className="border rounded-lg px-3 py-2 bg-white"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        aria-label="Locație"
      >
        <option value="">Toate locațiile</option>
        {LOCATII.map((loc) => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
      </select>

      {/* Preț / Ordonare */}
      <select
        className="border rounded-lg px-3 py-2 bg-white"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        aria-label="Ordonare"
      >
        <option value="latest">Recent</option>
        <option value="oldest">Cel mai vechi</option>
        <option value="price_asc">Cel mai ieftin</option>
        <option value="price_desc">Cel mai scump</option>
      </select>

      {/* Caută */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition w-full md:w-auto"
      >
        Caută
      </button>

      {/* Adaugă anunț */}
      <Link
        to="/adauga-anunt"
        className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition w-full md:w-auto text-center"
      >
        + Adaugă anunț
      </Link>
    </form>
  );
}
