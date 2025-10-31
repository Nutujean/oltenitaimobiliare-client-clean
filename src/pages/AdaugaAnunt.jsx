import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdaugaAnunt = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    titlu: "",
    descriere: "",
    pret: "",
    localitate: "",
    suprafata: "",
    categorie: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Dacă nu e logat, redirecționăm
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // ✅ Localitățile permise (zona Oltenița)
  const localitati = [
    "Oltenița",
    "Chirnogi",
    "Curcani",
    "Spanțov",
    "Radovanu",
    "Ulmeni",
    "Chiselet",
    "Mitreni",
    "Clatesti",
    "Cascioarele",
    "Valea Rosie",
    "Soldanu",
    "Nana",
    "Luica",
    "Negoiesti",
    "Budesti",
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.titlu || !form.localitate) {
      setMessage("⚠️ Completează toate câmpurile obligatorii!");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post(
        "https://api.oltenitaimobiliare.ro/api/listings",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data && res.data._id) {
        setMessage("✅ Anunț adăugat cu succes!");
        setTimeout(() => navigate("/anunturile-mele"), 1500);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Eroare la adăugarea anunțului.");
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
          <span>🔑 Ești logat ca: <strong>{user.phone || "Utilizator"}</strong></span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6 text-gray-800">Adaugă un anunț nou</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-md rounded-xl p-6 border border-gray-100">
        <input
          type="text"
          name="titlu"
          placeholder="Titlul anunțului"
          value={form.titlu}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <textarea
          name="descriere"
          placeholder="Descriere"
          value={form.descriere}
          onChange={handleChange}
          rows="4"
          className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <input
          type="number"
          name="pret"
          placeholder="Preț (EUR)"
          value={form.pret}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {/* 🔹 Localitate — doar din lista Oltenița și împrejurimi */}
        <select
          name="localitate"
          value={form.localitate}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-500 outline-none"
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
          className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <input
          type="text"
          name="categorie"
          placeholder="Categorie (casă, teren, etc.)"
          value={form.categorie}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />

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
