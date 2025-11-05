// src/utils/keepAlive.js
export function startKeepAlive() {
  const url = "https://api.oltenitaimobiliare.ro/api/health"; // ✅ Domeniu corect

  const ping = async () => {
    try {
      await fetch(url);
      console.log("🔁 Backend ping → OK");
    } catch (err) {
      console.warn("⚠️ Backend ping failed:", err.message);
    }
  };

  ping(); // pornește imediat
  setInterval(ping, 10 * 60 * 1000); // repetă la fiecare 10 minute
}
