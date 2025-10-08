import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { API_URL } from "../config";

export default function PromovareSucces() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
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

  if (status === "loading") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-gray-600">
        <p className="text-lg">Se confirmă plata...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-3">Eroare la confirmarea plății</h1>
        <p className="text-gray-600 mb-4">
          Ne pare rău, dar nu am putut confirma plata. Încearcă din nou sau contactează-ne.
        </p>
        <Link
          to="/anunturile-mele"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Înapoi la Anunțurile Mele
        </Link>
      </div>
    );
  }

  if (status === "success" && details) {
    const endDate = new Date(details.featuredUntil).toLocaleDateString("ro-RO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-3">
          ✅ Promovare reușită!
        </h1>
        <p className="text-gray-700 mb-3">
          Anunțul tău a fost promovat pentru planul <b>{details.plan}</b>.
        </p>
        <p className="text-gray-600 mb-6">
          Valabil până la data de <b>{endDate}</b>.
        </p>

        <Link
          to="/anunturile-mele"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          Vezi Anunțurile Mele
        </Link>
      </div>
    );
  }

  return null;
}
