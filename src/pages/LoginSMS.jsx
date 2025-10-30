import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginSMS() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const API = "https://api.oltenitaimobiliare.ro/api/phone";

  /* =======================================================
     1️⃣ Trimitere cod OTP
  ======================================================= */
  const sendOtp = async () => {
    if (!phone) return setMessage("📱 Introdu numărul de telefon.");

    const normalized = phone.replace(/\D/g, "").replace(/^0/, "4");
    setMessage("⏳ Se trimite SMS...");

    try {
      const res = await fetch(`${API}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalized }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("📲 Codul a fost trimis prin SMS. Verifică telefonul tău!");
        setStep(2);
      } else {
        setMessage("❌ " + (data.error || "Eroare la trimiterea SMS-ului."));
      }
    } catch (err) {
      console.error("Eroare la trimiterea OTP:", err);
      setMessage("❌ Eroare server. Încearcă din nou.");
    }
  };

  /* =======================================================
     2️⃣ Verificare cod OTP
  ======================================================= */
  const verifyOtp = async () => {
    if (!code) return setMessage("🔢 Introdu codul primit prin SMS.");

    const normalized = phone.replace(/\D/g, "").replace(/^0/, "4");
    setMessage("⏳ Se verifică codul...");

    try {
      const res = await fetch(`${API}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalized, code }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userPhone", data.user.phone);
        localStorage.setItem("userName", data.user.name);

        if (data.user.name.startsWith("Utilizator ")) {
          setMessage("👋 Bine ai venit! Completează-ți profilul.");
          setTimeout(() => navigate("/profil"), 1500);
        } else {
          setMessage("✅ Autentificare reușită! Redirecționare...");
          setTimeout(() => navigate("/profil"), 1000);
        }
      } else {
        setMessage("❌ " + (data.error || "Cod incorect sau expirat."));
      }
    } catch (err) {
      console.error("Eroare verificare OTP:", err);
      setMessage("❌ Eroare server la verificarea codului.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          🔐 Autentificare / Înregistrare prin SMS
        </h2>

        {step === 1 && (
          <>
            <input
              type="tel"
              placeholder="07xxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-gray-300 rounded-lg w-full p-3 mb-4 text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              onClick={sendOtp}
              className="bg-blue-600 text-white w-full py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Trimite codul de verificare
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Introdu codul primit prin SMS"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border border-gray-300 rounded-lg w-full p-3 mb-4 text-center focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            <button
              onClick={verifyOtp}
              className="bg-green-600 text-white w-full py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Verifică și conectează-te
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
      </div>
    </div>
  );
}
