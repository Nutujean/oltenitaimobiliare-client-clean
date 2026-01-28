import React, { useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../api"; // păstrat ca la tine
import anpcSal from "../assets/anpc-sal.png";
import anpcSol from "../assets/anpc-sol.png";

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

  const statusColor = statusMsg.startsWith("✅")
    ? "text-emerald-300"
    : statusMsg.startsWith("⚠️")
    ? "text-yellow-200"
    : "text-red-200";

  return (
    <footer className="mt-16 bg-[#0b1220] text-gray-300">
      {/* TOP */}
      <div className="max-w-7xl mx-auto px-5 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* 🏠 Brand */}
          <div>
            <h3 className="text-white text-xl font-bold mb-3">
              Oltenița Imobiliare
            </h3>

            <p className="text-sm leading-relaxed text-gray-400">
              OltenițaImobiliare.ro este platforma locală de anunțuri imobiliare pentru Oltenița și împrejurimi. 
              Publică GRATUIT sau promovează-ți anunțul pentru vizibilitate maximă și contacte mai rapide, simplu și rapid.
            </p>

            {/* Contact scurt */}
            <div className="mt-5 space-y-2 text-sm text-gray-400">
              <p>
                Email:{" "}
                <a
                  href="mailto:oltenitaimobiliare@gmail.com"
                  className="text-gray-200 hover:text-white underline-offset-4 hover:underline"
                >
                  oltenitaimobiliare@gmail.com
                </a>
              </p>
              <p>Oltenița, Călărași</p>
            </div>

            {/* Social (pune linkurile tale reale) */}
            <div className="mt-5 flex gap-3">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-200"
              >
                Facebook
              </a>
              <a
                href="https://www.tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-200"
              >
                TikTok
              </a>
            </div>

            {/* ✅ ANPC / SAL / SOL (corect în cardul Brand + culori pentru dark footer) */}
            <div className="mt-6 border-t border-white/10 pt-6">
              <div className="flex flex-col items-start gap-3">
                <a
                  href="https://anpc.ro/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-gray-200 hover:text-white underline underline-offset-4"
                >
                  ANPC – Autoritatea Națională pentru Protecția Consumatorilor
                </a>

                <div className="flex flex-wrap items-center gap-4">
                  {/* SAL */}
                  <a
                    href="https://anpc.ro/ce-este-sal/"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white/5 rounded-xl border border-white/10 p-2 hover:bg-white/10 transition"
                    aria-label="Soluționarea Alternativă a Litigiilor (SAL) – ANPC"
                    title="Soluționarea Alternativă a Litigiilor (SAL) – ANPC"
                  >
                    <img
                      src={anpcSal}
                      alt="ANPC – Soluționarea Alternativă a Litigiilor (SAL)"
                      className="h-14 w-auto"
                      loading="lazy"
                    />
                  </a>

                  {/* SOL */}
                  <a
                    href="https://consumer-redress.ec.europa.eu/site-relocation_en"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white/5 rounded-xl border border-white/10 p-2 hover:bg-white/10 transition"
                    aria-label="Soluționarea Online a Litigiilor (SOL) – UE"
                    title="Soluționarea Online a Litigiilor (SOL) – UE"
                  >
                    <img
                      src={anpcSol}
                      alt="Soluționarea Online a Litigiilor (SOL)"
                      className="h-14 w-auto"
                      loading="lazy"
                    />
                  </a>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed">
                  Notă: Platforma europeană ODR (SOL) a fost închisă începând cu
                  20 iulie 2025; linkul de mai sus indică alternativa oficială
                  („Consumer Redress”).
                </p>
              </div>
            </div>
          </div>

          {/* 🔗 Linkuri utile + CTA */}
          <div>
            <h4 className="font-semibold mb-3 text-white">Linkuri utile</h4>

            <ul className="space-y-2 text-sm">
              <li>
                <Link className="hover:text-white" to="/despre-noi">
                  Despre noi
                </Link>
              </li>

              <li>
                <Link className="hover:text-white" to="/cum-adaugi">
                  Cum adaugi un anunț
                </Link>
              </li>

              <li>
                <Link className="hover:text-white" to="/termeni">
                  Termeni și condiții
                </Link>
              </li>

              <li>
                <Link className="hover:text-white" to="/confidentialitate">
                  Politica de confidențialitate
                </Link>
              </li>

              <li>
                <Link className="hover:text-white" to="/cookies">
                  Politica cookies
                </Link>
              </li>

              {/* 🔥 Promovare – evidențiat */}
              <li className="pt-2">
                <Link
                  to="/promovare"
                  className="inline-block bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-4 py-2 rounded-lg transition"
                >
                  ⭐ Vezi detalii promovare
                </Link>
              </li>

              <li>
                <Link className="hover:text-white" to="/contact">
                  Contact
                </Link>
              </li>
            </ul>

            {/* CTA mic, ca pe site-urile mari */}
            <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-sm text-gray-200 font-semibold">
                Postează rapid
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Adaugă un anunț în 1 minut.
              </p>

              <Link
                to="/adauga-anunt"
                className="mt-3 inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg"
              >
                ➕ Postează anunț gratuit
              </Link>
            </div>
          </div>

          {/* 📬 Formular contact */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">
              Trimite-ne un mesaj
            </h4>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Numele tău"
                required
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-400 outline-none focus:border-white/25"
              />
              <input
                type="email"
                name="email"
                placeholder="Emailul tău (obligatoriu)"
                required
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-400 outline-none focus:border-white/25"
              />
              <textarea
                name="message"
                placeholder="Mesajul tău"
                rows="4"
                required
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-400 outline-none focus:border-white/25"
              />

              <button
                type="submit"
                className="w-full bg-white text-[#0b1220] font-bold py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Trimite
              </button>

              {statusMsg && (
                <p className={`text-center text-sm font-medium ${statusColor}`}>
                  {statusMsg}
                </p>
              )}
            </form>

            <p className="mt-4 text-xs text-gray-400 leading-relaxed">
              Prin trimiterea mesajului ești de acord cu{" "}
              <Link
                className="text-gray-200 hover:text-white underline"
                to="/confidentialitate"
              >
                Politica de confidențialitate
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} OltenitaImobiliare.ro — Toate drepturile
            rezervate.
          </p>

          <p className="text-sm text-gray-400">
            Creat din <span className="text-red-300">❤️</span> pentru Oltenița
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;