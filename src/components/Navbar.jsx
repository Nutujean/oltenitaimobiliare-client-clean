import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    // 🔥 Curățăm complet tot ce ține de user/token
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();

    // Forțăm refresh pentru siguranță (ca să șteargă starea)
    window.location.href = "/";
  };

  return (
    <nav className="bg-blue-700 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-bold text-lg hover:text-gray-200">
          Oltenița Imobiliare
        </Link>
        <Link to="/adauga-anunt" className="hover:text-gray-200">
          Adaugă anunț
        </Link>
        <Link to="/categorie/apartamente" className="hover:text-gray-200">
          Apartamente
        </Link>
        <Link to="/categorie/case" className="hover:text-gray-200">
          Case
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {!token ? (
          <>
            <Link to="/login" className="hover:text-gray-200">
              Login
            </Link>
            <Link to="/register" className="hover:text-gray-200">
              Înregistrare
            </Link>
          </>
        ) : (
          <>
            <span>Bun venit, {user?.name || "Utilizator"}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
