import { useEffect, useState } from "react";
import API_URL from "../api";

export default function AnunturileMele() {
  const [listings, setListings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    location: "",
    category: "",
    images: [],
  });

  const [previewImg, setPreviewImg] = useState(null); // ✅ imagine mărită
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const token = localStorage.getItem("token");

  // helper
  const apiTry = async (paths, options = {}) => {
    for (const p of paths) {
      try {
        const res = await fetch(`${API_URL}${p}`, options);
        let data = {};
        try {
          data = await res.json();
        } catch (_) {
          data = {};
        }

        if (res.ok) return data;
        if (res.status === 404) continue;
        throw new Error(data.message || data.error || `Eroare ${res.status}`);
      } catch (err) {
        if (String(err).includes("Failed to fetch")) continue;
        throw err;
      }
    }
    throw new Error("Ruta API inexistentă");
  };

  useEffect(() => {
    fetchListings();
    fetchUserProfile();
  }, []);

  const fetchListings = async () => {
    try {
      const data = await apiTry(
        ["/listings/my", "/listings/me", "/listings/user"],
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setListings(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Eroare la anunțurile mele:", e);
      setListings([]);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const data = await apiTry(
        ["/users/profile", "/auth/profile"],
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName(data?.name || "");
      setPhone(data?.phone || "");
      localStorage.setItem("userInfo", JSON.stringify(data || {}));
    } catch (err) {
      console.error("Eroare la obținerea profilului:", err);
    }
  };

  const handleEdit = (l) => {
    setEditingId(l._id);
    setForm({ ...l });
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
      alert("Anunț șters cu succes!");
      fetchListings();
    } catch (e) {
      alert("Eroare: " + e.message);
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
      fetchListings();
    } catch (e) {
      alert("❌ " + e.message);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...form.images];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => newImages.push(ev.target.result);
      reader.readAsDataURL(file);
    });
    setForm({ ...form, images: newImages });
  };

  // Actualizare profil
  const handleUpdateProfile = async () => {
    try {
      if (!token) {
        alert("Trebuie să fii logat pentru a modifica datele.");
        return;
      }
      const me = await apiTry(
        ["/users/profile", "/auth/profile"],
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!me?._id) {
        alert("Eroare la identificarea utilizatorului.");
        return;
      }
      const updated = await apiTry(
        [`/users/update/${me._id}`, `/auth/update/${me._id}`],
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, phone }),
        }
      );
      localStorage.setItem("userInfo", JSON.stringify(updated || {}));
      setSuccessMsg("✅ Datele au fost actualizate cu succes!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (error) {
      console.error("Eroare:", error);
      setSuccessMsg("❌ Eroare la actualizare!");
      setTimeout(() => setSuccessMsg(""), 4000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Anunțurile Mele</h1>

      {/* 🔵 PROFIL */}
      <div className="bg-blue-50 border border-blue-300 p-5 rounded-xl mb-10 shadow-sm">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">Profilul meu</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block text-sm font-medium mb-1 text-blue-900">Nume complet</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-blue-900">Telefon</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border p-2 rounded-md"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-2">
          <button
            onClick={handleUpdateProfile}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Salvează modificările
          </button>
          <button
            onClick={() => setPhone("")}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Șterge numărul
          </button>
        </div>

        {successMsg && (
          <p className={`mt-3 font-medium ${successMsg.includes("Eroare") ? "text-red-600" : "text-green-600"}`}>
            {successMsg}
          </p>
        )}
      </div>

      {/* 🔹 ANUNȚURI */}
      {listings.length === 0 ? (
        <p className="text-gray-600">Nu ai încă anunțuri.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {listings.map((l) =>
            editingId === l._id ? (
              <div key={l._id} className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold text-blue-700 mb-4">Editează anunțul</h3>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    placeholder="Titlu"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                  <input
                    type="number"
                    className="w-full border p-2 rounded"
                    placeholder="Preț (€)"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                  <textarea
                    className="w-full border p-2 rounded md:col-span-2"
                    placeholder="Descriere"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    placeholder="Locație"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  />
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    placeholder="Categorie"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  />
                </div>

                {/* 🖼️ Poze drag & drop */}
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagini</label>
                <div
                  className="grid grid-cols-3 gap-3 mb-4"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    const from = e.dataTransfer.getData("fromIndex");
                    const to = e.target.dataset.index;
                    if (from !== null && to !== undefined) {
                      const newImages = [...form.images];
                      const [moved] = newImages.splice(from, 1);
                      newImages.splice(to, 0, moved);
                      setForm({ ...form, images: newImages });
                    }
                  }}
                >
                  {form.images.map((img, idx) => (
                    <div
                      key={idx}
                      data-index={idx}
                      className="relative border border-blue-300 rounded-lg overflow-hidden cursor-move"
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("fromIndex", idx)}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-32 object-cover hover:opacity-90 transition"
                        onClick={() => setPreviewImg(img)}
                      />
                      <button
                        onClick={() =>
                          setForm({
                            ...form,
                            images: form.images.filter((_, i) => i !== idx),
                          })
                        }
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <input type="file" multiple onChange={handleImageChange} className="mb-4" />

                <div className="flex gap-3">
                  <button
                    onClick={() => handleSave(l._id)}
                    className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
                  >
                    Salvează
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500"
                  >
                    Anulează
                  </button>
                </div>
              </div>
            ) : (
              <div key={l._id} className="bg-white rounded-xl shadow-md overflow-hidden">
                {l.images?.length > 0 && (
                  <img src={l.images[0]} alt={l.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-4">
                  <p className="text-blue-700 font-bold text-lg">{l.price} €</p>
                  <h3 className="font-bold text-xl mb-1">{l.title}</h3>
                  <p className="text-gray-600">{l.location}</p>
                  <div className="mt-4 flex gap-3">
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
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* 🖼️ Modal previzualizare imagine */}
      {previewImg && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setPreviewImg(null)}
        >
          <img
            src={previewImg}
            alt="previzualizare"
            className="max-h-[90%] max-w-[90%] rounded-lg shadow-lg border-4 border-white"
          />
        </div>
      )}
    </div>
  );
}
