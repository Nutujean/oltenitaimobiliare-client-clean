// src/pages/Confidentialitate.jsx
import { Link, useNavigate } from "react-router-dom";

export default function Confidentialitate() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* ✅ Navigație */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50"
        >
          ← Înapoi
        </button>

        <Link
          to="/"
          className="px-4 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50"
        >
          🏠 Acasă
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Politică de confidențialitate</h1>

      <p className="mb-4">
        Site-ul <b>Oltenița Imobiliare</b> colectează date personale doar pentru
        crearea contului și publicarea anunțurilor.
      </p>

      <p className="mb-4">
        Datele (nume, email, telefon) nu vor fi vândute sau distribuite către
        terți fără acordul utilizatorului.
      </p>

      <p>
        Utilizatorii pot solicita modificarea sau ștergerea datelor prin
        contactarea administratorului.
      </p>
    </div>
  );
}