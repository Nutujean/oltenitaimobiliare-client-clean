import { useEffect, useState } from "react";
import API_URL from "../api";

export default function AnunturileMele() {
  const [anunturi, setAnunturi] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_URL}/api/anunturile-mele`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAnunturi(data))
      .catch((err) => console.error("Eroare:", err));
  }, []);

  const stergeAnunt = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Nu ești logat!");
    if (!window.confirm("Sigur vrei să ștergi anunțul?")) return;

    try {
      const res = await fetch(`${API_URL}/api/anunturi/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setAnunturi(anunturi.filter((a) => a._id !== id));
      }
    } catch (err) {
      alert("❌ Eroare la ștergere");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Anunțurile Mele</h1>
      {anunturi.length === 0 && <p>Nu ai anunțuri publicate.</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {anunturi.map((a) => (
          <div key={a._id} className="border rounded p-4 shadow">
            <h2 className="font-bold">{a.titlu}</h2>
            <p>{a.pret} EUR</p>
            <button
              onClick={() => stergeAnunt(a._id)}
              className="bg-red-600 text-white px-3 py-1 rounded mt-2"
            >
              Șterge
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
