import { useState } from "react";
import API_URL from "../api";

export default function AdaugaAnunt() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("apartamente");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          price,
          category,
          location,   // 👈 locația adăugată
          imageUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare la salvare");

      alert("✅ Anunț adăugat cu succes!");
      window.location.href = "/";
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 space-y-4 bg-white shadow rounded"
    >
      <h1 className="text-2xl font-bold mb-4">Adaugă un anunț</h1>

      <input
        type="text"
        placeholder="Titlu"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <textarea
        placeholder="Descriere"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-2 rounded"
        rows="4"
        required
      />

      <input
        type="number"
        placeholder="Preț (€)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="apartamente">Apartamente</option>
        <option value="case">Case</option>
        <option value="terenuri">Terenuri</option>
        <option value="garsoniere">Garsoniere</option>
        <option value="garaje">Garaje</option>
        <option value="spatiu-comercial">Spațiu comercial</option>
      </select>

      <input
        type="text"
        placeholder="Locație"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="text"
        placeholder="URL Imagine (Cloudinary)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Se încarcă..." : "Adaugă Anunț"}
      </button>
    </form>
  );
}
