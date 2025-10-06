import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import API_URL from "../api";

export default function VerificaEmail() {
  const loc = useLocation();
  const params = new URLSearchParams(loc.search);
  const initialToken = params.get("token") || "";

  const [token, setToken] = useState(initialToken);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(initialToken ? "loading" : "idle"); // idle | loading | success | error
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // dacă există ?token în URL -> verificăm automat
  useEffect(() => {
    const verify = async () => {
      if (!initialToken) return;
      setErr(""); setMsg(""); setStatus("loading");
      try {
        const r = await fetch(`${API_URL}/auth/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: initialToken }),
        });
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data?.error || "Eroare la verificare");
        setStatus("success");
        setMsg("Email confirmat cu succes. Te poți autentifica.");
      } catch (e) {
        setStatus("error");
        setErr(e.message);
      }
    };
    verify();
  }, [initialToken]);

  const manualVerify = async (e) => {
    e.preventDefault();
    setErr(""); setMsg(""); setStatus("loading");
    try {
      const r = await fetch(`${API_URL}/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error || "Eroare la verificare");
      setStatus("success");
      setMsg("Email confirmat cu succes. Te poți autentifica.");
    } catch (e) {
      setStatus("error");
      setErr(e.message);
    }
  };

  const resend = async () => {
    setErr(""); setMsg("");
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

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Confirmare email</h1>

      {msg && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">{msg}</div>}
      {err && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{err}</div>}

      {/* Dacă avem token în URL și e în lucru */}
      {status === "loading" && <p>Se verifică tokenul...</p>}

      {/* Succes */}
      {status === "success" && (
        <div className="space-y-4 bg-white rounded-xl shadow p-5">
          <p>Contul tău a fost verificat.</p>
          <Link
            to="/login"
            className="inline-block bg-blue-600 text-white px-5 py-2 rounded font-semibold hover:bg-blue-700"
          >
            Mergi la autentificare
          </Link>
        </div>
      )}

      {/* Form pentru verificare manuală, dacă nu a venit token în URL sau a eșuat */}
      {(status === "idle" || status === "error") && (
        <div className="space-y-6">
          <form onSubmit={manualVerify} className="space-y-4 bg-white rounded-xl shadow p-5">
            <div>
              <label className="block text-sm font-medium mb-1">Token din email</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Lipește aici tokenul"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-600 text-white px-5 py-2 rounded font-semibold hover:bg-emerald-700 w-full"
            >
              Verifică tokenul
            </button>
          </form>

          <div className="bg-white rounded-xl shadow p-5 space-y-3">
            <p className="text-sm text-gray-700">Nu găsești emailul? Retrimitem linkul de confirmare.</p>
            <div className="flex gap-2">
              <input
                type="email"
                className="flex-1 border rounded px-3 py-2"
                placeholder="adresa ta de email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="button"
                onClick={resend}
                className="bg-indigo-600 text-white px-4 py-2 rounded font-semibold hover:bg-indigo-700"
              >
                Retrimite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
