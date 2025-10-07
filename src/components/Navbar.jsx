import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogged(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLogged(false);
    navigate("/");
  };

  return (
    <nav className="bg-blue-700 text-white shadow-lg fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold hover:text-blue-200">
          Oltenița Imobiliare
        </Link>

        {/* Meniu */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-blue-200 font-medium">
            Acasă
          </Link>
          <Link to="/adauga-anunt" className="hover:text-blue-200 font-medium">
            Adaugă anunț
          </Link>

          {isLogged ? (
            <>
              <Link
                to="/anunturile-mele"
                className="hover:text-blue-200 font-medium"
              >
                Anunțurile mele
              </Link>
              <button
                onClick={handleLogout}
                className="bg-white text-blue-700 px-4 py-1 rounded-lg font-semibold hover:bg-blue-100 transition"
              >
                Deconectare
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-blue-200 font-medium"
              >
                Autentificare
              </Link>
              <Link
                to="/register"
                className="bg-white text-blue-700 px-4 py-1 rounded-lg font-semibold hover:bg-blue-100 transition"
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
