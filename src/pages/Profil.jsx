import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profil() {
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Eroare la încărcarea utilizatorului");
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchUser();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleChangePassword = async () => {
    if (!newPassword) return alert("Introdu parola nouă!");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!res.ok) throw new Error("Eroare la schimbarea parolei");
      alert("Parola a fost schimbată cu succes ✅");
      setNewPassword("");
    } catch (error) {
      console.error(error.message);
      alert("Eroare la schimbarea parolei ❌");
    }
  };

  if (!user) return <p className="text-center py-8">Se încarcă...</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Profilul Meu</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <p className="mb-2">
          <b>Nume:</b> {user.name}
        </p>
        <p className="mb-4">
          <b>Email:</b> {user.email}
        </p>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Schimbă parola</h2>
        <input
          type="password"
          placeholder="Parola nouă"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-4"
        />
        <button
          onClick={handleChangePassword}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Salvează
        </button>
      </div>
    </div>
  );
}
