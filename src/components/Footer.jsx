import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#0a58ca",
        color: "white",
        padding: "30px 15px 20px",
        marginTop: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "25px",
          alignItems: "start",
        }}
      >
        {/* 🏠 Descriere site */}
        <div style={{ textAlign: "center" }}>
          <h3
            style={{
              fontSize: "18px",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            Oltenița Imobiliare 🏠
          </h3>
          <p
            style={{
              lineHeight: "1.6",
              fontSize: "14px",
              maxWidth: "400px",
              margin: "0 auto",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            Platformă locală de anunțuri imobiliare pentru Oltenița și
            împrejurimi. Găsește rapid apartamente, case, terenuri și spații
            comerciale — totul simplu, rapid și sigur.
          </p>
        </div>

        {/* 🔗 Linkuri utile */}
        <div style={{ textAlign: "center" }}>
          <h4
            style={{
              marginBottom: "8px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Linkuri utile
          </h4>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              lineHeight: "1.6",
              fontSize: "14px",
              margin: 0,
            }}
          >
            <li><a href="/despre-noi" style={linkStyle}>Despre noi</a></li>
            <li><a href="/termeni" style={linkStyle}>Termeni și condiții</a></li>
            <li><a href="/confidentialitate" style={linkStyle}>Confidențialitate</a></li>
            <li><a href="/cookies" style={linkStyle}>Cookies</a></li>
            <li><a href="/contact" style={linkStyle}>Contact</a></li>
          </ul>
        </div>

        {/* 📬 Formular contact */}
        <div style={{ textAlign: "center" }}>
          <h4
            style={{
              marginBottom: "8px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Trimite-ne un mesaj
          </h4>
          <form
            action="https://formsubmit.co/oltenitaimobiliare@gmail.com"
            method="POST"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              maxWidth: "280px",
              margin: "0 auto",
            }}
          >
            <input type="text" name="name" placeholder="Numele tău" required style={inputStyle} />
            <input type="email" name="email" placeholder="Emailul tău" required style={inputStyle} />
            <textarea name="message" placeholder="Mesajul tău" rows="3" required style={inputStyle}></textarea>
            <button
              type="submit"
              style={{
                backgroundColor: "white",
                color: "#0a58ca",
                border: "none",
                borderRadius: "6px",
                padding: "8px 0",
                fontWeight: "bold",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Trimite
            </button>
          </form>
        </div>
      </div>

      {/* 💙 Text subsol */}
      <p
        style={{
          textAlign: "center",
          fontSize: "14px",
          marginTop: "25px",
          color: "rgba(255,255,255,0.9)",
          fontWeight: "500",
          lineHeight: "1.4",
        }}
      >
        Creat din <span style={{ color: "#ffcccc" }}>❤️</span> pentru Oltenița
      </p>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid rgba(255,255,255,0.3)",
          margin: "15px auto",
          maxWidth: "800px",
        }}
      />

      <p
        style={{
          textAlign: "center",
          fontSize: "12px",
          opacity: "0.85",
          marginTop: "5px",
        }}
      >
        © {new Date().getFullYear()} OltenitaImobiliare.ro — Toate drepturile rezervate.
      </p>

      {/* 📱 Responsive CSS */}
      <style>
        {`
          @media (max-width: 768px) {
            footer {
              padding: 25px 10px 15px;
            }
            footer h3 {
              font-size: 16px !important;
            }
            footer p {
              font-size: 13px !important;
            }
            footer h4 {
              font-size: 15px !important;
            }
          }
        `}
      </style>
    </footer>
  );
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
};

const inputStyle = {
  padding: "8px",
  borderRadius: "5px",
  border: "none",
  fontSize: "13px",
  outline: "none",
  width: "100%",
};

export default Footer;
