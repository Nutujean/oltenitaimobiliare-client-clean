import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

export default function Profil() {
  const nav = useNavigate();
  const [me, setMe] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      nav("/login?next=/profil");
      return;
    }
    fetch(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data?.error || `HTTP ${r.status}`);
        setMe(data);
      })
      .catch((e) => {
        setErr(e.message);
        if (e.message.includes("401") || e.message.includes("Token")) {
          // token invalid → delogare curată
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          nav("/login?next=/profil");
        }
      });
  }, [nav]);

  if (err && !me) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <p className="text-red-600">Eroare: {err}</p>
      </div>
    );
  }

  if (!me) return <p className="p-6">Se încarcă...</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Profil</h1>
      <div className="space-y-2">
        <p><strong>Nume:</strong> {me.name}</p>
        <p><strong>Email:</strong> {me.email}</p>
        <p><strong>Creat la:</strong> {new Date(me.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
