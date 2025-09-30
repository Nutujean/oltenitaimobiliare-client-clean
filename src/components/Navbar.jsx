import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo / Brand */}
        <Link to="/" className="text-2xl font-bold">
          Oltenița Imobiliare
        </Link>

        {/* Linkuri */}
        <div className="flex space-x-6 items-center">
          <Link to="/" className="hover:text-yellow-300">
            Acasă
          </Link>
          <Link to="/anunturi" className="hover:text-yellow-300">
            Anunțuri
          </Link>
          <Link to="/adauga-anunt" className="hover:text-yellow-300">
            Adaugă anunț
          </Link>
          <Link to="/anunturile-mele" className="hover:text-yellow-300">
            Anunțurile Mele
          </Link>
          <Link to="/favorite" className="hover:text-yellow-300">
            Favorite
          </Link>

          {/* Autentificare */}
          {token ? (
            <>
              <Link to="/profil" className="hover:text-yellow-300">
                {user?.name || "Profil"}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-yellow-300">
                Login
              </Link>
              <Link to="/register" className="hover:text-yellow-300">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
