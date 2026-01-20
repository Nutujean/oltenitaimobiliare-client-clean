import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/OltenitaImobiliare.png";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 🔄 actualizare stare login la schimbare pagină
  useEffect(() => {
    const u = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (u) {
      try {
        setUser(JSON.parse(u));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }

    setIsLogged(!!token && token !== "undefined" && token !== "null");
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userPhone");
    setUser(null);
    setIsLogged(false);
    navigate("/");
  };

  const handlePosteazaClick = () => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/adauga-anunt");
    } else {
      sessionStorage.setItem("redirectAfterLogin", "adauga-anunt");
      setShowDialog(true);
    }
  };

  const goToLogin = () => {
    setShowDialog(false);
    navigate("/login");
  };

  const goToRegister = () => {
    setShowDialog(false);
    navigate("/inregistrare");
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-500 shadow-lg fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center text-white">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={logo}
              alt="Oltenița Imobiliare"
              className="w-9 h-9 rounded-lg shadow-md group-hover:scale-105 transition-transform"
            />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-cyan-300 via-white to-blue-200 bg-clip-text text-transparent">
                Oltenița
              </span>
              <span className="text-gray-100 font-semibold">Imobiliare</span>
            </h1>
          </Link>

          {/* Meniu mobil toggle */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

          {/* MENIU DESKTOP */}
          <div className="hidden md:flex items-center gap-5 text-sm font-medium">
            <Link to="/" className="hover:text-gray-200">
              Acasă
            </Link>

            <button
              onClick={handlePosteazaClick}
              className="bg-white text-blue-700 hover:bg-gray-100 font-semibold px-4 py-2 rounded-lg transition"
            >
              ➕ Postează anunț
            </button>

            {(user || isLogged) ? (
              <>
                <Link to="/anunturile-mele" className="hover:text-gray-200">
                  📋 Anunțurile mele
                </Link>
                <button onClick={handleLogout} className="hover:text-red-300">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-gray-200">
                  Login
                </Link>
                <Link to="/inregistrare" className="hover:text-gray-200">
                  Înregistrare
                </Link>
              </>
            )}
          </div>
        </div>

        {/* MENIU MOBIL */}
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
                handlePosteazaClick();
                setMenuOpen(false);
              }}
              className="block w-full text-left bg-white text-blue-700 px-3 py-2 rounded-lg font-semibold"
            >
              ➕ Postează anunț
            </button>

            {(user || isLogged) ? (
              <>
                <Link
                  to="/anunturile-mele"
                  onClick={() => setMenuOpen(false)}
                  className="block hover:text-gray-200"
                >
                  📋 Anunțurile mele
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
            ) : (
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
            )}
          </div>
        )}
      </nav>

      {/* MODAL LOGIN / REGISTER */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] px-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Ai deja cont la noi?
            </h2>
            <p className="text-gray-600 mb-6">
              Alege una dintre opțiuni pentru a continua:
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={goToLogin}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
              >
                🔐 Autentificare
              </button>
              <button
                onClick={goToRegister}
                className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
              >
                🆕 Creează cont
              </button>
              <button
                onClick={() => setShowDialog(false)}
                className="text-gray-500 text-sm hover:text-gray-700 mt-2"
              >
                Anulează
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
