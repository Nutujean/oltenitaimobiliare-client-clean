import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API_URL from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const next = params.get("next") || "/anunturile-mele"; // ✅ după login mergem direct la Anunțurile Mele

  // 🔹 retrimite email de verificare
  const handleResendVerification = async () => {
    setErr("");
    setMsg("");
    try {
      const r = await fetch(`${API_URL}/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error || "Eroare la retrimiterea emailului");
      setMsg("Ți-am trimis din nou emailul de confirmare.");
    } catch (e) {
      setErr(e.message);
    }
  };

  // 🔹 autentificare utilizator
  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    setLoading(true);

    try {
      const r = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await r.json().catch(() => ({}));

      if (!r.ok) {
        if (r.status === 403 || /verific/i.test(data?.error || "")) {
          setErr("Contul nu este verificat. Verifică emailul sau retrimite linkul de confirmare.");
        } else {
          setErr(data?.error || "Email sau parolă greșite");
        }
        return;
      }

      // ✅ salvăm token + user în localStorage
      if (data?.token) localStorage.setItem("token", data.token);
      if (data?.user) localStorage.setItem("userInfo", JSON.stringify(data.user));

      // ✅ redirecționăm după login
      navigate(next, { replace: true });
    } catch (e) {
      setErr("Eroare la autentificare. Încearcă din nou.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Autentificare</h1>

      {msg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {msg}
        </div>
      )}
      {err && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {err}
          {/verific/i.test(err) && (
            <div className="mt-2">
              <button
                onClick={handleResendVerification}
                type="button"
                className="text-blue-600 hover:underline"
                title="Retrimite emailul de confirmare"
              >
                Retrimite emailul de confirmare
              </button>
            </div>
          )}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4 bg-white rounded-xl shadow p-5">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            placeholder="adresa@exemplu.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Parolă</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              className="w-full border rounded px-3 py-2 pr-10"
              placeholder="parola"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600"
              aria-label={showPass ? "Ascunde parola" : "Arată parola"}
            >
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-60 w-full"
        >
          {loading ? "Se autentifică..." : "Intră în cont"}
        </button>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Ai uitat parola?
          </Link>
          <Link to="/register" className="text-blue-600 hover:underline">
            Creează un cont nou
          </Link>
        </div>
      </form>
    </div>
  );
}
