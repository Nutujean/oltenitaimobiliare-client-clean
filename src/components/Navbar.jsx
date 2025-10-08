import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));

  useEffect(() => {
    const sync = () => {
      setToken(localStorage.getItem("token"));
      setUser(JSON.parse(localStorage.getItem("user") || "null"));
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="text-xl font-bold">
          Oltenița Imobiliare
        </Link>

        {/* LINKURI principale */}
        <div className="flex gap-4 items-center">
          <Link to="/" className="hover:text-yellow-300">Acasă</Link>
          <Link to="/categorie/apartamente" className="hover:text-yellow-300">Anunțuri</Link>

          {token && (
            <>
              <Link to="/anunturile-mele" className="hover:text-yellow-300">Anunțurile Mele</Link>
              <Link
                to="/adauga-anunt"
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-3 py-1 rounded font-medium"
              >
                + Adaugă Anunț
              </Link>
            </>
          )}

          {!token ? (
            <>
              <Link to="/login" className="hover:text-yellow-300">Login</Link>
              <Link to="/register" className="hover:text-yellow-300">Înregistrare</Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="hover:text-yellow-300 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
