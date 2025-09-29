import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem("token");
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
        <div className="flex space-x-6">
          <Link to="/" className="hover:text-blue-600">
            Acasă
          </Link>
          <Link to="/anunturi" className="hover:text-blue-600">
            Anunțuri
          </Link>
          {isLoggedIn && (
            <>
              <Link to="/adauga-anunt" className="hover:text-blue-600">
                Adaugă Anunț
              </Link>
              <Link to="/anunturile-mele" className="hover:text-blue-600">
                Anunțurile Mele
              </Link>
              <Link to="/profil" className="hover:text-blue-600">
                Profil
              </Link>
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
