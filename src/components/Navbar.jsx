import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    alert("Te-ai delogat!");
    navigate("/");
    window.location.reload(); // reîmprospătează pagina
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          Oltenita Imobiliare
        </Link>

        {/* Link-uri principale */}
        <div className="space-x-4">
          <Link to="/" className="hover:underline">
            Acasă
          </Link>
          <Link to="/adauga" className="hover:underline">
            Adaugă Anunț
          </Link>
          <Link to="/anunturile-mele" className="hover:underline">
            Anunțurile Mele
          </Link>
        </div>

        {/* Autentificare */}
        <div>
          {token ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm">👤 {email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-3">
              <Link to="/login" className="bg-white text-blue-600 px-3 py-1 rounded">
                Login
              </Link>
              <Link to="/register" className="bg-green-500 px-3 py-1 rounded">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
