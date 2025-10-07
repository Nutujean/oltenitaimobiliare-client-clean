import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-700">
          Oltenița Imobiliare
        </Link>

        {/* Meniu principal */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-blue-700 transition">
            Acasă
          </Link>

          {user && (
            <>
              <Link
                to="/adauga-anunt"
                className="hover:text-blue-700 transition"
              >
                Adaugă anunț
              </Link>
              <Link
                to="/anunturile-mele"
                className="hover:text-blue-700 transition"
              >
                Anunțurile mele
              </Link>
              <Link
                to="/profil"
                className="hover:text-blue-700 transition"
              >
                Profil
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 transition"
              >
                Ieșire
              </button>
            </>
          )}

          {!user && (
            <>
              <Link to="/login" className="hover:text-blue-700 transition">
                Autentificare
              </Link>
              <Link
                to="/register"
                className="hover:text-blue-700 transition border border-blue-700 px-3 py-1 rounded-lg hover:bg-blue-700 hover:text-white transition"
              >
                Înregistrare
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
