// src/pages/Termeni.jsx
import { Link, useNavigate } from "react-router-dom";

export default function Termeni() {
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

      <h1 className="text-3xl font-bold mb-6">Termeni și condiții</h1>

      <p className="mb-4">
        Accesarea și utilizarea site-ului <b>Oltenița Imobiliare</b> implică
        acceptarea prezentelor termeni și condiții.
      </p>

      <p className="mb-4">
        Utilizatorii sunt responsabili pentru corectitudinea informațiilor
        publicate în anunțuri. Este interzisă postarea de conținut fals,
        ofensator sau ilegal.
      </p>

      <p>
        Administratorii site-ului își rezervă dreptul de a șterge anunțurile
        care nu respectă regulile sau legislația în vigoare.
      </p>
    </div>
  );
}