import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../api";

const CATEGORIES = [
  "Apartamente",
  "Garsoniere",
  "Case",
  "Terenuri",
  "Garaje",
  "Spațiu comercial",
];

const LOCATII = [
  "Oltenita","Chirnogi","Ulmeni","Mitreni","Clatesti","Spantov","Cascioarele",
  "Soldanu","Negoiesti","Valea Rosie","Radovanu","Chiselet","Manastirea","Budesti",
];

export default function AdaugaAnunt() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");

  // 🔹 câmpuri noi
  const [floor, setFloor] = useState("");
  const [surface, setSurface] = useState("");
  const [rooms, setRooms] = useState("");

  // simplu: lipim URL-urile imaginilor (Cloudinary) pe linii separate
  const [imagesText, setImagesText] = useState("");

  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toNumberOrEmpty = (v) => {
    if (v === "" || v === null || v === undefined) return "";
    const n = Number(String(v).replace(",", "."));
    return Number.isFinite(n) ? n : "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setOk("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Trebuie să fii autentificat.");

      const imgs = imagesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        title: title.trim(),
        description: description.trim(),
        location,
        category,
        phone: phone.trim(),
        images: imgs,
        // 🔹 numeric sanitize & includem doar dacă au valoare
        price: price !== "" ? Number(String(price).replace(",", ".")) : undefined,
        floor: floor !== "" ? Number(floor) : undefined,
        surface: surface !== "" ? Number(String(surface).replace(",", ".")) : undefined,
        rooms: rooms !== "" ? Number(rooms) : undefined,
      };

      const r = await fetch(`${API_URL}/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        throw new Error(data?.error || "Eroare la crearea anunțului");
      }

      setOk("Anunț creat cu succes!");
      // mergem la anunțurile mele
      navigate("/anunturile-mele");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Adaugă anunț</h1>
        <Link to="/anunturile-mele" className="text-blue-600 hover:underline">
          Anunțurile mele
        </Link>
      </div>

      {err && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {err}
        </div>
      )}
      {ok && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {ok}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5 bg-white rounded-xl shadow p-5">
        <div>
          <label className="block text-sm font-medium mb-1">Titlu</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Categorie</label>
            <select
              className="w-full border rounded px-3 py-2 bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            >
              <option value="">Alege...</option>
              {LOCATII.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Preț (€)</label>
            <input
              type="text"
              inputMode="decimal"
              className="w-full border rounded px-3 py-2"
              placeholder="ex: 60000 sau 2,5"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              onBlur={() => setPrice(toNumberOrEmpty(price))}
            />
          </div>
        </div>

        {/* 🔹 doar pentru Apartamente / Garsoniere afișăm etaj/suprafață/camere */}
        {["Apartamente", "Garsoniere"].includes(category) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Etaj</label>
              <select
                className="w-full border rounded px-3 py-2 bg-white"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
              >
                <option value="">—</option>
                <option value="0">Parter</option>
                {Array.from({ length: 20 }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Suprafață (mp)</label>
              <input
                type="text"
                inputMode="decimal"
                className="w-full border rounded px-3 py-2"
                placeholder="ex: 52.5"
                value={surface}
                onChange={(e) => setSurface(e.target.value)}
                onBlur={() => setSurface(toNumberOrEmpty(surface))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Camere</label>
              <input
                type="number"
                min="1"
                max="10"
                className="w-full border rounded px-3 py-2"
                placeholder="ex: 2"
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Telefon</label>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="ex: 07xxxxxxxx"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Imagini (URL pe fiecare linie)</label>
          <textarea
            rows={5}
            className="w-full border rounded px-3 py-2"
            placeholder="https://res.cloudinary.com/.../img1.jpg
https://res.cloudinary.com/.../img2.jpg"
            value={imagesText}
            onChange={(e) => setImagesText(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            Poți lipi linkuri Cloudinary; prima imagine devine coperta.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-5 py-2 rounded font-semibold hover:bg-green-700 disabled:opacity-60"
        >
          {loading ? "Se salvează..." : "Publică anunțul"}
        </button>
      </form>
    </div>
  );
}
