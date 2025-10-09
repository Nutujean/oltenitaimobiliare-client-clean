// src/pages/Contact.jsx
export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Contactează-ne</h1>

      <p className="mb-6 text-gray-600">
        Pentru întrebări, sugestii sau colaborări, completează formularul de mai jos
        sau folosește datele de contact directe.
      </p>

      {/* Formular */}
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Numele tău</label>
          <input type="text" className="w-full border rounded-lg p-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Emailul tău</label>
          <input type="email" className="w-full border rounded-lg p-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mesajul tău</label>
          <textarea rows="4" className="w-full border rounded-lg p-2" required />
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg">
          Trimite
        </button>
      </form>

      {/* Date de contact */}
      <div className="mt-10 space-y-2">
        <h2 className="text-xl font-semibold">Date de contact</h2>
        <p>📧 <strong>Email:</strong> contact@oltenitaimobiliare.ro</p>
        <p>📞 <strong>Telefon:</strong> +40 7XX XXX XXX</p>
        <p>📍 <strong>Locație:</strong> Oltenița, România</p>
      </div>
    </div>
  );
}
