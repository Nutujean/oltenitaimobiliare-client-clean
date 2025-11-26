// src/pages/LoginSMS.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoginSMS() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // dacă URL-ul conține "inregistrare", știm că e pagină de înregistrare
  const isRegister = location.pathname.includes("inregistrare");

  const API = "https://api.oltenitaimobiliare.ro/api/phone";

  // 🔹 Trimite codul OTP (login sau înregistrare)
  const sendOtp = async () => {
    if (!phone) return setMessage("📱 Introdu numărul de telefon.");

    const normalized = phone.replace(/\D/g, "");
    if (!/^07\d{8}$/.test(normalized)) {
      return setMessage("❌ Număr invalid (format 07xxxxxxxx)");
    }

    setMessage("⏳ Se trimite SMS...");

    try {
      const res = await fetch(`${API}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: normalized,
          mode: isRegister ? "register" : "login",
        }),
      });

      const data = await res.json();
      const errText = (data.error || "").toString();

      // 🧠 1) Backend vechi: "Mod invalid. Trebuie 'login' sau 'register'."
      if (errText.includes("Mod invalid")) {
        if (isRegister) {
          // suntem pe ÎNREGISTRARE → înseamnă că există deja cont pe numărul ăsta
          setMessage(
            "ℹ️ Există deja un cont creat cu acest număr de telefon.\n" +
            "Te redirecționăm către pagina de autentificare..."
          );
          setTimeout(() => {
            setMessage("");
            setStep(1);
            navigate("/login");
          }, 2000);
        } else {
          // suntem pe LOGIN → înseamnă că nu e configurat corect mod-ul sau nu există cont
          setMessage(
            "ℹ️ Acest număr nu este încă înregistrat.\n" +
            "Creează un cont nou pentru a putea posta sau gestiona anunțuri."
          );
        }
        return;
      }

      // 🧠 2) Caz: user încearcă ÎNREGISTRARE dar există deja cont
      if (
        (!res.ok || !data.success) &&
        isRegister &&
        (
          data.mustLogin ||
          errText.toLowerCase().includes("există deja un cont creat") ||
          errText.toLowerCase().includes("exista deja un cont")
        )
      ) {
        setMessage(
          "ℹ️ Există deja un cont creat cu acest număr de telefon.\n" +
          "Te redirecționăm către pagina de autentificare..."
        );
        setTimeout(() => {
          setMessage("");
          setStep(1);
          navigate("/login");
        }, 2000);
        return;
      }

      // 🧠 3) Caz: user încearcă LOGIN dar nu există cont
      if (
        (!res.ok || !data.success) &&
        !isRegister &&
        (
          data.mustRegister ||
          errText.toLowerCase().includes("nu este înregistrat") ||
          errText.toLowerCase().includes("nu există niciun cont")
        )
      ) {
        setMessage(
          "ℹ️ Acest număr nu este încă înregistrat.\n" +
          "Creează un cont nou pentru a putea posta sau gestiona anunțuri."
        );
        return;
      }

      // 🧠 4) Dacă e altă eroare
      if (!res.ok || !data.success) {
        setMessage("❌ " + (data.error || "A apărut o eroare la trimiterea SMS-ului"));
        return;
      }

      // ✅ Totul ok
      setMessage("📲 Codul a fost trimis! Verifică telefonul.");
      setStep(2);
    } catch (err) {
      setMessage("❌ Eroare server: " + err.message);
    }
  };

  // 🔹 Verificare OTP
  const verifyOtp = async () => {
    if (!code) return setMessage("Introdu codul primit prin SMS.");

    const normalized = phone.replace(/\D/g, "");
    setMessage("⏳ Se verifică...");

    try {
      const res = await fetch(`${API}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalized, code }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        if (data.user?.phone) {
          localStorage.setItem("userPhone", data.user.phone);
        }
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        setMessage("✅ Verificare reușită! Redirecționare...");

        setTimeout(() => {
          navigate("/anunturile-mele");
        }, 1500);
      } else {
        setMessage("❌ " + (data.error || "Cod incorect sau expirat"));
      }
    } catch (err) {
      setMessage("❌ Eroare server: " + err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          {isRegister ? "🆕 Înregistrare prin SMS" : "🔐 Autentificare prin SMS"}
        </h2>

        {step === 1 ? (
          <>
            <input
              type="tel"
              placeholder="07xxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-gray-300 rounded-lg w-full p-3 mb-4 text-center focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendOtp}
              className="bg-blue-600 text-white w-full py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              {isRegister
                ? "Trimite codul de înregistrare"
                : "Trimite codul de autentificare"}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Introdu codul primit"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border border-gray-300 rounded-lg w-full p-3 mb-4 text-center focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={verifyOtp}
              className="bg-green-600 text-white w-full py-3 rounded-lg font-semibold hover:bg-green-700"
            >
              Verifică codul
            </button>

            <button
              onClick={() => {
                setStep(1);
                setCode("");
                setMessage("");
              }}
              className="text-sm text-gray-600 mt-3 underline"
            >
              Retrimite codul
            </button>
          </>
        )}

        {message && (
          <p className="mt-4 text-center text-gray-700 whitespace-pre-line">
            {message}
          </p>
        )}

        {/* 🔹 Banner jos: schimbare între login / înregistrare */}
        <div className="mt-6 text-center text-sm text-gray-600 border-t pt-4">
          {isRegister ? (
            <p>
              Ai deja cont?{" "}
              <button
                type="button"
                onClick={() => {
                  setMessage("");
                  setStep(1);
                  navigate("/login");
                }}
                className="text-blue-600 font-semibold underline"
              >
                Autentifică-te aici
              </button>
            </p>
          ) : (
            <p>
              Nu ai încă un cont?{" "}
              <button
                type="button"
                onClick={() => {
                  setMessage("");
                  setStep(1);
                  navigate("/inregistrare");
                }}
                className="text-blue-600 font-semibold underline"
              >
                Creează un cont nou
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
