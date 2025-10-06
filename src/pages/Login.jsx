import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        throw new Error(data?.error || "Eroare la autentificare");
      }
      // salvăm tokenul
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
      // optional păstrăm user
      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      navigate("/profil");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Autentificare</h1>

      {err && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {err}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="email"
          className="w-full border rounded px-3 py-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          placeholder="Parolă"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Se autentifică..." : "Intră în cont"}
        </button>
      </form>

      <p className="text-sm text-gray-600 mt-4">
        Nu ai cont?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Creează cont
        </Link>
      </p>
    </div>
  );
}
