import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterSMS() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [sentTo, setSentTo] = useState("");
  const navigate = useNavigate();

  const API = "https://api.oltenitaimobiliare.ro/api/phone";

  /* =======================================================
     1️⃣ Trimite codul OTP prin SMS
  ======================================================= */
  const sendOtp = async () => {
    if (!phone) return setMessage("📱 Introdu numărul de telefon.");

    const normalized = phone
      .replace(/[^\d]/g, "")
      .replace(/^0/, "+40")
      .replace(/^4/, "+4")
      .replace(/^40/, "+40");

    setMessage("⏳ Se trimite SMS...");

    try {
      const res = await fetch(`${API}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalized }),
      });

      const data = await res.json();

      if (data.success) {
        setSentTo(normalized);
        setMessage(`✅ Cod trimis către ${normalized}`);
        setStep(2);
      } else {
        setMessage("❌ " + (data.error || "Eroare la trimiterea SMS-ului."));
      }
    } catch (err) {
      console.error("❌ Eroare send-otp:", err);
      setMessage("Eroare de conexiune cu serverul.");
    }
  };

  /* =======================================================
     2️⃣ Verifică codul OTP și creează contul
  ======================================================= */
  const verifyOtp = async () => {
    if (!code) return setMessage("🔢 Introdu codul primit prin SMS.");

    const normalized = phone
      .replace(/[^\d]/g, "")
      .replace(/^0/, "+40")
      .replace(/^4/, "+4")
      .replace(/^40/, "+40");

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
        localStorage.setItem("userPhone", normalized);
        setMessage("✅ Înregistrare reușită! Redirecționare către profil...");
        setTimeout(() => navigate("/profil"), 1500);
      } else {
        setMessage("❌ " + (data.error || "Cod incorect sau expirat."));
      }
    } catch (err) {
      console.error("❌ Eroare verify-otp:", err);
      setMessage("Eroare la verificarea codului.");
    }
  };

  /* =======================================================
     UI
  ======================================================= */
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          📲 Înregistrare prin SMS
        </h2>

        {step === 1 && (
          <>
            <input
              type="tel"
              placeholder="07xxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-gray-300 rounded-lg w-full p-3 mb-4 text-center text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
            <p className="text-sm text-center text-gray-500 mb-2">
              Cod trimis către <strong>{sentTo}</strong>
            </p>
            <input
              type="number"
              placeholder="Introdu codul primit"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border border-gray-300 rounded-lg w-full p-3 mb-4 text-center text-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            <button
              onClick={verifyOtp}
              className="bg-green-600 text-white w-full py-3 rounded-lg font-semibold hover:bg-green-700 transition"
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
      </div>
    </div>
  );
}
