import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterSMS() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();

  const API = "https://api.oltenitaimobiliare.ro/api/phone";

  /* =======================================================
     1️⃣ Trimite cod OTP (cu timer de 60s)
  ======================================================= */
  const sendOtp = async () => {
    if (!phone) return setMessage("📱 Introdu numărul de telefon.");

    const normalized = phone.replace(/\D/g, "");
    if (!/^07\d{8}$/.test(normalized))
      return setMessage("⚠️ Număr invalid. Folosește formatul 07xxxxxxxx");

    setMessage("⏳ Se trimite SMS...");
    setCooldown(60);

    try {
      const res = await fetch(`${API}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalized }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("✅ Cod trimis! Verifică SMS-ul.");
        setStep(2);
      } else {
        setMessage("❌ " + (data.error || "Eroare la trimiterea SMS-ului."));
        setCooldown(0);
      }
    } catch (err) {
      setMessage("❌ Eroare server: " + err.message);
      setCooldown(0);
    }
  };

  /* =======================================================
     2️⃣ Verificare OTP + creare cont
  ======================================================= */
  const verifyOtp = async () => {
    if (!code) return setMessage("🔢 Introdu codul primit prin SMS.");
    setMessage("🔍 Se verifică codul...");

    try {
      const res = await fetch(`${API}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code, name, email }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setMessage("🎉 Cont creat cu succes! Redirecționare...");
        setTimeout(() => navigate("/profil"), 2000);
      } else {
        setMessage("❌ " + (data.error || "Cod invalid sau expirat."));
      }
    } catch (err) {
      setMessage("❌ Eroare server: " + err.message);
    }
  };

  /* =======================================================
     🕒 Timer retrimitere cod
  ======================================================= */
  useEffect(() => {
    if (cooldown > 0) {
      const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [cooldown]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          📝 Înregistrare cont nou
        </h2>

        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="Nume complet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-lg w-full p-3 mb-3 text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Adresa de email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-lg w-full p-3 mb-3 text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="tel"
              placeholder="07xxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-gray-300 rounded-lg w-full p-3 mb-4 text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            <button
              onClick={sendOtp}
              disabled={cooldown > 0}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                cooldown > 0
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {cooldown > 0
                ? `Retrimite în ${cooldown}s`
                : "Trimite codul de verificare"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Introdu codul primit"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border border-gray-300 rounded-lg w-full p-3 mb-4 text-center focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            <button
              onClick={verifyOtp}
              className="bg-green-600 text-white w-full py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Verifică și finalizează înregistrarea
            </button>

            <button
              onClick={() => {
                setStep(1);
                setCode("");
                setMessage("");
              }}
              disabled={cooldown > 0}
              className={`text-sm mt-3 underline ${
                cooldown > 0 ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {cooldown > 0
                ? `Retrimite în ${cooldown}s`
                : "Retrimite codul"}
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
