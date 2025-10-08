import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  useEffect(() => {
    const syncAuth = () => {
      setToken(localStorage.getItem("token"));
      setUser(JSON.parse(localStorage.getItem("user") || "null"));
    };
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-blue-700 text-white shadow-md px-6 py-3 flex justify-between items-center">
      {/* Stânga */}
      <div className="flex items-center gap-4">
        <Link to="/" className="font-bold text-lg hover:text-yellow-300 transition">
          🏠 Oltenița Imobiliare
        </Link>
        <Link to="/adauga-anunt" className="hover:text-yellow-300 transition">
          + Adaugă anunț
        </Link>
        <Link to="/categorie/apartamente" className="hover:text-yellow-300 transition">
          Apartamente
        </Link>
        <Link to="/categorie/case" className="hover:text-yellow-300 transition">
          Case
        </Link>
        <Link to="/categorie/terenuri" className="hover:text-yellow-300 transition">
          Terenuri
        </Link>
      </div>

      {/* Dreapta */}
      <div className="flex items-center gap-4">
        {!token ? (
          <>
            <Link
              to="/login"
              className="bg-white text-blue-700 px-3 py-1 rounded-lg hover:bg-gray-100 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-yellow-400 text-blue-800 px-3 py-1 rounded-lg hover:bg-yellow-300 transition"
            >
              Înregistrare
            </Link>
          </>
        ) : (
          <>
            <span className="text-sm">
              Bun venit,{" "}
              <span className="font-semibold text-yellow-300">
                {user?.name || "Utilizator"}
              </span>
            </span>
            <Link
              to="/anunturile-mele"
              className="bg-white text-blue-700 px-3 py-1 rounded-lg hover:bg-gray-100 transition"
            >
              Anunțurile Mele
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg font-medium transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
