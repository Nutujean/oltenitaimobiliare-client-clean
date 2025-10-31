import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterSMS() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const API = "https://api.oltenitaimobiliare.ro/api/phone";

  const sendOtp = async () => {
    if (!phone) return setMessage("📱 Introdu numărul de telefon.");
    setMessage("⏳ Se trimite SMS...");
    try {
      const res = await fetch(`${API}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.success) {
        setStep(2);
        setMessage("📲 Codul OTP a fost trimis.");
      } else setMessage("❌ " + data.error);
    } catch {
      setMessage("❌ Eroare server la trimiterea OTP.");
    }
  };

  const registerUser = async () => {
    if (!code) return setMessage("Introdu codul primit prin SMS.");
    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, code }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        navigate("/profil");
      } else setMessage("❌ " + data.error);
    } catch {
      setMessage("❌ Eroare server la înregistrare.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md border">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          📝 Înregistrare prin SMS
        </h2>

        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="Nume complet"
              className="border p-3 w-full mb-3 rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Adresa de email"
              className="border p-3 w-full mb-3 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="tel"
              placeholder="07xxxxxxxx"
              className="border p-3 w-full mb-4 rounded-lg"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button
              onClick={sendOtp}
              className="bg-blue-600 text-white w-full py-3 rounded-lg font-semibold"
            >
              Trimite codul
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Introdu codul OTP"
              className="border p-3 w-full mb-3 rounded-lg"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              onClick={registerUser}
              className="bg-green-600 text-white w-full py-3 rounded-lg font-semibold"
            >
              Finalizează înregistrarea
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
