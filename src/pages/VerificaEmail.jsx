// src/pages/VerificaEmail.jsx
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import API_URL from "../api";

export default function VerificaEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Lipsește token-ul de verificare din link.");
      return;
    }

    const run = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/verify-email?token=${encodeURIComponent(token)}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || `Eroare HTTP ${res.status}`);
        }
        setStatus("success");
        setMessage("Email verificat cu succes! Te poți autentifica acum.");
      } catch (err) {
        setStatus("error");
        setMessage(err.message || "Eroare la verificarea emailului.");
      }
    };
    run();
  }, [searchParams]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow p-6 text-center">
        {status === "loading" && (
          <>
            <h1 className="text-xl font-semibold mb-2">Se verifică emailul...</h1>
            <p className="text-gray-600">Te rugăm așteaptă câteva secunde.</p>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold text-green-700 mb-3">Gata! ✅</h1>
            <p className="text-gray-700 mb-6">{message}</p>
            <Link
              to="/login"
              className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              Mergi la autentificare
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold text-red-700 mb-3">Ups!</h1>
            <p className="text-gray-700 mb-6">{message}</p>
            <div className="flex gap-3 justify-center">
              <Link
                to="/login"
                className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700"
              >
                Înapoi la login
              </Link>
              <Link
                to="/"
                className="inline-block bg-gray-100 text-gray-800 px-5 py-2 rounded-lg font-semibold hover:bg-gray-200"
              >
                Acasă
              </Link>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Dacă token-ul a expirat, poți cere retrimiterea din pagina de Login.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
