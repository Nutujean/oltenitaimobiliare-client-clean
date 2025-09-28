import React, { useState } from "react";
import "./Faq.css";

function Faq() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      intrebare: "Cum adaug un anunț?",
      raspuns:
        "Trebuie să îți faci cont, să te autentifici și apoi să accesezi secțiunea „Adaugă anunț”. Completezi formularul și publici."
    },
    {
      intrebare: "Cât costă promovarea unui anunț?",
      raspuns:
        "Ai mai multe opțiuni: pachet gratuit (7 zile), pachet ⭐ Gold sau 💎 Diamond cu durată și beneficii extinse."
    },
    {
      intrebare: "Pot șterge sau edita un anunț?",
      raspuns:
        "Da. Intră în „Anunțurile mele” și ai opțiuni pentru editare sau ștergere."
    },
    {
      intrebare: "Cum pot contacta vânzătorul?",
      raspuns:
        "În pagina fiecărui anunț găsești detaliile de contact lăsate de proprietar."
    },
    {
      intrebare: "Datele mele sunt în siguranță?",
      raspuns:
        "Da. Toate datele sunt protejate conform politicii noastre de confidențialitate."
    }
  ];

  return (
    <div className="container faq-box">
      <h2>❓ Întrebări frecvente (FAQ)</h2>
      <div className="faq-list">
        {faqs.map((item, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
          >
            <div className="faq-question" onClick={() => toggle(index)}>
              <span>{item.intrebare}</span>
              <span>{activeIndex === index ? "−" : "+"}</span>
            </div>
            {activeIndex === index && (
              <div className="faq-answer">{item.raspuns}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Faq;
