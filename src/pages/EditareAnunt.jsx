import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../api";

export default function EditareAnunt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
    phone: "",
    images: [],
  });

  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Preia anunțul curent
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`${API_URL}/listings/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Eroare la încărcare");

        setFormData({
          title: data.title || "",
          description: data.description || "",
          price: data.price || "",
          category: data.category || "",
          location: data.location || "",
          phone: data.phone || "",
          images: data.images || [],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  // 🔹 Schimbare câmp text
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Adăugare poze noi (preview)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setNewImages((prev) => [...prev, ev.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // 🔹 Înlocuire imagine existentă
  const replaceImage = (index, file) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const newImages = [...formData.images];
      newImages[index] = ev.target.result;
      setFormData({ ...formData, images: newImages });
    };
    reader.readAsDataURL(file);
  };

  // 🔹 Ștergere poză existentă
  const removeExistingImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // 🔹 Ștergere poză nou adăugată
  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 🔹 Rearanjare imagini (sus/jos)
  const moveImage = (index, direction) => {
    const newArray = [...formData.images];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newArray.length) return;
    [newArray[index], newArray[targetIndex]] = [newArray[targetIndex], newArray[index]];
    setFormData({ ...formData, images: newArray });
  };

  // 🔹 Salvare modificări
  const handleSave = async () => {
    try {
      const updatedData = {
        ...formData,
        images: [...formData.images, ...newImages],
      };

      const res = await fetch(`${API_URL}/listings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare la salvare");

      alert("✅ Anunț actualizat cu succes!");
      navigate("/anunturile-mele");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  if (loading) return <p className="text-center py-10">Se încarcă anunțul...</p>;
  if (error) return <p className="text-center py-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">✏️ Editează Anunțul</h1>

      <div className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Titlul anunțului"
          className="w-full border p-3 rounded"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descriere"
          className="w-full border p-3 rounded h-32"
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Preț (€)"
          className="w-full border p-3 rounded"
        />
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Locație"
          className="w-full border p-3 rounded"
        />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Telefon"
          className="w-full border p-3 rounded"
        />

        {/* 🖼️ Poze existente */}
        {formData.images && formData.images.length > 0 && (
          <div>
            <label className="block font-semibold mb-2">📸 Imagini existente</label>
            <div className="grid grid-cols-3 gap-3">
              {formData.images.map((img, i) => (
                <div key={i} className="relative group">
                  <img
                    src={img}
                    alt={`img-${i}`}
                    className="w-full h-32 object-cover rounded border shadow-sm transition-transform duration-300 hover:scale-105 cursor-pointer"
                    onClick={() => document.getElementById(`replace-${i}`).click()}
                  />
                  <input
                    id={`replace-${i}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => replaceImage(i, e.target.files[0])}
                  />
                  <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => removeExistingImage(i)}
                      className="bg-red-600 text-white text-xs px-2 py-1 rounded"
                    >
                      🗑️
                    </button>
                    <button
                      onClick={() => moveImage(i, -1)}
                      className="bg-gray-600 text-white text-xs px-2 py-1 rounded"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveImage(i, 1)}
                      className="bg-gray-600 text-white text-xs px-2 py-1 rounded"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🆕 Poze noi */}
        <div className="mt-4">
          <label className="block font-semibold mb-2">➕ Adaugă imagini noi</label>
          <input type="file" multiple onChange={handleImageChange} />
          {newImages.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-3">
              {newImages.map((img, i) => (
                <div key={i} className="relative group">
                  <img
                    src={img}
                    alt={`new-${i}`}
                    className="w-full h-32 object-cover rounded border shadow-sm transition-transform duration-300 hover:scale-105"
                  />
                  <button
                    onClick={() => removeNewImage(i)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🔵 Acțiuni */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            💾 Salvează modificările
          </button>
          <button
            onClick={() => navigate("/anunturile-mele")}
            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-medium"
          >
            ← Înapoi
          </button>
        </div>
      </div>
    </div>
  );
}
