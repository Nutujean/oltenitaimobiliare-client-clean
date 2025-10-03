import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import API_URL from "../api";
import { getFavIds, toggleFav } from "../utils/favorites";
import slugify from "../utils/slugify.js";

const PLACEHOLDER = "https://via.placeholder.com/800x450?text=Fara+imagine";

export default function Favorite() {
  const [ids, setIds] = useState(getFavIds());
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (ids.length === 0) {
          setItems([]);
          return;
        }
        const reqs = ids.map((id) =>
          fetch(`${API_URL}/listings/by-id/${id}`).then(async (r) =>
            r.ok ? await r.json() : null
          )
        );
        const results = await Promise.all(reqs);
        setItems(results.filter(Boolean));
      } finally {
        setLoading(false);
      }
    })();
  }, [ids]);

  const onToggle = (id) => {
    const next = toggleFav(id);
    setIds(next);
    setItems((prev) => prev.filter((x) => next.includes(x._id)));
  };

  const getImage = (l) =>
    Array.isArray(l.images) && l.images.length > 0
      ? l.images[0]
      : l.imageUrl || PLACEHOLDER;

  if (loading) return <p className="text-center py-10">Se încarcă...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Favorite</h1>

      {items.length === 0 ? (
        <p className="text-gray-600">
          Nu ai anunțuri favorite încă. Adaugă de pe paginile de anunțuri (butonul ❤️).
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((l) => (
            <div key={l._id} className="bg-white shadow-md rounded-xl overflow-hidden relative">
              <button
                onClick={() => onToggle(l._id)}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full px-2 py-1 shadow text-red-600"
                title="Elimină din favorite"
              >
                ❤️
              </button>

              <Link
                to={`/anunt/${slugify(l.title)}-${l._id}`}
                state={{ from: location.pathname + location.search }}
              >
                <img
                  src={getImage(l)}
                  alt={l.title}
                  className="w-full h-44 object-cover"
                  onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                />
              </Link>
              <div className="p-4">
                <Link
                  to={`/anunt/${slugify(l.title)}-${l._id}`}
                  state={{ from: location.pathname + location.search }}
                  className="block font-semibold line-clamp-2"
                >
                  {l.title}
                </Link>
                <div className="text-sm text-gray-600 mt-1 flex gap-3">
                  <span>{l.price} €</span>
                  <span>{l.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
