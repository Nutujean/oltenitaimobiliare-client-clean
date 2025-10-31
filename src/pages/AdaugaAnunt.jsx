import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdaugaAnunt = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    descriere: "",
    pret: "",
    localitate: "",
    suprafata: "",
    categorie: "",
    imagini: [],
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔒 Dacă nu e logat, redirecționează
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // ✅ Localitățile permise
  const localitati = [
    "Oltenița",
    "Chirnogi",
    "Curcani",
    "Spanțov",
    "Radovanu",
    "Ulmeni",
    "Clatesti",
    "Negoiesti",
    "Soldanu",
    "Luica",
    "Nana",
    "Chiselet",
    "Căscioarele",
    "Manastirea",
    "Valea Roșie",
    "Mitreni",
    "Călărași",
  ];

  // ✅ Categorii — dropdown simplu
  const categoriiOptiuni = [
    "Apartamente",
    "Garsoniere",
    "Case",
    "Terenuri",
    "Spatii comerciale",
    "Garaje",
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🖼️ Upload imagini
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setLoading(true);
      const uploaded = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "oltenita_imobiliare");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/oltenitaimobiliare/image/upload",
          { method: "POST", body: formData }
        );

        const data = await res.json();
        uploaded.push(data.secure_url);
      }

      setForm((prev) => ({
        ...prev,
        imagini: [...prev.imagini, ...uploaded],
      }));
    } catch (err) {
      console.error("❌ Upload error:", err);
      setMessage("Eroare la încărcarea imaginilor.");
    } finally {
      setLoading(false);
    }
  };

  // 📤 Submit anunț
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.categorie || !form.localitate) {
      setMessage("⚠️ Completează toate câmpurile obligatorii!");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const payload = {
        ...form,
        user: user?._id || undefined,
      };

      const res = await axios.post(
        "https://api.oltenitaimobiliare.ro/api/listings",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data && res.data._id) {
        setMessage("✅ Anunț adăugat cu succes!");
        setTimeout(() => navigate("/anunturile-mele"), 1500);
      } else {
        setMessage("❌ Eroare la adăugarea anunțului.");
      }
    } catch (err) {
      console.error("❌ Backend error:", err.response?.data || err.message);
      setMessage("❌ Eroare la adăugarea anunțului (verifică backend-ul).");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* ✅ Banner user logat */}
      {user && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
          <span>
            🔑 Ești logat ca: <strong>{user.phone}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Adaugă un anunț nou
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white shadow-md rounded-xl p-6 border border-gray-100"
      >
        <input
          type="text"
          name="title"
          placeholder="Titlul anunțului"
          value={form.titlu}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg w-full p-3"
        />

        <textarea
          name="descriere"
          placeholder="Descriere"
          value={form.descriere}
          onChange={handleChange}
          rows="4"
          className="border border-gray-300 rounded-lg w-full p-3"
        />

        <input
          type="number"
          name="pret"
          placeholder="Preț (EUR)"
          value={form.pret}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg w-full p-3"
        />

        <select
          name="localitate"
          value={form.localitate}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg w-full p-3"
        >
          <option value="">Selectează localitatea</option>
          {localitati.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="suprafata"
          placeholder="Suprafață (mp)"
          value={form.suprafata}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg w-full p-3"
        />

        {/* ✅ Dropdown categorie */}
        <select
          name="categorie"
          value={form.categorie}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg w-full p-3"
        >
          <option value="">Selectează categoria</option>
          {categoriiOptiuni.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* 🖼️ Upload imagini */}
        <div>
          <p className="font-semibold text-gray-700 mb-2">Imagini:</p>
          <input type="file" multiple onChange={handleImageUpload} />
          <div className="mt-3 grid grid-cols-3 gap-2">
            {form.imagini.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt="preview"
                className="rounded-lg border h-24 w-full object-cover"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white font-semibold px-5 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Se adaugă..." : "Adaugă anunț"}
        </button>

        {message && (
          <p className="mt-4 text-center text-gray-700 whitespace-pre-line">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default AdaugaAnunt;
