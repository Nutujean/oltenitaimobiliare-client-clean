// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* 🏠 LOGO + EFECT GRADIENT */}
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 bg-clip-text text-transparent hover:opacity-90 transition"
        >
          Oltenița<span className="text-gray-800">Imobiliare</span>
        </Link>

        {/* 🔗 LINK-URI */}
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link to="/" className="text-gray-700 hover:text-blue-600 transition">Acasă</Link>
          <Link to="/categorie/apartamente" className="text-gray-700 hover:text-blue-600 transition">Anunțuri</Link>

          {/* 👇 NOUL BUTON ADĂUGĂ ANUNȚ */}
          <Link
            to="/adauga-anunt"
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition"
          >
            + Adaugă anunț
          </Link>

          {!user ? (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">
                Login
              </Link>
              <Link to="/register" className="text-gray-700 hover:text-blue-600 transition">
                Înregistrare
              </Link>
            </>
          ) : (
            <>
              <Link to="/anunturile-mele" className="text-gray-700 hover:text-blue-600 transition">
                Anunțurile mele
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
