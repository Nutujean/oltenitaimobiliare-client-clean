// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "/public/logo.png"; // 🖼️ asigură-te că ai logo.png în /public

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
    <nav className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-500 shadow-lg fixed top-0 left-0 w-full z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center text-white">
        
        {/* 🏠 LOGO + TITLU PREMIUM */}
        <Link to="/" className="flex items-center gap-2 group">
          {logo && (
            <img
              src={logo}
              alt="Oltenița Imobiliare"
              className="w-9 h-9 rounded-lg shadow-md group-hover:scale-105 transition-transform"
            />
          )}
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-cyan-300 via-white to-blue-200 bg-clip-text text-transparent drop-shadow-sm">
              Oltenița
            </span>
            <span className="text-gray-100 font-semibold">Imobiliare</span>
          </h1>
        </Link>

        {/* 🔗 LINK-URI */}
        <div className="flex items-center gap-5 text-sm font-medium">
          <Link to="/" className="hover:text-gray-200 transition">Acasă</Link>
          <Link to="/categorie/apartamente" className="hover:text-gray-200 transition">Anunțuri</Link>

          {/* 🔵 Buton Adaugă Anunț */}
          <Link
            to="/adauga-anunt"
            className="bg-white text-blue-700 hover:bg-gray-100 font-semibold px-3 py-1.5 rounded-lg transition"
          >
            + Adaugă anunț
          </Link>

          {!user ? (
            <>
              <Link to="/login" className="hover:text-gray-200 transition">
                Login
              </Link>
              <Link to="/register" className="hover:text-gray-200 transition">
                Înregistrare
              </Link>
            </>
          ) : (
            <>
              <Link to="/anunturile-mele" className="hover:text-gray-200 transition">
                Anunțurile mele
              </Link>
              <button
                onClick={handleLogout}
                className="hover:text-red-400 transition"
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
