import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../api";
import slugify from "../utils/slugify.js";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function AnunturileMele() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [planById, setPlanById] = useState({}); // { [listingId]: "featured7" | "featured30" }

  const token = localStorage.getItem("token") || "";

  const getImageUrl = (l) => {
    if (Array.isArray(l.images) && l.images.length > 0) return l.images[0];
    if (l.imageUrl) return l.imageUrl;
    return "https://via.placeholder.com/600x400?text=Fara+imagine";
  };

  const fetchMine = async () => {
    try {
      setLoading(true);
      setErr("");
      const r = await fetch(`${API_URL}/listings/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error || "Eroare la încărcarea anunțurilor mele");
      setItems(Array.isArray(data) ? data : []);
      // init plan implicit
      const initPlans = {};
      (Array.isArray(data) ? data : []).forEach((l) => (initPlans[l._id] = "featured7"));
      setPlanById(initPlans);
    } catch (e) {
      setErr(e.message || "Eroare");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      nav("/login?next=/anunturile-mele");
      return;
    }
    fetchMine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleDelete = async (id) => {
    if (!confirm("Sigur vrei să ștergi acest anunț?")) return;
    try {
      const r = await fetch(`${API_URL}/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error || "Eroare la ștergere");
      setItems((prev) => prev.filter((x) => x._id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  const startPromotion = async (listing) => {
    try {
      const plan = planById[listing._id] || "featured7";
      const r = await fetch(`${API_URL}/stripe/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ listingId: listing._id, plan }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error || "Eroare la inițierea plății");
      window.location.href = data.url; // Stripe Checkout
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Anunțurile mele</h1>
        <Link
          to="/adauga-anunt"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Adaugă anunț
        </Link>
      </div>

      {err && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {err}
        </div>
      )}

      {loading ? (
        <p>Se încarcă...</p>
      ) : items.length === 0 ? (
        <p>Nu ai încă anunțuri.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((l) => {
            const featuredActive =
              l.featuredUntil && new Date(l.featuredUntil).getTime() > Date.now();

            return (
              <div key={l._id} className="bg-white rounded-xl shadow overflow-hidden">
                {/* Slider imagini */}
                {(l.images?.length || l.imageUrl) ? (
                  <Swiper
                    modules={[Navigation, Pagination, Keyboard]}
                    navigation
                    pagination={{ clickable: true }}
                    keyboard={{ enabled: true }}
                    spaceBetween={8}
                    slidesPerView={1}
                    className="w-full"
                  >
                    {(l.images?.length ? l.images : [l.imageUrl]).map((img, i) => (
                      <SwiperSlide key={i}>
                        <img
                          src={img || "https://via.placeholder.com/800x500?text=Fara+imagine"}
                          alt={l.title}
                          className="w-full h-56 object-cover"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <img
                    src={getImageUrl(l)}
                    alt={l.title}
                    className="w-full h-56 object-cover"
                  />
                )}

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">{l.title}</h3>
                      <p className="text-gray-600">{l.price} € • {l.location}</p>
                      <p className="text-sm text-gray-500">{l.category}</p>
                      {featuredActive && (
                        <p className="text-xs text-amber-700 mt-1">
                          Promovat până la {new Date(l.featuredUntil).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <Link
                        to={`/editeaza-anunt/${l._id}`}
                        className="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 text-center"
                      >
                        Editează
                      </Link>
                      <button
                        onClick={() => handleDelete(l._id)}
                        className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700"
                      >
                        Șterge
                      </button>
                      <Link
                        to={`/anunt/${slugify(l.title)}-${l._id}`}
                        className="px-3 py-1 rounded bg-gray-100 text-gray-800 text-sm hover:bg-gray-200 text-center"
                        target="_blank"
                      >
                        Vezi public
                      </Link>
                    </div>
                  </div>

                  {/* Promovare - direct în listă */}
                  <div className="mt-4 border-t pt-3">
                    {featuredActive ? (
                      <p className="text-green-700 text-sm">
                        Anunțul este deja promovat.
                      </p>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          className="border rounded px-3 py-2 bg-white"
                          value={planById[l._id] || "featured7"}
                          onChange={(e) =>
                            setPlanById((m) => ({ ...m, [l._id]: e.target.value }))
                          }
                        >
                          <option value="featured7">Promovare 7 zile (4.99 €)</option>
                          <option value="featured30">Promovare 30 zile (14.99 €)</option>
                        </select>
                        <button
                          onClick={() => startPromotion(l)}
                          className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
                        >
                          Promovează acum
                        </button>
                      </div>
                    )}
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