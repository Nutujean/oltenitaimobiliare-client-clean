import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginSMS() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const API = "https://api.oltenitaimobiliare.ro/api/phone";

  // 🔔 Afișează notificare
  const showToast = (text, type = "info") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* =======================================================
     1️⃣ Trimite codul OTP
  ======================================================= */
  const sendOtp = async () => {
    if (!phone) return showToast("📱 Introdu numărul de telefon.", "error");

    const normalized = phone.replace(/\D/g, "").replace(/^0/, "40");
    showToast("⏳ Se trimite SMS...");

    try {
      const res = await fetch(`${API}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalized }),
      });
      const data = await res.json();

      if (data.success) {
        showToast("📲 Codul a fost trimis. Verifică telefonul!", "success");
        setStep(2);
      } else {
        showToast(data.error || "❌ Eroare la trimiterea SMS-ului", "error");
      }
    } catch (err) {
      showToast("❌ Eroare server: " + err.message, "error");
    }
  };

  /* =======================================================
     2️⃣ Verifică codul OTP (login/register)
  ======================================================= */
  const verifyOtp = async () => {
    if (!code) return showToast("🔢 Introdu codul primit prin SMS.", "error");

    const normalized = phone.replace(/\D/g, "").replace(/^0/, "40");
    showToast("🔍 Se verifică codul...");

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
        showToast("✅ Autentificare reușită! Redirecționare...", "success");
        setTimeout(() => navigate("/profil"), 1500);
      } else {
        showToast(data.error || "❌ Cod incorect sau expirat", "error");
      }
    } catch (err) {
      showToast("❌ Eroare server: " + err.message, "error");
    }
  };

  /* =======================================================
     🧩 UI
  ======================================================= */
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 relative">
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
              placeholder="Introdu codul primit"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border border-gray-300 rounded-lg w-full p-3 mb-4 text-center focus:ring-2 focus:ring-green-500 focus:outline-none"
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
              }}
              className="text-sm text-gray-600 mt-3 underline"
            >
              ↩️ Retrimite codul
            </button>
          </>
        )}
      </div>

      {/* 🔔 TOAST vizual */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg text-white shadow-lg ${
            toast.type === "success"
              ? "bg-green-600"
              : toast.type === "error"
              ? "bg-red-600"
              : "bg-blue-600"
          }`}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}
