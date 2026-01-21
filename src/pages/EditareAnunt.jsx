import { useEffect, useMemo, useState } from "react";
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
  images: [], // ✅ URL-uri existente (din DB)
  isFree: true, // ✅ IMPORTANT (FREE/PAID)
});

  // ✅ preview-uri pentru poze noi (dataURL)
  const [newImages, setNewImages] = useState([]);
  // ✅ fișiere reale pentru upload
  const [newImageFiles, setNewImageFiles] = useState([]);

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
  price: data.price ?? "",
  category: data.category || "",
  location: data.location || "",
  phone: data.phone || "",
  images: Array.isArray(data.images) ? data.images : [],
  isFree: data.isFree ?? true, // ✅ IMPORTANT
});

        // resetăm orice selecție nouă când încărcăm anunțul
        setNewImages([]);
        setNewImageFiles([]);
      } catch (err) {
        setError(err.message || "Eroare");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  // 🔹 Schimbare câmp text
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Adăugare poze noi (preview + păstrăm FILE-urile pentru upload)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setNewImageFiles((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setNewImages((prev) => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  // 🔹 Înlocuire imagine existentă:
  // - scoatem URL-ul vechi din lista de existente
  // - adăugăm fișierul nou la upload + preview
  const replaceImage = (index, file) => {
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    setNewImageFiles((prev) => [...prev, file]);

    const reader = new FileReader();
    reader.onload = (ev) => setNewImages((prev) => [...prev, ev.target.result]);
    reader.readAsDataURL(file);
  };

  // 🔹 Ștergere poză existentă
  const removeExistingImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // 🔹 Ștergere poză nouă (preview + fișier)
  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // 🔹 Rearanjare imagini EXISTENTE (sus/jos)
  const moveImage = (index, direction) => {
    setFormData((prev) => {
      const arr = [...prev.images];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= arr.length) return prev;
      [arr[index], arr[targetIndex]] = [arr[targetIndex], arr[index]];
      return { ...prev, images: arr };
    });
  };

  const isFreeListing = listing?.isFree ?? formData?.isFree ?? true; // fallback
  const maxTotalImages = isFreeListing ? 10 : 15;
  const totalImagesCount = useMemo(
    () => (formData.images?.length || 0) + (newImageFiles?.length || 0),
    [formData.images, newImageFiles]
  );

  // 🔹 Salvare modificări (multipart/form-data)
  const handleSave = async () => {
    try {
      if (!token || token === "undefined" || token === "null") {
        alert("Trebuie să fii logat ca să editezi anunțul.");
        navigate("/login");
        return;
      }

      if (totalImagesCount > maxTotalImages) {
        alert(`⚠️ Maxim ${maxTotalImages} imagini în total.`);
        return;
      }

      const fd = new FormData();
      fd.append("title", formData.title || "");
      fd.append("description", formData.description || "");
      fd.append("price", String(formData.price ?? ""));
      fd.append("category", formData.category || "");
      fd.append("location", formData.location || "");
      fd.append("phone", formData.phone || "");

      // ✅ imaginile existente pe care le păstrezi
      (formData.images || []).forEach((url) => fd.append("existingImages", url));

      // ✅ poze noi (fișiere)
      (newImageFiles || []).forEach((file) => fd.append("images", file));

      const res = await fetch(`${API_URL}/listings/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // ⚠️ NU pune Content-Type manual la FormData
        },
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare la salvare");

      alert("✅ Anunț actualizat cu succes!");
      navigate("/anunturile-mele");
    } catch (err) {
      alert("❌ " + (err.message || "Eroare la salvare"));
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
                    onClick={() => document.getElementById(`replace-${i}`)?.click()}
                  />
                  <input
                    id={`replace-${i}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => replaceImage(i, e.target.files?.[0])}
                  />

                  <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      type="button"
                      onClick={() => removeExistingImage(i)}
                      className="bg-red-600 text-white text-xs px-2 py-1 rounded"
                    >
                      🗑️
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(i, -1)}
                      className="bg-gray-600 text-white text-xs px-2 py-1 rounded"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
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
          <input type="file" multiple accept="image/*" onChange={handleImageChange} />

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
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="text-xs text-gray-500 mt-2">
            Total imagini: <b>{totalImagesCount}</b> / {maxTotalImages}
          </div>
        </div>

        {/* 🔵 Acțiuni */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            💾 Salvează modificările
          </button>
          <button
            type="button"
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
