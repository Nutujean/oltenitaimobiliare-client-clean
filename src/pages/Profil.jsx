import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

export default function Profil() {
  const [user, setUser] = useState(null);

  useEffect(() => {
  try {
    const stored = localStorage.getItem("user");

    if (!stored || stored === "undefined" || stored === "null") {
      setUser(null);
    } else {
      setUser(JSON.parse(stored));
    }
  } catch {
    setUser(null);
  }
}, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Helmet>
        <title>Profil utilizator - Oltenița Imobiliare</title>
        <meta
          name="description"
          content="Vezi și editează detaliile contului tău pe Oltenița Imobiliare."
        />
        <meta property="og:title" content="Profil utilizator - Oltenița Imobiliare" />
        <meta
          property="og:description"
          content="Gestionează datele contului și anunțurile tale."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">Profilul meu</h1>

      {user ? (
        <div className="space-y-2">
          <p><strong>Nume:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {user.phone && <p><strong>Telefon:</strong> {user.phone}</p>}
        </div>
      ) : (
        <p className="text-gray-600">Nu ești logat.</p>
      )}
    </div>
  );
}
