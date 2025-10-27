import { useState } from "react";

export default function VerificaCod() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/verify-sms`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, code }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Cod invalid sau expirat.");

      setMsg("✅ Cont verificat cu succes! Poți adăuga acum un anunț.");
      setTimeout(() => (window.location.href = "/adauga-anunt"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Verifică-ți contul</h1>

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

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-5 rounded shadow">
        <input
          type="tel"
          placeholder="Număr de telefon"
          className="w-full border p-2 rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Cod primit prin SMS"
          className="w-full border p-2 rounded"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Se verifică..." : "Verifică codul"}
        </button>
      </form>
    </div>
  );
}
