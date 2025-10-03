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

export default function Categories() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const categoryName = SLUG_TO_CATEGORY[slug] || "";
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  // Buton Înapoi: încearcă history, apoi fallback "/"
  const goBack = () => {
    try {
      const ref = document.referrer || "";
      const sameOrigin = ref && new URL(ref).origin === window.location.origin;
      if (location.state?.from) {
        return navigate(location.state.from);
      }
      if (sameOrigin) {
        return navigate(-1);
      }
    } catch (_) {}
    navigate("/");
  };

  useEffect(() => {
    (async () => {
      try {
        setErr("");
        const sp = new URLSearchParams();
        if (categoryName) sp.set("category", categoryName);
        const r = await fetch(`${API_URL}/listings?${sp.toString()}`);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = await r.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setErr(e.message || "Eroare la încărcare");
      }
    })();
  }, [categoryName]);

  const getImage = (l) =>
    Array.isArray(l.images) && l.images.length > 0
      ? l.images[0]
      : l.imageUrl || "https://via.placeholder.com/400x250?text=Fara+imagine";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Bara superioară cu Înapoi + titlu categorie */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={goBack}
          className="inline-flex items-center gap-2 px-3 py-1 rounded border hover:bg-gray-50 text-gray-700"
        >
          ← Înapoi
        </button>
        <h1 className="text-2xl font-bold">
          {categoryName || "Categorie"}
        </h1>
      </div>

      {err && (
        <div className="mb-4 bg-red-50 text-red-700 border border-red-200 px-3 py-2 rounded">
          {err}
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-gray-600">Nu s-au găsit anunțuri.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((l) => (
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
      )}
    </div>
  );
}
