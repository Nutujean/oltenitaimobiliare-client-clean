import { Helmet } from "react-helmet-async";

export default function Profil() {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Helmet>
        <title>Profil utilizator - Oltenița Imobiliare</title>
        <meta
          name="description"
          content="Vezi și editează detaliile contului tău pe Oltenița Imobiliare."
        />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">Profilul meu</h1>
      {user ? (
        <div className="space-y-2">
          <p>
            <strong>Nume:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      ) : (
        <p className="text-gray-600">Nu ești logat.</p>
      )}
    </div>
  );
}
