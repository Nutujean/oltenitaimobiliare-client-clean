import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // verificăm dacă există token în localStorage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          Oltenița Imobiliare
        </Link>

        {/* Meniu */}
        <div className="flex space-x-4 items-center">
          <Link to="/" className="hover:text-blue-600">
            Acasă
          </Link>

          {isLoggedIn ? (
            <>
              <Link to="/anunturile-mele" className="hover:text-blue-600">
                Anunțurile Mele
              </Link>

              <Link
                to="/adauga-anunt"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Adaugă anunț
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-600">
                Login
              </Link>
              <Link to="/register" className="hover:text-blue-600">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
