import { useState } from "react";
import API_URL from "../api";

export default function AdaugaAnunt() {
  const [titlu, setTitlu] = useState("");
  const [descriere, setDescriere] = useState("");
  const [pret, setPret] = useState("");
  const [categorie, setCategorie] = useState("");
  const [telefon, setTelefon] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔹 Validare email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("⚠️ Te rugăm să introduci o adresă de email validă!");
      return;
    }

    // 🔹 Validare telefon (10 cifre, ex: 07xxxxxxxx)
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(telefon)) {
      alert("⚠️ Te rugăm să introduci un număr de telefon valid (10 cifre, ex: 07xxxxxxxx)!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/listings`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          titlu,
          descriere,
          pret,
          categorie,
          telefon,
          email,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare la adăugare");

      alert("✅ Anunț adăugat cu succes!");
      setTitlu("");
      setDescriere("");
      setPret("");
      setCategorie("");
      setTelefon("");
      setEmail("");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-lg mx-auto space-y-3">
      <h1 className="text-xl font-bold mb-4 text-center">Adaugă un anunț</h1>

      {/* Titlu */}
      <input
        value={titlu}
        onChange={(e) => setTitlu(e.target.value)}
        placeholder="Titlu"
        required
        className="w-full border p-2 rounded"
      />

      {/* Descriere */}
      <textarea
        value={descriere}
        onChange={(e) => setDescriere(e.target.value)}
        placeholder="Descriere"
        required
        className="w-full border p-2 rounded"
      />

      {/* Preț */}
      <input
        type="number"
        value={pret}
        onChange={(e) => setPret(e.target.value)}
        placeholder="Preț (€)"
        required
        className="w-full border p-2 rounded"
      />

      {/* Categorie */}
      <select
        value={categorie}
        onChange={(e) => setCategorie(e.target.value)}
        required
        className="w-full border p-2 rounded"
      >
        <option value="">Selectează categoria</option>
        <option value="Apartamente">Apartamente</option>
        <option value="Garsoniere">Garsoniere</option>
        <option value="Case">Case</option>
        <option value="Terenuri">Terenuri</option>
        <option value="Garaje">Garaje</option>
        <option value="Spatiu comercial">Spațiu comercial</option>
      </select>

      {/* Email */}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Adresa de email"
        required
        className="w-full border p-2 rounded"
      />

      {/* Telefon */}
      <input
        type="tel"
        value={telefon}
        onChange={(e) => setTelefon(e.target.value)}
        placeholder="Număr de telefon (07xxxxxxxx)"
        required
        pattern="^0\d{9}$"
        title="Introduceți un număr valid de 10 cifre (ex: 07xxxxxxxx)"
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition"
      >
        Salvează
      </button>
    </form>
  );
}
