import { useState } from "react";
import API_URL from "../api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password: parola }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare la înregistrare");

      localStorage.setItem("token", data.token);
      alert("✅ Cont creat cu succes!");
      window.location.href = "/";
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto space-y-3">
      <h1 className="text-xl font-bold mb-4">Înregistrare</h1>
      <input type="text" placeholder="Nume" value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 rounded" required />
      <input type="email" placeholder="Email" value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 rounded" required />
      <input type="password" placeholder="Parola" value={parola}
        onChange={(e) => setParola(e.target.value)}
        className="w-full border p-2 rounded" required />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Creează cont
      </button>
    </form>
  );
}
