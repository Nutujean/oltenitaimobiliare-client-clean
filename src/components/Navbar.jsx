import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-blue-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* 🔷 Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/images/logo.png"
            alt="Oltenita Imobiliare"
            className="h-10 w-10 object-contain rounded-full bg-white p-1"
          />
          <span className="text-white text-lg font-semibold tracking-wide">
            Oltenița Imobiliare
          </span>
        </Link>

        {/* 🔹 Meniu desktop */}
        <nav className="hidden md:flex items-center gap-6 text-white font-medium">
          <Link to="/" className="hover:text-gray-200 transition">
            Acasă
          </Link>
          <Link to="/adauga-anunt" className="hover:text-gray-200 transition">
            Adaugă anunț
          </Link>
          <Link to="/anunturile-mele" className="hover:text-gray-200 transition">
            Anunțurile mele
          </Link>
          {user ? (
            <>
              <span className="text-gray-200">
                Salut, <b>{user.name}</b>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition"
              >
                Ieșire
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-gray-200 transition border border-white/30 rounded-md px-3 py-1"
              >
                Autentificare
              </Link>
              <Link
                to="/register"
                className="hover:text-gray-200 transition border border-white/30 rounded-md px-3 py-1"
              >
                Înregistrare
              </Link>
            </>
          )}
        </nav>

        {/* 🔹 Buton meniu mobil */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* 🔹 Meniu mobil */}
      {isOpen && (
        <div className="md:hidden bg-blue-600 px-4 py-3 space-y-2 text-white font-medium">
          <Link to="/" onClick={() => setIsOpen(false)} className="block">
            Acasă
          </Link>
          <Link
            to="/adauga-anunt"
            onClick={() => setIsOpen(false)}
            className="block"
          >
            Adaugă anunț
          </Link>
          <Link
            to="/anunturile-mele"
            onClick={() => setIsOpen(false)}
            className="block"
          >
            Anunțurile mele
          </Link>
          {user ? (
            <>
              <p className="text-sm">Salut, {user.name}</p>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition w-full text-left"
              >
                Ieșire
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block"
              >
                Autentificare
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block"
              >
                Înregistrare
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
