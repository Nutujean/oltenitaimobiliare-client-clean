import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import API_URL from "../api";

export default function ResetPassword() {
  const loc = useLocation();
  const nav = useNavigate();
  const params = new URLSearchParams(loc.search);
  const initialToken = params.get("token") || "";

  const [token, setToken] = useState(initialToken);
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [valid, setValid] = useState(initialToken ? null : false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const check = async () => {
      if (!token) { setValid(false); return; }
      try {
        const r = await fetch(`${API_URL}/auth/check-reset-token?token=${encodeURIComponent(token)}`);
        setValid(r.ok);
      } catch {
        setValid(false);
      }
    };
    check();
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setMsg("");
    if (pass1.length < 6) return setErr("Parola trebuie să aibă minim 6 caractere.");
    if (pass1 !== pass2) return setErr("Parolele nu coincid.");

    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: pass1 }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error || "Eroare la resetarea parolei");

      setMsg("Parola a fost schimbată. Te poți autentifica acum.");
      setTimeout(() => nav("/login"), 1500);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Resetează parola</h1>

      {msg && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">{msg}</div>}
      {err && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{err}</div>}

      <form onSubmit={submit} className="space-y-4 bg-white rounded-xl shadow p-5">
        {!initialToken && (
          <div>
            <label className="block text-sm font-medium mb-1">Token din email</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>
        )}

        {valid === false && (
          <div className="text-sm text-red-600">
            Token invalid sau expirat. <Link to="/forgot-password" className="text-blue-600 hover:underline">Trimite alt link</Link>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Parola nouă</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={pass1}
            onChange={(e) => setPass1(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Confirmă parola</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={pass2}
            onChange={(e) => setPass2(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading || valid === false}
          className="bg-blue-600 text-white px-5 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-60 w-full"
        >
          {loading ? "Se salvează..." : "Schimbă parola"}
        </button>

        <div className="text-sm text-gray-600">
          <Link to="/login" className="text-blue-600 hover:underline">Înapoi la autentificare</Link>
        </div>
      </form>
    </div>
  );
}
