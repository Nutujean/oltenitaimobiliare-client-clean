import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API_URL from "../api";
import { getFavIds, isFav, toggleFav } from "../utils/favorites";
import slugify from "../utils/slugify.js";

const CATEGORIES = [
  "Apartamente",
  "Case",
  "Terenuri",
  "Garsoniere",
  "Garaje",
  "Spațiu comercial",
];

const LOCATII = [
  "Oltenita","Chirnogi","Ulmeni","Mitreni","Clatesti","Spantov","Cascioarele",
  "Soldanu","Negoiesti","Valea Rosie","Radovanu","Chiselet","Manastirea","Budesti",
];

const SORTS = [
  { value: "latest", label: "Recent" },
  { value: "oldest", label: "Cel mai vechi" },
  { value: "price_asc", label: "Cel mai ieftin" },
  { value: "price_desc", label: "Cel mai scump" },
];

const DEAL_TYPES = [
  { value: "", label: "Toate tipurile" },
  { value: "vanzare", label: "De vânzare" },
  { value: "inchiriere", label: "De închiriere" },
];

export default function Home() {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState("");
  const [favIds, setFavIds] = useState(getFavIds());

  const locationHook = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(locationHook.search);

  // filtre existente
  const [q, setQ] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("category") || "");
  const [city, setCity] = useState(params.get("location") || "");
  const [sort, setSort] = useState(params.get("sort") || "latest");
  const [dealType, setDealType] = useState(params.get("dealType") || "");

  // 🔹 filtre noi
  const [roomsMin, setRoomsMin] = useState(params.get("roomsMin") || "");
  const [surfaceMin, setSurfaceMin] = useState(params.get("surfaceMin") || "");
  const [priceMin, setPriceMin] = useState(params.get("priceMin") || "");
  const [priceMax, setPriceMax] = useState(params.get("priceMax") || "");

  const numOrEmpty = (v) => {
    if (v === "" || v === null || v === undefined) return "";
    const n = Number(String(v).replace(",", "."));
    return Number.isFinite(n) ? String(n) : "";
  };

  const getImageUrl = (l) => {
    if (Array.isArray(l.images) && l.images.length > 0) return l.images[0];
    if (l.imageUrl) return l.imageUrl;
    return "https://via.placeholder.com/400x250?text=Fara+imagine";
  };

  const fetchListings = async () => {
    try {
      setError("");
      const sp = new URLSearchParams();
      if (q) sp.set("q", q);
      if (category) sp.set("category", category);
      if (city) sp.set("location", city);
      if (sort) sp.set("sort", sort);
      if (dealType) sp.set("dealType", dealType);
      if (roomsMin) sp.set("roomsMin", roomsMin);
      if (surfaceMin) sp.set("surfaceMin", surfaceMin);
      if (priceMin) sp.set("priceMin", priceMin);
      if (priceMax) sp.set("priceMax", priceMax);

      const url = `${API_URL}/listings${sp.toString() ? "?" + sp.toString() : ""}`;
      const r = await fetch(url);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      setListings(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError(e.message || "Eroare necunoscută");
    }
  };

  useEffect(() => {
    const p = new URLSearchParams(locationHook.search);
    setQ(p.get("q") || "");
    setCategory(p.get("category") || "");
    setCity(p.get("location") || "");
    setSort(p.get("sort") || "latest");
    setDealType(p.get("dealType") || "");
    setRoomsMin(p.get("roomsMin") || "");
    setSurfaceMin(p.get("surfaceMin") || "");
    setPriceMin(p.get("priceMin") || "");
    setPriceMax(p.get("priceMax") || "");
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationHook.search]);

  const doSearch = () => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (category) sp.set("category", category);
    if (city) sp.set("location", city);
    if (sort) sp.set("sort", sort);
    if (dealType) sp.set("dealType", dealType);
    if (roomsMin) sp.set("roomsMin", numOrEmpty(roomsMin));
    if (surfaceMin) sp.set("surfaceMin", numOrEmpty(surfaceMin));
    if (priceMin) sp.set("priceMin", numOrEmpty(priceMin));
    if (priceMax) sp.set("priceMax", numOrEmpty(priceMax));
    navigate({ pathname: "/", search: sp.toString() });
  };

  const categoriesCards = [
    { name: "Apartamente", path: "/categorie/apartamente", image: "/apartamente.jpg" },
    { name: "Case", path: "/categorie/case", image: "/case.jpg" },
    { name: "Terenuri", path: "/categorie/terenuri", image: "/terenuri.jpg" },
    { name: "Garsoniere", path: "/categorie/garsoniere", image: "/garsoniere.jpg" },
    { name: "Garaje", path: "/categorie/garaje", image: "/garaje.jpg" },
    { name: "Spațiu comercial", path: "/categorie/spatiu-comercial", image: "/spatiu-comercial.jpg" },
  ];

  const onToggleFav = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleFav(id);
    setFavIds(next);
  };

  const dealBadge = (dt) => {
    if (dt === "inchiriere") return { text: "De închiriere", cls: "bg-purple-100 text-purple-700" };
    return { text: "De vânzare", cls: "bg-green-100 text-green-700" };
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HERO */}
      <section
        className="relative h-[60vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: "url('/fundal.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl font-bold mb-4">Oltenița Imobiliare</h1>
          <p className="text-lg">Cumpără, vinde sau închiriază locuințe în zona ta</p>
        </div>
      </section>

      {/* BARĂ DE CĂUTARE */}
      <section className="-mt-8 px-6 max-w-6xl mx-auto bg-white shadow rounded-xl py-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-8 gap-3">
          <input
            type="text"
            placeholder="Cuvinte cheie (ex: 2 camere)"
            className="border rounded-lg px-3 py-2 w-full"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <select
            className="border rounded-lg px-3 py-2 bg-white"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Toate categoriile</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            className="border rounded-lg px-3 py-2 bg-white"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">Toate locațiile</option>
            {LOCATII.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          <select
            className="border rounded-lg px-3 py-2 bg-white"
            value={dealType}
            onChange={(e) => setDealType(e.target.value)}
          >
            {DEAL_TYPES.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>

          {/* 🔹 Camere min. */}
          <input
            type="number"
            min="1"
            placeholder="Camere min."
            className="border rounded-lg px-3 py-2 w-full"
            value={roomsMin}
            onChange={(e) => setRoomsMin(e.target.value)}
          />

          {/* 🔹 Suprafață min. */}
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Suprafață min. (mp)"
            className="border rounded-lg px-3 py-2 w-full"
            value={surfaceMin}
            onChange={(e) => setSurfaceMin(e.target.value)}
          />

          {/* 🔹 Preț min. */}
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Preț min."
            className="border rounded-lg px-3 py-2 w-full"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
          />

          {/* 🔹 Preț max. */}
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Preț max."
            className="border rounded-lg px-3 py-2 w-full"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          <select
            className="border rounded-lg px-3 py-2 bg-white"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          <button
            onClick={doSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 w-full"
          >
            Caută
          </button>

          <Link
            to="/adauga-anunt"
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 w-full text-center"
          >
            + Adaugă anunț
          </Link>
        </div>
      </section>

      {/* EROARE */}
      {error && (
        <div className="max-w-6xl mx-auto mt-6 px-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <strong>Eroare la încărcarea anunțurilor:</strong> {error}
          </div>
        </div>
      )}

      {/* CATEGORII */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Categorii populare</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { name: "Apartamente", path: "/categorie/apartamente", image: "/apartamente.jpg" },
            { name: "Case", path: "/categorie/case", image: "/case.jpg" },
            { name: "Terenuri", path: "/categorie/terenuri", image: "/terenuri.jpg" },
            { name: "Garsoniere", path: "/categorie/garsoniere", image: "/garsoniere.jpg" },
            { name: "Garaje", path: "/categorie/garaje", image: "/garaje.jpg" },
            { name: "Spațiu comercial", path: "/categorie/spatiu-comercial", image: "/spatiu-comercial.jpg" },
          ].map((cat) => (
            <Link key={cat.name} to={cat.path} className="relative group">
              <div
                className="h-40 rounded-xl shadow-md bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: `url(${cat.image})` }}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition" />
                <h3 className="text-white text-xl font-bold z-10">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* LISTĂ ANUNȚURI */}
      <section className="py-4 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Anunțuri</h2>
        {listings.length === 0 && !error ? (
          <p className="text-gray-500">Nu există anunțuri pentru filtrele selectate.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {listings.map((l) => {
              const fav = isFav(l._id);
              const badge = l.dealType === "inchiriere"
                ? { text: "De închiriere", cls: "bg-purple-100 text-purple-700" }
                : { text: "De vânzare", cls: "bg-green-100 text-green-700" };

              return (
                <Link
                  key={l._id}
                  to={`/anunt/${slugify(l.title)}-${l._id}`}
                  state={{ from: locationHook.pathname + locationHook.search }}
                  className="bg-white shadow-md rounded-xl overflow-hidden block hover:shadow-lg transition relative"
                >
                  <span className={`absolute left-2 top-2 text-xs px-2 py-1 rounded-full ${badge.cls}`}>
                    {badge.text}
                  </span>

                  <button
                    onClick={(e) => onToggleFav(e, l._id)}
                    className={`absolute top-2 right-2 rounded-full px-2 py-1 shadow ${
                      fav ? "bg-white text-red-600" : "bg-white/90 text-gray-700"
                    } hover:bg-white`}
                    title={fav ? "Șterge din favorite" : "Adaugă la favorite"}
                  >
                    {fav ? "❤️" : "🤍"}
                  </button>

                  <img
                    src={getImageUrl(l)}
                    alt={l.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold line-clamp-2">{l.title}</h3>
                    {Number.isFinite(l.price) && (
                      <p className="text-gray-700 font-semibold">{l.price} €</p>
                    )}
                    <p className="text-sm text-gray-500">{l.location}</p>

                    {/* mini-specs */}
                    {(Number.isFinite(l.rooms) || Number.isFinite(l.surface)) && (
                      <p className="text-xs text-gray-500 mt-1">
                        {Number.isFinite(l.rooms) ? `${l.rooms} cam.` : ""}
                        {Number.isFinite(l.rooms) && Number.isFinite(l.surface) ? " • " : ""}
                        {Number.isFinite(l.surface) ? `${l.surface} mp` : ""}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}