import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../api";
import ImageReorder from "../components/ImageReorder";

const MAX_IMAGES = 15;

const CATEGORIES = ["Apartamente","Case","Terenuri","Garsoniere","Garaje","Spațiu comercial"];
const LOCATII = ["Oltenita","Chirnogi","Ulmeni","Mitreni","Clatesti","Spantov","Cascioarele","Soldanu","Negoiesti","Valea Rosie","Radovanu","Chiselet","Manastirea","Budesti"];

export default function AdaugaAnunt() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [imgInput, setImgInput] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
    images: [],
    contactPhone: "",
    status: "disponibil",
    transactionType: "vanzare", // 👈 nou
  });

  const addImageUrl = () => {
    const url = imgInput.trim();
    if (!url) return;
    setForm((prev) => {
      const current = Array.isArray(prev.images) ? prev.images : [];
      if (current.length >= MAX_IMAGES) {
        alert(`Poți adăuga maximum ${MAX_IMAGES} imagini.`);
        return prev;
      }
      return { ...prev, images: [...current, url].slice(0, MAX_IMAGES) };
    });
    setImgInput("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");

    const payload = {
      ...form,
      price: Number(form.price) || 0,
      images: (form.images || []).filter(Boolean).slice(0, MAX_IMAGES),
      transactionType: form.transactionType || "vanzare",
    };

    try {
      const r = await fetch(`${API_URL}/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error || "Eroare la crearea anunțului");

      navigate(`/anunt/${data._id}`, { replace: true });
    } catch (e) {
      setError(e.message || "Eroare necunoscută");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Adaugă anunț</h1>
        <Link to="/anunturile-mele" className="text-blue-600 hover:underline">Anunțurile mele</Link>
      </div>

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
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descriere</label>
          <textarea
            className="w-full border rounded px-3 py-2 min-h-[120px]"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Preț (€)</label>
            <input
              type="number"
              min="0"
              className="w-full border rounded px-3 py-2"
              value={form.price}
              onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tip tranzacție</label>
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="transactionType"
                  value="vanzare"
                  checked={(form.transactionType || "vanzare") === "vanzare"}
                  onChange={(e) => setForm((p) => ({ ...p, transactionType: e.target.value }))}
                />
                <span>De vânzare</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="transactionType"
                  value="inchiriere"
                  checked={form.transactionType === "inchiriere"}
                  onChange={(e) => setForm((p) => ({ ...p, transactionType: e.target.value }))}
                />
                <span>De închiriat</span>
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Categorie</label>
            <select
              className="w-full border rounded px-3 py-2 bg-white"
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              required
            >
              <option value="">Alege...</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Locație</label>
            <select
              className="w-full border rounded px-3 py-2 bg-white"
              value={form.location}
              onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
              required
            >
              <option value="">Alege...</option>
              {LOCATII.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Telefon contact</label>
          <input
            type="tel"
            className="w-full border rounded px-3 py-2"
            value={form.contactPhone}
            onChange={(e) => setForm((p) => ({ ...p, contactPhone: e.target.value }))}
          />
        </div>

        {/* Imagini */}
        <div className="border rounded-lg p-4">
          <div className="flex items-end gap-2 mb-3">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">URL imagine (Cloudinary)</label>
              <input
                type="url"
                className="w-full border rounded px-3 py-2"
                placeholder="https://res.cloudinary.com/.../image/upload/..."
                value={imgInput}
                onChange={(e) => setImgInput(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={addImageUrl}
              disabled={(form.images?.length || 0) >= MAX_IMAGES}
              className={`px-4 py-2 rounded ${ (form.images?.length || 0) >= MAX_IMAGES ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
            >
              Adaugă
            </button>
          </div>

          <ImageReorder
            images={form.images || []}
            setImages={(imgs) => setForm((prev) => ({ ...prev, images: imgs.slice(0, MAX_IMAGES) }))}
            max={MAX_IMAGES}
          />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Salvează anunțul
          </button>
          <Link to="/" className="px-4 py-2 rounded border hover:bg-gray-50">Renunță</Link>
        </div>
      </form>
    </div>
  );
}
