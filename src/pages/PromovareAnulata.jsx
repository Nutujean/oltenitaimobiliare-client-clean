import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PromovareAnulata() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/anunturile-mele");
    }, 1500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-center p-4">
      <h1 className="text-2xl font-bold text-red-600 mb-3">
        ❌ Plata a fost anulată
      </h1>
      <p className="text-gray-600 mb-4">
        Nu s-a efectuat nicio plată. Vei fi redirecționat înapoi la
        anunțurile tale...
      </p>
      <button
        onClick={() => navigate("/anunturile-mele")}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
      >
        Înapoi la anunțurile mele
      </button>
    </div>
  );
}
