import { useEffect, useState } from "react";

export default function CookiesConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookiesAccepted");
    if (!accepted) {
      setTimeout(() => setVisible(true), 1200); // apare după 1.2s
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-md p-4 z-50 flex flex-col sm:flex-row justify-between items-center gap-3 animate-slide-up">
      <p className="text-sm text-gray-700 text-center sm:text-left">
        Folosim cookie-uri pentru a îmbunătăți experiența pe site și pentru analize de trafic.
        Prin continuarea navigării, ești de acord cu{" "}
        <a href="/cookies" className="text-blue-600 hover:underline">
          Politica de Cookies
        </a>.
      </p>
      <button
        onClick={acceptCookies}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Accept
      </button>
    </div>
  );
}
