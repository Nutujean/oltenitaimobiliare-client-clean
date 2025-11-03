import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PromovareAnulata() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/anunturile-mele");
    }, 2500); // un pic mai mult pentru lizibilitate
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center bg-gray-50 text-center px-4">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-8 max-w-md">
        <h1 className="text-3xl font-bold text-red-600 mb-3">
          ❌ Plata a fost anulată
        </h1>
        <p className="text-gray-600 mb-5">
          Tranzacția nu a fost finalizată. Poți alege un alt plan de promovare
          sau reveni la anunțurile tale.
        </p>

        <button
          onClick={() => navigate("/anunturile-mele")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          ← Înapoi la Anunțurile Mele
        </button>

        <p className="text-sm text-gray-400 mt-4 animate-pulse">
          Redirecționare automată...
        </p>
      </div>
    </div>
  );
}
