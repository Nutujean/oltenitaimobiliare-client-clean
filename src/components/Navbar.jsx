import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link to="/">Oltenita Imobiliare</Link>
      </div>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">
          Acasă
        </Link>

        {!token ? (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        ) : (
          <>
            <Link to="/adauga-anunt" className="hover:underline">
              Adaugă Anunț
            </Link>
            <Link to="/anunturile-mele" className="hover:underline">
              Anunțurile Mele
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
            <span className="ml-2 text-sm text-gray-200">
              {email}
            </span>
          </>
        )}
      </div>
    </nav>
  );
}
