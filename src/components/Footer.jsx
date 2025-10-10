import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#f7f7f7",
        padding: "40px 0",
        marginTop: "50px",
        borderTop: "1px solid #ddd",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          padding: "0 20px",
        }}
      >
        {/* 🏠 Secțiunea 1 - Descriere platformă */}
        <div>
          <h3 style={{ color: "#0a58ca", fontSize: "20px", marginBottom: "10px" }}>
            Oltenița Imobiliare 🏠
          </h3>
          <p style={{ color: "#444", fontSize: "15px", lineHeight: "1.7" }}>
            Platforma locală de anunțuri imobiliare pentru Oltenița și împrejurimi.
            Găsește rapid apartamente, case, terenuri și spații comerciale disponibile în zonă.
            Totul simplu, rapid și sigur — locul unde fiecare proprietate își găsește cumpărătorul potrivit.
          </p>
        </div>

        {/* 🔗 Secțiunea 2 - Linkuri utile */}
        <div>
          <h4 style={{ color: "#0a58ca", marginBottom: "12px" }}>Linkuri utile</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: "1.9" }}>
            <li><a href="/despre-noi" style={linkStyle}>Despre noi</a></li>
            <li><a href="/termeni" style={linkStyle}>Termeni și condiții</a></li>
            <li><a href="/confidentialitate" style={linkStyle}>Politica de confidențialitate</a></li>
            <li><a href="/cookies" style={linkStyle}>Politica cookies</a></li>
            <li><a href="/contact" style={linkStyle}>Contact</a></li>
          </ul>
        </div>
      </div>

      {/* 📨 Formular Contact */}
      <div
        style={{
          maxWidth: "700px",
          margin: "50px auto 0",
          textAlign: "center",
          padding: "0 20px",
        }}
      >
        <h4 style={{ color: "#0a58ca", marginBottom: "10px" }}>Trimite-ne un mesaj</h4>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          <input type="text" placeholder="Numele tău" style={inputStyle} />
          <input type="email" placeholder="Emailul tău" style={inputStyle} />
          <textarea placeholder="Mesajul tău" rows="4" style={inputStyle}></textarea>
          <button
            type="submit"
            style={{
              backgroundColor: "#0a58ca",
              color: "white",
              padding: "10px 0",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Trimite
          </button>
        </form>
      </div>

      {/* 🧾 Copyright */}
      <p
        style={{
          textAlign: "center",
          marginTop: "40px",
          color: "#777",
          fontSize: "13px",
        }}
      >
        © {new Date().getFullYear()} OltenitaImobiliare.ro — Toate drepturile rezervate.
      </p>
    </footer>
  );
};

// 🔹 Stiluri reutilizabile
const linkStyle = {
  color: "#444",
  textDecoration: "none",
  fontSize: "15px",
};
const inputStyle = {
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontSize: "14px",
  width: "100%",
  outline: "none",
};

export default Footer;
