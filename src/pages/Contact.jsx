export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Contactează-ne</h1>

      <p className="text-gray-700 mb-6">
        Pentru întrebări, sugestii sau colaborări, completează formularul de
        mai jos sau folosește datele de contact directe.
      </p>

      {/* Formular simplu */}
      <form className="bg-white shadow rounded-lg p-6 space-y-4">
        <input
          type="text"
          placeholder="Numele tău"
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="email"
          placeholder="Emailul tău"
          className="w-full px-3 py-2 border rounded"
        />
        <textarea
          placeholder="Mesajul tău"
          className="w-full px-3 py-2 border rounded h-32"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Trimite
        </button>
      </form>

      {/* Date directe */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Date de contact</h2>
        <ul className="space-y-2 text-gray-700">
          <li>📧 Email: contact@oltenitaimobiliare.ro</li>
          <li>📞 Telefon: +40 7XX XXX XXX</li>
          <li>📍 Locație: Oltenița, România</li>
        </ul>
      </div>
    </div>
  );
}
