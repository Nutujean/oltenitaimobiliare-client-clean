import React from "react";

const Footer = () => {
  // 📨 Funcția care trimite mesajul către backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    try {
      const res = await fetch(
        "https://oltenitaimobiliare-backend.onrender.com/api/contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("✅ Mesaj trimis cu succes! Mulțumim pentru mesaj!");
        e.target.reset();
      } else {
        alert("❌ " + (data.error || "Eroare la trimiterea mesajului."));
      }
    } catch (err) {
      alert("Eroare la conexiune cu serverul. Încearcă din nou mai târziu.");
    }
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
            Platforma locală de anunțuri imobiliare pentru Oltenița și
            împrejurimi. Găsește rapid apartamente, case, terenuri și spații
            comerciale disponibile în zonă. Totul simplu, rapid și sigur — locul
            unde fiecare proprietate își găsește cumpărătorul potrivit.
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
            <li>
              <a href="/contact" style={linkStyle}>
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* 📬 Formular contact direct prin backend */}
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
              placeholder="Emailul tău"
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
        </div>
      </div>

      {/* 💙 Text special */}
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

      {/* 🔹 Linie separatoare */}
      <hr
        style={{
          border: "none",
          borderTop: "1px solid rgba(255,255,255,0.3)",
          margin: "20px auto",
          maxWidth: "1000px",
        }}
      />

      {/* 🔹 Copyright */}
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
};

export default Footer;
