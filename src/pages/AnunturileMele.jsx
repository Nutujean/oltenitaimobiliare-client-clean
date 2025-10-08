import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../api";

export default function AnunturileMele() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  // decode simplu JWT pentru debug local (opțional)
  const parseJwtId = () => {
    try {
      const t = localStorage.getItem("token");
      if (!t) return null;
      const payload = JSON.parse(atob(t.split(".")[1] || ""));
      return payload.id || payload.userId || payload._id || null;
    } catch {
      return null;
    }
  };
  const myId = parseJwtId();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setErr("Trebuie să te autentifici pentru a vedea anunțurile tale.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setErr("");
        const r = await fetch(`${API_URL}/listings/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await r.json().catch(() => ({}));

        if (!r.ok) {
          throw new Error(data?.error || `Eroare la încărcarea anunțurilor mele (HTTP ${r.status})`);
        }

        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setErr(e.message || "Eroare la încărcarea anunțurilor mele");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-gray-600">
        Se încarcă anunțurile tale...
      </div>
    );
  }

  if (err) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4">
          <p className="mb-3">{err}</p>
          <div className="flex gap-3">
            <Link
              to="/login"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Autentificare
            </Link>
            <Link
              to="/register"
              className="inline-block border px-4 py-2 rounded-lg"
            >
              Creare cont
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-center">
        <p className="text-gray-600 mb-4">Nu ai încă anunțuri publicate.</p>
        <Link
          to="/adauga-anunt"
          className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          + Adaugă un anunț
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Anunțurile mele</h1>
        <Link
          to="/adauga-anunt"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Adaugă anunț
        </Link>
      </div>

      {/* listă carduri */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((l) => {
          const img =
            (Array.isArray(l.images) && l.images[0]) ||
            l.imageUrl ||
            "/no-image.jpg";
          const isFeatured =
            l.featuredUntil && new Date(l.featuredUntil).getTime() > Date.now();

          return (
            <div key={l._id} className="bg-white rounded-xl border overflow-hidden shadow">
              <Link to={`/anunt/${l._id}`}>
                <div className="relative">
                  <img src={img} alt={l.title} className="w-full h-48 object-cover" />
                  {isFeatured && (
                    <span className="absolute top-2 right-2 bg-blue-700 text-white text-xs px-2 py-1 rounded">
                      💎 Promovat
                    </span>
                  )}
                </div>
              </Link>

              <div className="p-4">
                <h3 className="font-semibold line-clamp-2">{l.title}</h3>
                <p className="text-blue-700 font-bold">{l.price} €</p>
                <p className="text-gray-500 text-sm">{l.location}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    to={`/editeaza-anunt/${l._id}`}
                    className="px-3 py-1 rounded border hover:bg-gray-50"
                  >
                    Editează
                  </Link>
                  <button
                    onClick={() => navigate(`/anunt/${l._id}`)}
                    className="px-3 py-1 rounded border hover:bg-gray-50"
                  >
                    Vezi
                  </button>
                  <Link
                    to={`/anunt/${l._id}?promoveaza=1`}
                    className="px-3 py-1 rounded bg-yellow-400/20 text-yellow-800 border border-yellow-300"
                  >
                    Promovează
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Debug minim (poți șterge după ce confirmi) */}
      <div className="mt-6 text-xs text-gray-400">
        ID utilizator (din token): {myId || "necunoscut"}
      </div>
    </div>
  );
}
