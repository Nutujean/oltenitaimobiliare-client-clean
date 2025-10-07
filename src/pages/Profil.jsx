import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../api";

export default function Profil() {
  const [me, setMe] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setErr("Nu ești autentificat.");
      setLoading(false);
      return;
    }

    const run = async () => {
      try {
        const r = await fetch(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (r.status === 401) {
          throw new Error("Sesiune expirată sau token invalid. Autentifică-te din nou.");
        }
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data?.error || "Eroare la profil");
        setMe(data);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-10">Se încarcă...</div>;
  }

  if (err) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
          {err}
        </div>
        <Link
          to="/login"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
        >
          Mergi la autentificare
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Profilul meu</h1>
        <button
          onClick={logout}
          className="bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200"
        >
          Ieșire
        </button>
      </div>

      <div className="bg-white shadow rounded-xl p-4 space-y-2">
        <p><strong>Nume:</strong> {me?.name || "-"}</p>
        <p><strong>Email:</strong> {me?.email}</p>
        <p><strong>Creat:</strong> {new Date(me?.createdAt).toLocaleString()}</p>
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