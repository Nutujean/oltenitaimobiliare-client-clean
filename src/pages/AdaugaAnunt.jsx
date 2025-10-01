import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";
import ImageUploader from "../components/ImageUploader";

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

const CATEGORII = [
  "Apartamente",
  "Case",
  "Terenuri",
  "Garsoniere",
  "Garaje",
  "Spațiu comercial",
];

export default function AdaugaAnunt() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState([]); // URL-uri Cloudinary
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Precompletăm telefonul din profil
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((me) => {
        if (me?.phone && !phone) setPhone(me.phone);
      })
      .catch(() => {});
  }, []); // o singură dată

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Trebuie să fii autentificat pentru a adăuga un anunț.");

      if (!images || images.length === 0) {
        throw new Error("Te rugăm să încarci cel puțin o fotografie.");
      }
      if (!location) {
        throw new Error("Te rugăm să alegi o locație.");
      }
      if (!category) {
        throw new Error("Te rugăm să alegi o categorie.");
      }

      const payload = {
        title,
        description,
        price: Number(price),
        category,
        location,
        images, // array de URL-uri Cloudinary
        phone,  // dacă e gol, backend îl completează din profil (fallback)
      };

      const r = await fetch(`${API_URL}/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!r.ok) {
        const t = await r.text();
        throw new Error(`Eroare la salvare (${r.status}): ${t}`);
      }

      const data = await r.json();
      navigate(`/anunt/${data._id}`);
    } catch (e) {
      setErr(e.message || "Eroare necunoscută");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Adaugă anunț</h1>

      {err && <p className="mb-4 text-red-600">❌ {err}</p>}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Titlu</label>
          <input
            className="w-full border rounded-lg px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Descriere</label>
          <textarea
            className="w-full border rounded-lg px-3 py-2 min-h-[120px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-medium">Preț (€)</label>
            <input
              type="number"
              min="0"
              className="w-full border rounded-lg px-3 py-2"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Categorie</label>
            <select
              className="w-full border rounded-lg px-3 py-2 bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Alege categoria</option>
              {CATEGORII.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Locație</label>
            <select
              className="w-full border rounded-lg px-3 py-2 bg-white"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            >
              <option value="">Alege locația</option>
              {LOCATII.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Upload imagini în Cloudinary */}
        <ImageUploader value={images} onChange={setImages} max={12} />

        <div>
          <label className="block mb-1 font-medium">Telefon de contact</label>
          <input
            className="w-full border rounded-lg px-3 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="07xx xxx xxx"
          />
          <p className="text-sm text-gray-500 mt-1">
            Implicit se folosește telefonul din profil; îl poți schimba pentru acest anunț.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-60"
          >
            {loading ? "Se încarcă..." : "Publică anunțul"}
          </button>
        </div>
      </form>
    </div>
  );
}
