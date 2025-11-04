import { useState, useEffect } from "react";

export default function CookiesConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookiesAccepted");
    if (!consent) setVisible(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 text-sm flex flex-col sm:flex-row items-center justify-between shadow-lg z-50">
      <p className="mb-2 sm:mb-0 text-center sm:text-left">
        Folosim cookie-uri pentru a-ți oferi o experiență mai bună pe site.
        Continuând navigarea, ești de acord cu{" "}
        <a
          href="/confidentialitate"
          className="underline text-blue-400 hover:text-blue-300"
        >
          politica noastră de confidențialitate
        </a>.
      </p>
      <button
        onClick={acceptCookies}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Accept
      </button>
    </div>
  );
}
