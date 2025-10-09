import { useEffect, useState } from "react";
import API_URL from "../api";

export default function AnunturileMele() {
  const [myListings, setMyListings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      const res = await fetch(`${API_URL}/listings/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare la încărcarea anunțurilor mele");
      setMyListings(data);
    } catch (e) {
      console.error("Eroare la încărcarea anunțurilor mele:", e);
    }
  };

  const handleEdit = (listing) => {
    setEditingId(listing._id);
    setForm({ ...listing });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Sigur vrei să ștergi acest anunț?")) return;
    try {
      const res = await fetch(`${API_URL}/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare la ștergere");
      alert("✅ Anunț șters cu succes!");
      fetchMyListings();
    } catch (e) {
      alert("❌ " + e.message);
    }
  };

  const handleSave = async (id) => {
    try {
      const res = await fetch(`${API_URL}/listings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare la salvare");
      alert("✅ Anunț actualizat cu succes!");
      setEditingId(null);
      fetchMyListings();
    } catch (e) {
      alert("❌ " + e.message);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setForm({ ...form, images: [...(form.images || []), ...newImages] });
  };

  const removeImage = (index) => {
    const updated = [...form.images];
    updated.splice(index, 1);
    setForm({ ...form, images: updated });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Anunțurile Mele</h1>

      {myListings.length === 0 ? (
        <p className="text-gray-600">Nu ai încă anunțuri publicate.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {myListings.map((l) => (
            <div key={l._id} className="bg-white rounded-xl shadow-md p-4 relative">
              {editingId === l._id ? (
                <>
                  {/* ✏️ Editare anunț */}
                  <input
                    type="text"
                    className="border p-2 w-full mb-2 rounded"
                    value={form.title || ""}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Titlu"
                  />
                  <textarea
                    className="border p-2 w-full mb-2 rounded"
                    value={form.description || ""}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Descriere"
                  />
                  <input
                    type="number"
                    className="border p-2 w-full mb-2 rounded"
                    value={form.price || ""}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="Preț"
                  />

                  {/* 🖼️ Imagini */}
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {form.images?.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={img}
                          alt={`img-${idx}`}
                          className="w-full h-32 object-cover rounded"
                        />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <input
                    type="file"
                    multiple
                    onChange={handleImageChange}
                    className="border p-2 w-full mb-3 rounded"
                  />

                  <div className="flex justify-between">
                    <button
                      onClick={() => handleSave(l._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Salvează
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                      Anulează
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* 🔹 Vizualizare normală */}
                  {l.images?.length > 0 && (
                    <img
                      src={l.images[0]}
                      alt={l.title}
                      className="w-full h-40 object-cover rounded mb-2"
                    />
                  )}
                  <h2 className="font-bold text-lg mb-1">{l.title}</h2>
                  <p className="text-blue-600 font-semibold mb-2">{l.price} €</p>
                  <p className="text-gray-500 line-clamp-2 mb-3">{l.description}</p>

                  <div className="flex justify-between">
                    <button
                      onClick={() => handleEdit(l)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Editează
                    </button>
                    <button
                      onClick={() => handleDelete(l._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Șterge
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
