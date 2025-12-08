import React, { useState } from "react";
import API_URL from "../api"; // sus, ca în celelalte pagini

const Footer = () => {
  const [statusMsg, setStatusMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    // ✅ verificăm emailul — obligatoriu și format valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatusMsg("⚠️ Introdu o adresă de email validă.");
      setTimeout(() => setStatusMsg(""), 3000);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (res.ok) {
        e.target.reset();
        setStatusMsg("✅ Mesaj trimis cu succes! Mulțumim!");
      } else {
        setStatusMsg("❌ " + (data.error || "Eroare la trimiterea mesajului."));
      }
    } catch (err) {
      setStatusMsg("❌ Eroare la conexiune cu serverul. Încearcă mai târziu.");
    }

    setTimeout(() => setStatusMsg(""), 3000);
  };

  return (
    <footer
      style={{
        backgroundColor: "#0a58ca",
        color: "white",
        padding: "50px 20px 30px",
        marginTop: "60px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "40px",
        }}
      >
        {/* 🏠 Descriere site */}
        <div>
          <h3
            style={{
              fontSize: "20px",
              marginBottom: "10px",
              fontWeight: "bold",
            }}
          >
            Oltenița Imobiliare 🏠
          </h3>
          <p style={{ lineHeight: "1.7", fontSize: "15px" }}>
            Cea mai mare platforma locală de anunțuri imobiliare pentru Oltenița și
            împrejurimi.
          </p>
        </div>

        {/* 🔗 Linkuri utile */}
        <div>
          <h4
            style={{
              marginBottom: "12px",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Linkuri utile
          </h4>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              lineHeight: "1.8",
              fontSize: "15px",
            }}
          >
            <li>
              <a href="/despre-noi" style={linkStyle}>
                Despre noi
              </a>
            </li>

            {/* 🆕 Link Cum adaugi un anunț */}
            <li>
              <a href="/cum-adaugi" style={linkStyle}>
                Cum adaugi un anunț
              </a>
            </li>

            <li>
              <a href="/termeni" style={linkStyle}>
                Termeni și condiții
              </a>
            </li>
            <li>
              <a href="/confidentialitate" style={linkStyle}>
                Politica de confidențialitate
              </a>
            </li>
            <li>
              <a href="/cookies" style={linkStyle}>
                Politica cookies
              </a>
            </li>
          </ul>
        </div>

        {/* 📬 Formular contact */}
        <div>
          <h4
            style={{
              marginBottom: "12px",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Trimite-ne un mesaj
          </h4>
          <form
            onSubmit={handleSubmit}
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
              placeholder="Emailul tău (obligatoriu)"
              required
              style={inputStyle}
            />
            <textarea
              name="message"
              placeholder="Mesajul tău"
              rows="3"
              required
              style={inputStyle}
            ></textarea>
            <button
              type="submit"
              style={{
                backgroundColor: "white",
                color: "#0a58ca",
                border: "none",
                borderRadius: "6px",
                padding: "10px 0",
                fontWeight: "bold",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              Trimite
            </button>
          </form>

          {statusMsg && (
            <p
              style={{
                marginTop: "10px",
                color: statusMsg.startsWith("✅")
                  ? "#9effb2"
                  : statusMsg.startsWith("⚠️")
                  ? "#fff59d"
                  : "#ffcccc",
                fontWeight: "500",
                textAlign: "center",
              }}
            >
              {statusMsg}
            </p>
          )}
        </div>
      </div>

      <p
        style={{
          textAlign: "center",
          fontSize: "16px",
          marginTop: "50px",
          color: "rgba(255,255,255,0.95)",
          fontWeight: "500",
        }}
      >
        Creat din <span style={{ color: "#ffcccc" }}>❤️</span> pentru Oltenița
      </p>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid rgba(255,255,255,0.3)",
          margin: "20px auto",
          maxWidth: "1000px",
        }}
      />

      <p
        style={{
          textAlign: "center",
          fontSize: "14px",
          opacity: "0.9",
        }}
      >
        © {new Date().getFullYear()} OltenitaImobiliare.ro — Toate drepturile
        rezervate.
      </p>
    </footer>
  );
};

// 🔹 Stiluri generale
const linkStyle = {
  color: "white",
  textDecoration: "none",
};
const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "none",
  fontSize: "14px",
  outline: "none",
  width: "100%",
  color: "black",
};

export default Footer;
