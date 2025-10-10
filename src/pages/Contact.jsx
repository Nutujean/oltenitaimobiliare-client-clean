import React from "react";

export default function Contact() {
  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "60px auto",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h2 style={{ color: "#0a58ca", marginBottom: "20px" }}>Contactează-ne</h2>
      <p style={{ color: "#555", marginBottom: "30px" }}>
        Pentru întrebări, sugestii sau colaborări, completează formularul de mai
        jos. Mesajul tău va fi trimis direct către echipa Oltenița Imobiliare.
      </p>

      <form
        action="https://formsubmit.co/oltenitaimobiliare@gmail.com"
        method="POST"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <input
          type="text"
          name="name"
          placeholder="Numele tău"
          required
          style={inputStyle}
        />
        <input
          type="email"
          name="email"
          placeholder="Emailul tău"
          required
          style={inputStyle}
        />
        <textarea
          name="message"
          placeholder="Mesajul tău"
          rows="5"
          required
          style={inputStyle}
        ></textarea>
        <button
          type="submit"
          style={{
            backgroundColor: "#0a58ca",
            color: "white",
            padding: "12px 0",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Trimite mesajul
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: "12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "15px",
  outline: "none",
  width: "100%",
};
