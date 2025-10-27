import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

export default function VerificaCod() {
  const nav = useNavigate();

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Trimite codul pentru verificare
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    setLoading(true);

    try {
      const r = await fetch(`${API_URL}/auth/verify-sms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });

      const data = await r.json();
      if (r.ok) {
        setMsg("✅ " + data.message);
        setTimeout(() => nav("/adauga-anunt"), 1500);
      } else {
        setErr(data.message || "Cod incorect sau expirat.");
      }
    } catch (error) {
      setErr("Eroare la conexiune cu serverul.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Re-trimite codul SMS
  const handleResend = async () => {
    setMsg("");
    setErr("");
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/auth/resend-sms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await r.json();
      if (r.ok) setMsg("📩 " + data.message);
      else setErr(data.message || "Eroare la retrimitere cod.");
    } catch (error) {
      setErr("Eroare server la retrimiterea SMS-ului.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
        Verifică numărul de telefon
      </h1>

      {msg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {msg}
        </div>
      )}
      {err && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {err}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white rounded-xl shadow p-5"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Telefon</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="07xxxxxxxx"
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cod SMS</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Codul de 6 cifre"
              maxLength={6}
              className="w-full border rounded px-3 py-2"
              required
            />
            <button
              type="button"
              onClick={handleResend}
              className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-2 rounded"
              disabled={loading}
            >
              Retrimite
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-semibold w-full"
        >
          {loading ? "Se verifică..." : "Verifică"}
        </button>

        <div className="text-sm text-gray-600 text-center mt-2">
          <a href="/login" className="text-blue-600 hover:underline">
            Ai deja cont? Autentifică-te
          </a>
        </div>
      </form>
    </div>
  );
}
