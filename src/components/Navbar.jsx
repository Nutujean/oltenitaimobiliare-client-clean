import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuth(!!token);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    setOpen(false);
    navigate("/");
  };

  const NavItem = ({ to, children, onClick }) => (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `px-3 py-2 rounded lg:rounded-md transition ${
          isActive ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600"
        }`
      }
    >
      {children}
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo + Acasă */}
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <img
            src="/logo.svg"
            alt="Oltenița Imobiliare"
            className="h-8 w-8"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <span className="text-xl font-bold">Oltenița Imobiliare</span>
        </Link>

        {/* Desktop nav – minimal */}
        <nav className="hidden md:flex items-center gap-2">
          <NavItem to="/">Acasă</NavItem>

          <span className="mx-2 h-6 w-px bg-gray-200" />

          <Link
            to="/adauga-anunt"
            className="ml-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md"
          >
            + Adaugă anunț
          </Link>

          {!isAuth ? (
            <>
              <Link
                to="/login"
                className="ml-2 border border-gray-300 hover:border-gray-400 px-3 py-2 rounded-md"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="ml-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md"
              >
                Înregistrare
              </Link>
            </>
          ) : (
            <>
              <NavItem to="/profil">Profil</NavItem>
              <button
                onClick={logout}
                className="ml-1 border border-gray-300 hover:border-gray-400 px-3 py-2 rounded-md"
              >
                Delogare
              </button>
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded hover:bg-gray-100"
          aria-label="Deschide meniul"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu – minimal */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-3 flex flex-col">
            <NavItem to="/" onClick={() => setOpen(false)}>
              Acasă
            </NavItem>

            <div className="my-2 h-px bg-gray-200" />

            <Link
              to="/adauga-anunt"
              onClick={() => setOpen(false)}
              className="mt-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-center"
            >
              + Adaugă anunț
            </Link>

            {!isAuth ? (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="border border-gray-300 hover:border-gray-400 px-3 py-2 rounded-lg text-center"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-center"
                >
                  Înregistrare
                </Link>
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  to="/profil"
                  onClick={() => setOpen(false)}
                  className="border border-gray-300 hover:border-gray-400 px-3 py-2 rounded-lg text-center"
                >
                  Profil
                </Link>
                <button
                  onClick={logout}
                  className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-2 rounded-lg text-center"
                >
                  Delogare
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
