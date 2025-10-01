import { useState } from "react";
import { Link } from "react-router-dom";

export default function SearchBar({ onSearch, initial = {} }) {
  const [q, setQ] = useState(initial.q || "");
  const [location, setLocation] = useState(initial.location || "");
  const [price, setPrice] = useState(initial.price || "");

  const submit = (e) => {
    e.preventDefault();
    onSearch({
      q: q.trim(),
      location: location.trim(),
      price: price ? Number(price) : "",
    });
  };

  return (
    <form
      onSubmit={submit}
      className="-mt-8 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[2fr,1.5fr,1fr,auto] gap-3 items-center bg-white shadow rounded-xl py-4 relative z-10"
    >
      <input
        type="text"
        placeholder="Caută titlu sau cuvinte-cheie…"
        className="border rounded-lg px-4 py-2 w-full"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <input
        type="text"
        placeholder="Locație (ex. Oltenița)…"
        className="border rounded-lg px-4 py-2 w-full"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <input
        type="number"
        min="0"
        step="100"
        placeholder="Preț max (€)"
        className="border rounded-lg px-4 py-2 w-full"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <div className="flex gap-2 w-full md:w-auto">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition w-full md:w-auto"
        >
          Caută
        </button>
        <Link
          to="/adauga-anunt"
          className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition w-full md:w-auto text-center"
        >
          + Adaugă anunț
        </Link>
      </div>
    </form>
  );
}
