import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  // 🔄 Verifică mereu localStorage la schimbarea de rută (reactiv)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location.pathname]); // se reactivează la fiecare navigare

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-blue-700 text-white px-6 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold hover:text-gray-200 transition"
        >
          Oltenița Imobiliare
        </Link>

        {/* Linkuri principale */}
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-gray-200 transition">
            Acasă
          </Link>
          <Link to="/adauga-anunt" className="hover:text-gray-200 transition">
            Adaugă anunț
          </Link>
          <Link to="/anunturile-mele" className="hover:text-gray-200 transition">
            Anunțurile mele
          </Link>

          {!user ? (
            <>
              <Link to="/login" className="hover:text-gray-200 transition">
                Autentificare
              </Link>
              <Link to="/register" className="hover:text-gray-200 transition">
                Înregistrare
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-sm">👤 {user?.name || "Utilizator"}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-medium transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
