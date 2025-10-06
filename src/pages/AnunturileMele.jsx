// src/pages/AnunturileMele.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function AnunturileMele() {
  const [list, setList] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMine = async () => {
    setLoading(true);
    setErr("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Nu ești autentificat.");
      const r = await fetch(`${API_URL}/listings/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error || "Eroare la preluare");
      setList(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMine();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Sigur vrei să ștergi anunțul?")) return;
    try {
      const token = localStorage.getItem("token");
      const r = await fetch(`${API_URL}/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error || "Eroare la ștergere");
      setList((prev) => prev.filter((x) => x._id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  const images = (l) => {
    if (Array.isArray(l.images) && l.images.length) return l.images;
    if (l.imageUrl) return [l.imageUrl];
    return ["https://via.placeholder.com/800x500?text=Fara+imagine"];
    };

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-10">Se încarcă...</div>;

  if (err)
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
          {err}
        </div>
        <Link
          to="/login"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
        >
          Autentificare
        </Link>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Anunțurile mele</h1>
        <Link
          to="/adauga-anunt"
          className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700"
        >
          + Adaugă anunț
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-700">Nu ai încă anunțuri. Creează primul anunț.</p>
          <Link
            to="/adauga-anunt"
            className="inline-block mt-3 bg-green-600 text-white px-4 py-2 rounded"
          >
            Adaugă anunț
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {list.map((l) => (
            <div key={l._id} className="bg-white rounded-xl shadow overflow-hidden">
              <Swiper modules={[Navigation]} navigation spaceBetween={8} slidesPerView={1}>
                {images(l).map((src, i) => (
                  <SwiperSlide key={i}>
                    <img src={src} alt={l.title} className="w-full h-64 object-cover" />
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-1">{l.title}</h3>
                <p className="text-gray-600 mb-1">
                  {l.price} € • {l.location}
                </p>
                <p className="text-sm text-gray-500 capitalize mb-4">
                  {l.category || "Nespecificat"}
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Link
                    to={`/editeaza-anunt/${l._id}`}
                    className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Editează
                  </Link>
                  <button
                    onClick={() => handleDelete(l._id)}
                    className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                  >
                    Șterge
                  </button>
                  <Link
                    to={`/anunt/${l._id}`}
                    className="px-3 py-2 rounded bg-gray-100 text-gray-800 hover:bg-gray-200"
                  >
                    Vezi public
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
