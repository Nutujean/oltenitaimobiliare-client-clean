import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/OltenitaImobiliare.png";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
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

  // ✅ Modificat doar pentru verificare sigură a tokenului
  const handleAddClick = () => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined" || token === "null") {
      navigate("/login");
    } else {
      navigate("/adauga-anunt");
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-500 shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center text-white">
        {/* 🏠 LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src={logo}
            alt="Oltenița Imobiliare"
            className="w-9 h-9 rounded-lg shadow-md group-hover:scale-105 transition-transform"
          />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-cyan-300 via-white to-blue-200 bg-clip-text text-transparent drop-shadow-sm">
              Oltenița
            </span>
            <span className="text-gray-100 font-semibold">Imobiliare</span>
          </h1>
        </Link>

        {/* 🔹 Meniu mobil */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* 🔗 Linkuri desktop */}
        <div className="hidden md:flex items-center gap-5 text-sm font-medium">
          <Link to="/" className="hover:text-gray-200">
            Acasă
          </Link>

          {/* 🔵 Adaugă anunț */}
          <button
            onClick={handleAddClick}
            className="bg-white text-blue-700 hover:bg-gray-100 font-semibold px-3 py-1.5 rounded-lg transition"
          >
            + Adaugă anunț
          </button>

          {!user ? (
            <>
              <Link to="/login" className="hover:text-gray-200">
                Login
              </Link>
              <Link to="/inregistrare" className="hover:text-gray-200">
                Înregistrare
              </Link>
            </>
          ) : (
            <>
              <Link to="/anunturile-mele" className="hover:text-gray-200">
                Anunțurile mele
              </Link>
              <button onClick={handleLogout} className="hover:text-red-400">
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* 🔹 Meniu mobil dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-blue-700 px-4 py-3 space-y-2 text-sm">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block hover:text-gray-200"
          >
            Acasă
          </Link>

          <button
            onClick={() => {
              handleAddClick();
              setMenuOpen(false);
            }}
            className="block w-full text-left bg-white text-blue-700 px-3 py-1 rounded-lg"
          >
            + Adaugă anunț
          </button>

          {!user ? (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block hover:text-gray-200"
              >
                Login
              </Link>
              <Link
                to="/inregistrare"
                onClick={() => setMenuOpen(false)}
                className="block hover:text-gray-200"
              >
                Înregistrare
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/anunturile-mele"
                onClick={() => setMenuOpen(false)}
                className="block hover:text-gray-200"
              >
                Anunțurile mele
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="block text-left text-red-300 hover:text-red-400 w-full"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
