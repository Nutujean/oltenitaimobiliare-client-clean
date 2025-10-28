import { useState } from "react";

export default function Register() {
  console.log("🟢 Componenta Register s-a încărcat!");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert("🟢 handleSubmit pornit!");
    console.log("✅ handleSubmit pornit:", formData);

    setError("");
    setMsg("");
    setLoading(true);

    try {
  const API_BASE =
    import.meta.env.VITE_API_URL || "https://api.oltenitaimobiliare.ro/api";

  const f = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const m = await f.json();
  if (!f.ok) throw new Error(m.message || "Eroare la înregistrare");

  setMsg("✅ Cod SMS trimis! Verifică telefonul pentru a-ți activa contul.");
  setTimeout(() => (window.location.href = "/verifica-cod"), 2000);
} catch (err) {
  setError(err.message || "Eroare server. Încearcă din nou.");
} finally {
  setLoading(false);
}
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Creează un cont</h1>

      {msg && (
        <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded mb-4">
          {msg}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-5 rounded shadow"
      >
        <input
          type="text"
          name="name"
          placeholder="Nume (opțional)"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="tel"
          name="phone"
          placeholder="Telefon (07xxxxxxxx)"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Parolă"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          {loading ? "Se trimite codul..." : "Înregistrează-te"}
        </button>
      </form>
    </div>
  );
}
