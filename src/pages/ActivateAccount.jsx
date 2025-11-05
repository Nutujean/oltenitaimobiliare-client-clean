import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function ActivateAccount() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const verify = async () => {
      try {
        const r = await fetch(`https://oltenitaimobiliare.ro/api/auth/activate/${token}`);
        if (r.ok) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    };
    verify();
  }, [token]);

  if (status === "loading")
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-700">
        <h1 className="text-xl font-semibold">Verificăm activarea contului...</h1>
      </div>
    );

  if (status === "success")
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">✅ Cont activat cu succes!</h1>
        <p className="text-gray-700 mb-6">Te poți autentifica acum în contul tău.</p>
        <Link
          to="/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Mergi la autentificare
        </Link>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">❌ Link invalid sau expirat</h1>
      <p className="text-gray-700 mb-6">Te rugăm să soliciți un nou link de activare.</p>
      <Link
        to="/register"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Creează un cont nou
      </Link>
    </div>
  );
}
