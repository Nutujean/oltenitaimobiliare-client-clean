import { useState } from "react";
import API_URL from "../api";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setMsg(""); setLoading(true);
    try {
      await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setMsg("Dacă există un cont cu acest email, vei primi un link de resetare în câteva momente.");
    } catch (e) {
      setErr("Eroare la trimiterea emailului.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Ai uitat parola?</h1>

      {msg && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">{msg}</div>}
      {err && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{err}</div>}

      <form onSubmit={submit} className="space-y-4 bg-white rounded-xl shadow p-5">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
        <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-60 w-full"
        >
          {loading ? "Se trimite..." : "Trimite link de resetare"}
        </button>

        <div className="text-sm text-gray-600">
          <Link to="/login" className="text-blue-600 hover:underline">Înapoi la autentificare</Link>
        </div>
      </form>
    </div>
  );
}
