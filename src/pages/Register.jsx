import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Eroare la înregistrare");
      }

      // ✅ mesaj confirmare + redirect către /verifica-cod
      setMsg("📩 Codul de verificare a fost trimis pe telefonul tău.");
      setTimeout(() => {
        nav("/verifica-cod");
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
        Înregistrare
      </h1>

      {msg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {msg}
        </div>
      )}
      {error && (
        <p className="text-red-500 mb-4 text-center font-medium">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow rounded-xl p-5">
        <input
          type="text"
          name="name"
          placeholder="Nume complet"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Telefon (07xxxxxxxx)"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
          pattern="^0[0-9]{9}$"
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
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold disabled:opacity-70"
        >
          {loading ? "Se trimite codul..." : "Înregistrează-te"}
        </button>
      </form>
    </div>
  );
}
