import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // ștergem token-ul
    localStorage.removeItem("token");
    // redirecționăm spre login
    navigate("/login");
  }, [navigate]);

  return (
    <div className="p-4 text-center">
      <h1 className="text-xl font-bold">Te-ai delogat ✅</h1>
      <p>Vei fi redirecționat către pagina de login...</p>
    </div>
  );
}
