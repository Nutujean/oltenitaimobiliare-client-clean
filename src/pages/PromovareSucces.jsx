import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import API_URL from "../api";

export default function PromovareSucces() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const confirmPayment = async () => {
      if (!sessionId) {
        setStatus("error");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/stripe/confirm?session_id=${sessionId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Eroare la confirmarea plății");

        setDetails(data);
        setStatus("success");
      } catch (err) {
        console.error("❌ Eroare confirmare plată:", err);
        setStatus("error");
      }
    };

    confirmPayment();
  }, [sessionId]);

  // ✅ redirect automat către pagina potrivită
  useEffect(() => {
    if (status !== "success" || !details) return;

    const isJob = details.plan === "job30";
    const t = setTimeout(() => {
      navigate(isJob ? "/angajari" : "/anunturile-mele", { replace: true });
    }, 1500);

    return () => clearTimeout(t);
  }, [status, details, navigate]);

  if (status === "loading") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-gray-600">
        <p className="text-lg animate-pulse">⏳ Se confirmă plata...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-bold text-red-600 mb-3">
          ❌ Eroare la confirmarea plății
        </h1>
        <p className="text-gray-600 mb-4">
          Plata nu a putut fi confirmată sau sesiunea a expirat. Încearcă din nou
          sau contactează echipa Oltenița Imobiliare.
        </p>
        <Link
          to="/anunturile-mele"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          ← Înapoi la Anunțurile Mele
        </Link>
      </div>
    );
  }

  if (status === "success" && details) {
    const isJob = details.plan === "job30";

    const endDate = new Date(details.featuredUntil).toLocaleDateString("ro-RO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const durata =
      details.plan === "featured7"
        ? "7 zile"
        : details.plan === "featured14"
        ? "14 zile"
        : "30 zile";

    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center bg-gray-50 px-4">
        <div className="bg-white shadow-md border border-gray-200 rounded-2xl p-8 max-w-md">
          <h1 className="text-3xl font-bold text-green-700 mb-4">
            ✅ {isJob ? "Anunț de angajare publicat!" : "Promovare reușită!"}
          </h1>

          <p className="text-gray-700 mb-2">
            {isJob ? (
              <>
                Anunțul tău de <b>Angajări</b> a fost publicat și este <b>promovat 30 zile</b>.
              </>
            ) : (
              <>
                Anunțul tău a fost promovat pentru <b>{durata}</b>.
              </>
            )}
          </p>

          <p className="text-gray-600 mb-6">
            Valabil până la data de <b>{endDate}</b>.
          </p>

          <Link
            to={isJob ? "/angajari" : "/anunturile-mele"}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {isJob ? "Vezi Angajări" : "Vezi Anunțurile Mele"}
          </Link>

          <p className="mt-3 text-xs text-gray-500">
            Vei fi redirecționat automat în câteva secunde…
          </p>
        </div>
      </div>
    );
  }

  return null;
}
