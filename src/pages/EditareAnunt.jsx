import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API_URL from "../api";
import ImageReorder from "../components/ImageReorder.jsx";

const CATEGORIES = [
  "Apartamente",
  "Case",
  "Terenuri",
  "Garsoniere",
  "Garaje",
  "Spațiu comercial",
];

const LOCATII = [
  "Oltenita",
  "Chirnogi",
  "Ulmeni",
  "Mitreni",
  "Clatesti",
  "Spantov",
  "Cascioarele",
  "Soldanu",
  "Negoiesti",
  "Valea Rosie",
  "Radovanu",
  "Chiselet",
  "Manastirea",
  "Budesti",
];

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function EditareAnunt() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    (async () => {
      try {
        setError("");
        const r = await fetch(`${API_URL}/listings/${id}`);
        if (!r.ok) throw new Error("Nu am găsit anunțul.");
        const data = await r.json();
        setTitle(data.title || "");
        setDescription(data.description || "");
        setPrice(data.price ?? "");
        setCategory(data.category || "");
        setLocation(data.location || "");
        setPhone(data.phone || "");
        setImages(Array.isArray(data.images) ? data.images : (data.imageUrl ? [data.imageUrl] : []));
      } catch (e) {
        setError(e.message || "Eroare la încărcarea anunțului.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function uploadToCloudinary(file) {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error("Cloudinary nu este configurat (VITE_CLOUDINARY_* lipsesc).");
    }
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", UPLOAD_PRESET);
    const r = await fetch(url, { method: "POST", body: fd });
    if (!r.ok) throw new Error("Upload eșuat");
    const data = await r.json();
    return data.secure_url;
  }

  const onSelectFiles = async (e) => {
    try {
      setError("");
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;
      setUploading(true);
      const uploadedUrls = [];
      for (const f of files) {
        const url = await uploadToCloudinary(f);
        uploadedUrls.push(url);
      }
      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      console.error(err);
      setError(err.message || "Eroare la upload.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");

      if (!token) {
        setError("Trebuie să fii autentificat pentru a edita.");
        return;
      }
      const priceNumber = Number(price);
      if (Number.isNaN(priceNumber) || priceNumber < 0) {
        setError("Preț invalid.");
        return;
      }

      const payload = {
        title: title.trim(),
        description,
        price: priceNumber,
        category,
        location,
        images,
        imageUrl: images[0] || "",
        phone: phone ? String(phone) : undefined,
      };

      const r = await fetch(`${API_URL}/listings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await r.json();
      if (!r.ok) {
        const details = data?.details ? ` (${JSON.stringify(data.details)})` : "";
        throw new Error((data?.error || "Eroare la actualizare") + details);
      }

      navigate(`/anunt/${id}`);
    } catch (err) {
      console.error(err);
      setError(err.message || "Eroare necunoscută");
    }
  };

  if (loading) return <p className="text-center py-10">Se încarcă...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Editează anunț</h1>

      {error && (
        <div className="mb-4 bg-red-50 text-red-700 border border-red-200 px-3 py-2 rounded">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Titlu</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descriere</label>
          <textarea
            className="w-full border rounded px-3 py-2 min-h-[120px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Preț (€)</label>
            <input
              type="number"
              min="0"
              className="w-full border rounded px-3 py-2"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Categorie</label>
            <select
              className="w-full border rounded px-3 py-2 bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Alege categoria</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Locație</label>
            <select
              className="w-full border rounded px-3 py-2 bg-white"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            >
              <option value="">Alege locația</option>
              {LOCATII.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Telefon (opțional) */}
        <div>
          <label className="block text-sm font-medium mb-1">Telefon (opțional)</label>
          <input
            type="tel"
            className="w-full border rounded px-3 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {/* Upload + Reorder */}
        <div>
          <label className="block text-sm font-medium mb-1">Imagini</label>
          <input type="file" accept="image/*" multiple onChange={onSelectFiles} />
          {uploading && <p className="text-sm text-gray-600 mt-2">Se încarcă imaginile...</p>}
          <ImageReorder images={images} setImages={setImages} title="Ordine imagini" />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {uploading ? "Așteaptă upload..." : "Salvează modificările"}
          </button>
        </div>
      </form>
    </div>
  );
}
