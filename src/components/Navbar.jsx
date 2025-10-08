import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload(); // 🔄 Actualizează UI după delogare
  };

  // Închide meniul mobil la redimensionare
  useEffect(() => {
    const close = () => window.innerWidth > 768 && setMenuOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* 🔹 Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-blue-700 tracking-tight"
        >
          Oltenița<span className="text-gray-800">Imobiliare</span>
        </Link>

        {/* 🔹 Meniu desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-blue-600 font-medium">
            Acasă
          </Link>
          <Link to="/anunturile-mele" className="hover:text-blue-600 font-medium">
            Anunțurile mele
          </Link>

          {!token ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Autentificare
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
              >
                Înregistrare
              </Link>
            </>
          ) : (
            <>
              <span className="text-gray-600">
                👋 Salut, <strong>{user?.name || "Utilizator"}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* 🔹 Buton mobil */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* 🔹 Meniu mobil */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-inner flex flex-col p-4 gap-3 text-lg">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Acasă
          </Link>
          <Link to="/anunturile-mele" onClick={() => setMenuOpen(false)}>
            Anunțurile mele
          </Link>

          {!token ? (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-blue-600 font-semibold"
              >
                Autentificare
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="text-blue-600 font-semibold"
              >
                Înregistrare
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
