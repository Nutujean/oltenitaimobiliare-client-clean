import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Profil() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔐 Deconectare
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userPhone");
    navigate("/login");
  };

  // ✅ La încărcare — verificăm dacă există token
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedPhone = localStorage.getItem("userPhone");

    if (!token) {
      navigate("/login");
      return;
    }

    // ✅ Fallback dacă telefonul nu e salvat
    setPhone(storedPhone || "Necompletat");
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-10">Se încarcă...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Profilul meu</h1>
        <button
          onClick={logout}
          className="bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200"
        >
          🚪 Deconectare
        </button>
      </div>

      <div className="bg-white shadow rounded-xl p-4 space-y-2 text-gray-700">
        <p>
          <strong>Telefon:</strong>{" "}
          {phone === "Necompletat" ? "Necompletat" : phone}
        </p>
        <p>
          <strong>Autentificare:</strong> prin SMS
        </p>
        <p>
          <strong>Status:</strong> Cont activ ✅
        </p>
      </div>

      <div className="mt-6">
        <Link
          to="/anunturile-mele"
          className="inline-block bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700"
        >
          Vezi anunțurile mele
        </Link>
      </div>
    </div>
  );
}
