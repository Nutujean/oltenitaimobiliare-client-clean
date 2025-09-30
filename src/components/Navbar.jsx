import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Oltenița Imobiliare
        </Link>

        {/* Meniu */}
        <div className="flex space-x-6 items-center">
          <Link to="/" className="hover:text-blue-600">Acasă</Link>
          <Link to="/anunturi" className="hover:text-blue-600">Anunțuri</Link>
          {isLoggedIn && (
            <>
              <Link to="/adauga-anunt" className="hover:text-blue-600">Adaugă anunț</Link>
              <Link to="/anunturile-mele" className="hover:text-blue-600">Anunțurile mele</Link>
              <Link to="/favorite" className="hover:text-blue-600 flex items-center">
                Favorite <span className="ml-1">❤️</span>
              </Link>
              <Link to="/profil" className="hover:text-blue-600">Profil</Link>
              <button
                onClick={handleLogout}
                className="hover:text-red-600"
              >
                Logout
              </button>
            </>
          )}
          {!isLoggedIn && (
            <>
              <Link to="/login" className="hover:text-blue-600">Login</Link>
              <Link to="/register" className="hover:text-blue-600">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
