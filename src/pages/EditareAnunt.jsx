import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../api";
import { LOCATII } from "../constants/localitati";

const CATEGORII = [
  { value: "apartamente", label: "Apartamente" },
  { value: "garsoniere", label: "Garsoniere" },
  { value: "case", label: "Case" },
  { value: "terenuri", label: "Terenuri" },
  { value: "spatiu_comercial", label: "Spațiu comercial" },
  { value: "garaj", label: "Garaj" },
];

const TIPURI_TRANZACTIE = [
  { value: "vand", label: "Vând" },
  { value: "cumpar", label: "Cumpăr" },
  { value: "inchiriez", label: "Închiriez" },
  { value: "schimb", label: "Schimb" },
];


export default function EditareAnunt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    type: "",        // ✅ NOU: tip tranzacție
    location: "",
    phone: "",
    images: [],      // URL-uri existente
    isFree: true,    // ✅ important pentru limită 10/15
  });

  // preview-uri poze noi (dataURL)
  const [newImages, setNewImages] = useState([]);
  // fișiere reale pentru upload
  const [newImageFiles, setNewImageFiles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ✅ limită în funcție de tipul anunțului
  const maxTotalImages = formData.isFree ? 10 : 15;

  const totalImagesCount = useMemo(
    () => (formData.images?.length || 0) + (newImageFiles?.length || 0),
    [formData.images, newImageFiles]
  );

  // ✅ helper: normalize phone
  function normalizePhone(value) {
    if (!value) return "";
    return String(value).replace(/\D/g, "");
  }

  // ✅ validare obligatorie
  function validateForm(fd) {
    const title = String(fd.title || "").trim();
    const category = String(fd.category || "").trim();
    const type = String(fd.type || "").trim();
    const location = String(fd.location || "").trim();
    const phone = normalizePhone(fd.phone);

    if (!title) return "Titlul este obligatoriu.";
    if (!category) return "Categoria este obligatorie.";
    if (!type) return "Tipul (Vând/Cumpăr/Închiriez/Schimb) este obligatoriu.";
    if (!location) return "Localitatea este obligatorie.";
    if (!phone) return "Numărul de telefon este obligatoriu.";
    if (phone.length < 9) return "Numărul de telefon pare invalid.";

    return "";
  }

  // 🔹 Preia anunțul curent
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_URL}/listings/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Eroare la încărcare");

        // ✅ compatibil cu ambele forme de răspuns: {ok, listing} sau direct obiectul listing
        const payload = data?.listing ? data.listing : data;

        setFormData({
          title: payload.title || "",
          description: payload.description || "",
          price: payload.price ?? "",
          category: payload.category || "",
          type: payload.intent || payload.type || "",            // ✅ NOU
          location: payload.location || "",
          phone: payload.phone || "",
          images: Array.isArray(payload.images) ? payload.images : [],
          isFree: payload.isFree ?? true,
        });

        // reset selecții noi
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

  // 🔹 Schimbare câmp text/select
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // 🔹 Adăugare poze noi (preview + FILE)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // dacă depășește limita, nu mai adăugăm
    const freeSlots = maxTotalImages - totalImagesCount;
    if (freeSlots <= 0) {
      alert(`Ai atins limita de ${maxTotalImages} imagini (${formData.isFree ? "FREE" : "PROMOVAT"}).`);
      e.target.value = "";
      return;
    }

    const accepted = files.slice(0, freeSlots);

    setNewImageFiles((prev) => [...prev, ...accepted]);

    accepted.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setNewImages((prev) => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  // 🔹 Înlocuire imagine existentă
  // - scoatem URL-ul vechi (nu îl mai păstrăm)
  // - adăugăm FILE nou + preview
  const replaceImage = (index, file) => {
    if (!file) return;

    // dacă nu mai avem loc, nu permitem
    if (totalImagesCount >= maxTotalImages) {
      alert(`Maxim ${maxTotalImages} imagini pentru acest tip de anunț.`);
      return;
    }

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
      const target = index + direction;
      if (target < 0 || target >= arr.length) return prev;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return { ...prev, images: arr };
    });
  };

  // 🔹 Salvare (FormData)
  const handleSave = async () => {
    try {
      if (!token || token === "undefined" || token === "null") {
        alert("Trebuie să fii logat ca să editezi anunțul.");
        navigate("/login");
        return;
      }

      // ✅ validare obligatorie
      const validationError = validateForm(formData);
      if (validationError) {
        alert("❌ " + validationError);
        return;
      }

      if (totalImagesCount > maxTotalImages) {
        alert(`Maxim ${maxTotalImages} imagini pentru acest tip de anunț.`);
        return;
      }

      setSaving(true);

      const fd = new FormData();
      fd.append("title", String(formData.title || "").trim());
      fd.append("description", String(formData.description || "").trim());
      fd.append("price", String(formData.price ?? ""));
      fd.append("category", String(formData.category || "").trim());
      fd.append("type", String(formData.type || "").trim()); // ✅ NOU
      fd.append("location", String(formData.location || "").trim());
      fd.append("phone", normalizePhone(formData.phone));

      // ✅ trimitem imaginile existente (cele păstrate)
      (formData.images || []).forEach((url) => fd.append("existingImages", url));

      // ✅ trimitem poze noi ca FILE (cheia "images")
      (newImageFiles || []).forEach((file) => fd.append("images", file));

      const res = await fetch(`${API_URL}/listings/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // NU pune Content-Type la FormData
        },
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare la salvare");

      alert("✅ Anunț actualizat cu succes!");
      navigate("/anunturile-mele");
    } catch (err) {
      alert("❌ " + (err.message || "Eroare la salvare"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center py-10">Se încarcă anunțul...</p>;
  if (error) return <p className="text-center py-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2 text-center">✏️ Editează Anunțul</h1>
      <p className="text-center text-sm text-gray-600 mb-6">
        Tip: <b>{formData.isFree ? "FREE (max 10 poze)" : "PROMOVAT (max 15 poze)"}</b>
      </p>

      <div className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Titlul anunțului"
          className="w-full border p-3 rounded"
          required
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
          placeholder="Preț (€) – opțional"
          className="w-full border p-3 rounded"
        />

        {/* ✅ Tip tranzacție (dropdown obligatoriu) */}
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        >
          <option value="">Alege tipul (Vând / Cumpăr / Închiriez / Schimb)</option>
          {TIPURI_TRANZACTIE.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        {/* ✅ Categorie (dropdown obligatoriu) */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        >
          <option value="">Alege categoria</option>
          {CATEGORII.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        {/* ✅ Localitate (dropdown obligatoriu) */}
        <select
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        >
          <option value="">Alege localitatea</option>
          {LOCATII.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Telefon"
          className="w-full border p-3 rounded"
          required
        />

        {/* 🖼️ Poze existente */}
        {formData.images?.length > 0 && (
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
                  <div className="absolute top-2 right-2 z-50 flex flex-col gap-2 opacity-100">
                    <button
  type="button"
  onClick={(e) => {
    e.stopPropagation();
    removeExistingImage(i);
  }}
  className="bg-red-600 text-white text-sm px-3 py-2 rounded-lg shadow"
>
  🗑️
</button>
                    <button
  type="button"
  onClick={(e) => {
    e.stopPropagation();
    moveImage(i, -1);
  }}
  className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow"
>
  ←
</button>

<button
  type="button"
  onClick={(e) => {
    e.stopPropagation();
    moveImage(i, 1);
  }}
  className="bg-gray-600 text-white text-xs px-2 py-1 rounded"
>
  →
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
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 py-3 rounded-lg font-medium"
          >
            {saving ? "Se salvează..." : "💾 Salvează modificările"}
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
