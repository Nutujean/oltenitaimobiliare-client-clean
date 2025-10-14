// src/pages/CumAdaugi.jsx
import React from "react";

export default function CumAdaugi() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Cum adaugi un anunț</h1>

      <p>
        Publicarea unui anunț pe <strong>Oltenița Imobiliare</strong> este simplă și rapidă.
        Urmează pașii de mai jos:
      </p>

      <ol className="list-decimal pl-6 mt-4 space-y-2">
        <li>Apasă pe butonul <strong>„Adaugă anunț”</strong> din meniul principal.</li>
        <li>Completează toate detaliile despre proprietate (titlu, descriere, preț, localitate, categorie).</li>
        <li>Încarcă fotografii clare, bine luminate, care arată proprietatea cât mai realist.</li>
        <li>Verifică informațiile și apasă <strong>„Publică anunțul”</strong>.</li>
      </ol>

      <p className="mt-6 text-gray-600">
        După publicare, anunțul tău va fi vizibil pe site și poate fi promovat pentru
        o expunere mai mare. Toate anunțurile sunt vizibile în zona Oltenița și localitățile din jur.
      </p>

      <p className="mt-4 font-medium">
        Ai întrebări? Scrie-ne la{" "}
        <a href="mailto:oltenitaimobiliare@gmail.com" className="text-blue-700 underline">
          oltenitaimobiliare@gmail.com
        </a>
      </p>
    </div>
  );
}
