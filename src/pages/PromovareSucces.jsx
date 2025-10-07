// src/pages/PromovareSucces.jsx
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import API_URL from "../api";

export default function PromovareSucces() {
  const [sp] = useSearchParams();
  const [state, setState] = useState({ loading: true, ok: false, msg: "", data: null });

  useEffect(() => {
    const run = async () => {
      try {
        const session_id = sp.get("session_id");
        if (!session_id) {
          setState({ loading: false, ok: false, msg: "Lipsește session_id.", data: null });
          return;
        }
        const r = await fetch(`${API_URL}/stripe/confirm?session_id=${encodeURIComponent(session_id)}`);
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Eroare confirmare");
        setState({ loading: false, ok: true, msg: data.message || "Succes!", data });
      } catch (e) {
        setState({ loading: false, ok: false, msg: e.message, data: null });
      }
    };
    run();
  }, [sp]);

  if (state.loading) return <p className="text-center py-10">Confirmăm plata…</p>;

  return (
    <div className="max-w-xl mx-auto px-4 py-10 text-center">
      {state.ok ? (
        <>
          <h1 className="text-2xl font-bold text-emerald-700">Plata confirmată ✅</h1>
          <p className="mt-2">Anunțul tău a fost promovat.</p>
          {state.data?.featuredUntil && (
            <p className="mt-1 text-sm text-gray-600">
              Activ până la: {new Date(state.data.featuredUntil).toLocaleString("ro-RO")}
            </p>
          )}
          <div className="mt-6 flex justify-center gap-3">
            <Link to={`/anunt/${state.data?.listingId}`} className="px-4 py-2 rounded bg-blue-600 text-white">
              Vezi anunțul
            </Link>
            <Link to="/anunturile-mele" className="px-4 py-2 rounded border">Anunțurile mele</Link>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-red-600">Eroare</h1>
          <p className="mt-2">{state.msg}</p>
          <div className="mt-6">
            <Link to="/" className="px-4 py-2 rounded bg-gray-800 text-white">Înapoi acasă</Link>
          </div>
        </>
      )}
    </div>
  );
}
