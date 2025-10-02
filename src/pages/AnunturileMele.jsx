import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../api";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("ro-RO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

const PLACEHOLDER = "https://via.placeholder.com/800x450?text=Fara+imagine";

export default function AnunturileMele() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  async function load() {
    try {
      setErr("");
      setLoading(true);
      const r = await fetch(`${API_URL}/listings/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (r.status === 401) {
        setErr("Trebuie să fii autentificat.");
        return;
      }
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Eroare la încărcare");
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || "Eroare necunoscută");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token) {
      setErr("Trebuie să fii autentificat.");
      setLoading(false);
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const delItem = async (id) => {
    if (!confirm("Ștergi acest anunț?")) return;
    try {
      const r = await fetch(`${API_URL}/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error || "Eroare la ștergere");
      setItems((prev) => prev.filter((x) => x._id !== id));
    } catch (e) {
      alert(e.message || "Eroare");
    }
  };

  const toggleStatus = async (it) => {
    const newStatus = it.status === "disponibil" ? "rezervat" : "disponibil";
    try {
      const r = await fetch(`${API_URL}/listings/${it._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error || "Eroare la actualizare");
      setItems((prev) =>
        prev.map((x) => (x._id === it._id ? { ...x, status: newStatus } : x))
      );
    } catch (e) {
      alert(e.message || "Eroare");
    }
  };

  const getImages = (l) => {
    const imgs =
      Array.isArray(l.images) && l.images.length > 0
        ? l.images.filter(Boolean)
        : l.imageUrl
        ? [l.imageUrl]
        : [];
    return imgs.length > 0 ? imgs : [PLACEHOLDER];
  };

  if (loading) return <p className="text-center py-10">Se încarcă...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Anunțurile mele</h1>
        <Link
          to="/adauga-anunt"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Adaugă anunț
        </Link>
      </div>

      {err && (
        <div className="mb-4 bg-red-50 text-red-700 border border-red-200 px-3 py-2 rounded">
          {err}
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-gray-600">Nu ai adăugat încă niciun anunț.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((it) => {
            const imgs = getImages(it);
            return (
              <div
                key={it._id}
                className="bg-white border rounded-xl overflow-hidden shadow-sm"
              >
                {/* Swiper pe card */}
                <div className="relative">
                  <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    spaceBetween={8}
                    slidesPerView={1}
                    className="h-44"
                  >
                    {imgs.map((src, idx) => (
                      <SwiperSlide key={idx}>
                        <Link to={`/anunt/${it._id}`}>
                          <img
                            src={src || PLACEHOLDER}
                            alt={`${it.title} - ${idx + 1}`}
                            className="w-full h-44 object-cover"
                            onError={(e) => {
                              e.currentTarget.src = PLACEHOLDER;
                            }}
                          />
                        </Link>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {imgs.length} foto
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold line-clamp-2">{it.title}</h3>
                  <div className="text-sm text-gray-600 mt-1 flex gap-3">
                    <span>{it.price} €</span>
                    <span>{it.location}</span>
                    <span>{fmtDate(it.createdAt)}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 items-center">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        it.status === "disponibil"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {it.status || "disponibil"}
                    </span>

                    <button
                      onClick={() => navigate(`/editeaza-anunt/${it._id}`)}
                      className="ml-auto border px-3 py-1 rounded hover:bg-gray-50"
                    >
                      Editează
                    </button>
                    <button
                      onClick={() => toggleStatus(it)}
                      className="border px-3 py-1 rounded hover:bg-gray-50"
                    >
                      Marchează {it.status === "disponibil" ? "rezervat" : "disponibil"}
                    </button>
                    <button
                      onClick={() => delItem(it._id)}
                      className="border px-3 py-1 rounded text-red-600 hover:bg-red-50"
                    >
                      Șterge
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
