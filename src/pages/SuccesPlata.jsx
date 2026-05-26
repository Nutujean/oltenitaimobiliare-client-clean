import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "https://api.oltenitaimobiliare.ro";

export default function SuccesPlata() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Se confirmă plata...");
  const [error, setError] = useState("");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      setError("Lipsește session_id din URL.");
      setLoading(false);
      return;
    }

    async function confirmPayment() {
      try {
        const res = await fetch(
          ${API_URL}/api/stripe/confirm?session_id=${encodeURIComponent(sessionId)}
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Eroare la confirmarea plății.");
        }

        setMessage(data?.message || "Plata confirmată. Anunțul a fost promovat.");
      } catch (err) {
        setError(err.message || "Eroare la confirmarea plății.");
      } finally {
        setLoading(false);
      }
    }

    confirmPayment();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 shadow-md max-w-md">
        <div className="text-5xl mb-4">{error ? "⚠️" : "✅"}</div>

        <h1 className="text-2xl font-bold text-green-700 mb-2">
          {loading ? "Se confirmă plata..." : error ? "Atenție" : "Plata confirmată!"}
        </h1>

        <p className="text-gray-700 mb-6 leading-relaxed">
          {loading ? "Te rugăm așteaptă câteva secunde." : error || message}
        </p>

        <button
          onClick={() => navigate("/anunturile-mele")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
        >
          🔙 Înapoi la anunțurile mele
        </button>
      </div>
    </div>
  );
}