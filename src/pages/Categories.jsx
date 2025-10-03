import { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import API_URL from "../api";
import slugify from "../utils/slugify.js";

const SLUG_TO_CATEGORY = {
  apartamente: "Apartamente",
  case: "Case",
  terenuri: "Terenuri",
  garsoniere: "Garsoniere",
  garaje: "Garaje",
  "spatiu-comercial": "Spațiu comercial",
};

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

const PAGE_STEP = 9;

export default function Categories() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const categoryName = SLUG_TO_CATEGORY[slug] || "";
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_STEP);

  // filtre locale
  const params = new URLSearchParams(location.search);
  const [q, setQ] = useState(params.get("q") || "");
  const [city, setCity] = useState(params.get("location") || "");
  const [sort, setSort] = useState(params.get("sort") || "latest");

  // panou mobil
  const [showFilters, setShowFilters] = useState(false);

  // Buton Înapoi
  const goBack = () => {
    try {
      const ref = document.referrer || "";
      const sameOrigin = ref && new URL(ref).origin === window.location.origin;
      if (location.state?.from) return navigate(location.state.from);
      if (sameOrigin) return navigate(-1);
    } catch (_) {}
    navigate("/");
  };

  const fetchItems = async () => {
    try {
      setErr("");
      const sp = new URLSearchParams();
      if (categoryName) sp.set("category", categoryName);
      if (q) sp.set("q", q);
      if (city) sp.set("location", city);
      if (sort) sp.set("sort", sort);
      const r = await fetch(`${API_URL}/listings?${sp.toString()}`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      setItems(Array.isArray(data) ? data : []);
      setVisibleCount(PAGE_STEP);
    } catch (e) {
      setErr(e.message || "Eroare la încărcare");
    }
  };

  useEffect(() => {
    // când se schimbă categoria din URL, resetăm filtrarea locală (păstrăm sort)
    setQ("");
    setCity("");
    setVisibleCount(PAGE_STEP);
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryName]);

  // aplică filtrele și reflectă în URL
  const applyFilters = () => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (city) sp.set("location", city);
    if (sort) sp.set("sort", sort);
    navigate({ pathname: location.pathname, search: sp.toString() });
    fetchItems();
  };

  const getImage = (l) =>
    Array.isArray(l.images) && l.images.length > 0
      ? l.images[0]
      : l.imageUrl || "https://via.placeholder.com/400x250?text=Fara+imagine";

  const visible = items.slice(0, visibleCount);
  const canLoadMore = visibleCount < items.length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Bara superioară cu Înapoi + titlu categorie + filtre (desktop) */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="inline-flex items-center gap-2 px-3 py-1 rounded border hover:bg-gray-50 text-gray-700"
          >
            ← Înapoi
          </button>
          <h1 className="text-2xl font-bold">{categoryName || "Categorie"}</h1>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <input
            type="text"
            placeholder="Cuvinte cheie"
            className="border rounded-lg px-3 py-2"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
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
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <button
            onClick={applyFilters}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Aplică
          </button>
        </div>
      </div>

      {/* FAB Filtre (mobil) */}
      <button
        onClick={() => setShowFilters(true)}
        className="md:hidden fixed bottom-20 right-4 z-40 bg-white border shadow-lg rounded-full px-4 py-2"
        aria-label="Deschide filtre"
      >
        ⚙️ Filtre
      </button>

      {/* Panou Filtre mobil (bottom sheet) */}
      {showFilters && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowFilters(false)}
            aria-hidden="true"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">Filtre {categoryName ? `– ${categoryName}` : ""}</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Închide"
              >
                ✖
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                placeholder="Cuvinte cheie"
                className="border rounded-lg px-3 py-2 w-full"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
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
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setQ(""); setCity(""); setSort("latest"); }}
                className="flex-1 border px-4 py-2 rounded-lg"
              >
                Reset
              </button>
              <button
                onClick={() => { setShowFilters(false); applyFilters(); }}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Aplică
              </button>
            </div>
          </div>
        </div>
      )}

      {err && (
        <div className="mb-4 bg-red-50 text-red-700 border border-red-200 px-3 py-2 rounded">
          {err}
        </div>
      )}

      {/* lista */}
      {visible.length === 0 ? (
        <p className="text-gray-600">Nu s-au găsit anunțuri.</p>
      ) : (
        <>
          <div className="flex items-center justify-end mb-2 text-sm text-gray-500">
            Afișate {Math.min(visible.length, items.length)} din {items.length}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {visible.map((l) => (
              <Link
                key={l._id}
                to={`/anunt/${slugify(l.title)}-${l._id}`}
                state={{ from: location.pathname + location.search }}
                className="bg-white shadow-md rounded-xl overflow-hidden block hover:shadow-lg transition relative"
              >
                <img
                  src={getImage(l)}
                  alt={l.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold line-clamp-2">{l.title}</h3>
                  <p className="text-gray-600">{l.price} €</p>
                  <p className="text-sm text-gray-500">{l.location}</p>
                </div>
              </Link>
            ))}
          </div>

          {canLoadMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_STEP)}
                className="px-5 py-2 rounded-lg border bg-white hover:bg-gray-50"
              >
                Încarcă mai multe
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
