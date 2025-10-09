import { useEffect, useState } from "react";
import API_URL from "../api";

export default function AnunturileMele() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const token = localStorage.getItem("token");

  // 🔹 Obține anunțurile utilizatorului
  const fetchListings = async () => {
    try {
      const res = await fetch(`${API_URL}/listings/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setListings(data);
      else console.error("Eroare:", data.error);
    } catch (e) {
      console.error("Eroare server:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // 🔹 Începe editarea
  const handleEdit = (l) => {
    setEditingId(l._id);
    setForm({
      title: l.title,
      price: l.price,
      location: l.location,
      description: l.description,
      images: l.images || [],
    });
  };

  // 🔹 Salvare modificări
  const handleSave = async (id) => {
    try {
      const formData = new FormData();
      for (const key in form) {
        if (key === "images") {
          form.images.forEach((img) => formData.append("images", img));
        } else {
          formData.append(key, form[key]);
        }
      }

      const res = await fetch(`${API_URL}/listings/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare la salvare");

      alert("✅ Anunț actualizat cu succes!");
      setEditingId(null);
      fetchListings();
    } catch (e) {
      alert("❌ " + e.message);
    }
  };

  // 🔹 Șterge anunț
  const handleDelete = async (id) => {
    if (!window.confirm("Sigur vrei să ștergi acest anunț?")) return;
    try {
      const res = await fetch(`${API_URL}/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare la ștergere");
      alert("🗑️ Anunț șters cu succes!");
      fetchListings();
    } catch (e) {
      alert("❌ " + e.message);
    }
  };

  // 🔹 Promovare
  const handlePromote = async (listingId, plan = "featured7") => {
    try {
      const res = await fetch(`${API_URL}/stripe/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ listingId, plan }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare la promovare");
      window.location.href = data.url;
    } catch (e) {
      alert("❌ " + e.message);
    }
  };

  if (loading) return <p className="text-center py-10">Se încarcă anunțurile...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Anunțurile Mele</h1>

      {listings.length === 0 ? (
        <p className="text-gray-600 text-center">Nu ai adăugat niciun anunț încă.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((l) =>
            editingId === l._id ? (
              <div
                key={l._id}
                className="p-4 border rounded-xl bg-gray-50 shadow-inner space-y-4"
              >
                <h3 className="text-xl font-semibold mb-3">Editează anunțul</h3>

                {/* 🖼️ Imagini existente mari + ștergere */}
                {form.images?.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                    {form.images.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={
                            typeof img === "string"
                              ? img
                              : URL.createObjectURL(img)
                          }
                          alt={`imagine-${idx}`}
                          className="w-full h-44 object-cover rounded-lg shadow-md"
                        />
                        <button
                          onClick={() =>
                            setForm({
                              ...form,
                              images: form.images.filter((_, i) => i !== idx),
                            })
                          }
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-700"
                          title="Șterge imaginea"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 📤 Încarcă imagini noi */}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      images: [
                        ...(form.images || []),
                        ...Array.from(e.target.files || []),
                      ],
                    })
                  }
                  className="block w-full border p-2 rounded-md"
                />

                {/* ✏️ Titlu */}
                <input
                  type="text"
                  value={form.title || ""}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Titlu anunț"
                  className="block w-full border p-2 rounded-md"
                />

                {/* 💰 Preț */}
                <input
                  type="number"
                  value={form.price || ""}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="Preț (RON)"
                  className="block w-full border p-2 rounded-md"
                />

                {/* 📍 Locație */}
                <input
                  type="text"
                  value={form.location || ""}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  placeholder="Localitate / zonă"
                  className="block w-full border p-2 rounded-md"
                />

                {/* 📝 Descriere */}
                <textarea
                  value={form.description || ""}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Descriere anunț"
                  className="block w-full border p-2 rounded-md min-h-[100px]"
                />

                {/* 🔘 Butoane */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSave(l._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    Salvează
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
                  >
                    Anulează
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={l._id}
                className="border rounded-xl shadow hover:shadow-lg transition bg-white overflow-hidden"
              >
                {l.images?.[0] ? (
                  <img
                    src={l.images[0]}
                    alt={l.title}
                    className="w-full h-52 object-cover"
                  />
                ) : (
                  <div className="w-full h-52 bg-gray-200 flex items-center justify-center text-gray-500">
                    Fără imagine
                  </div>
                )}

                <div className="p-4 space-y-1">
                  <p className="text-blue-700 font-bold text-lg">
                    {l.price} RON
                  </p>
                  <h3 className="font-semibold text-xl line-clamp-2">
                    {l.title}
                  </h3>
                  <p className="text-sm text-gray-600">{l.location}</p>
                </div>

                <div className="flex gap-2 p-4 pt-0">
                  <button
                    onClick={() => handleEdit(l)}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-md"
                  >
                    Editează
                  </button>
                  <button
                    onClick={() => handleDelete(l._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md"
                  >
                    Șterge
                  </button>
                  <button
                    onClick={() => handlePromote(l._id, "featured7")}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md"
                  >
                    Promovează
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
