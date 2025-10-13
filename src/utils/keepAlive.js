export function startKeepAlive() {
  const backendUrl = "https://oltenitaimobiliare-backend.onrender.com/api/health";
  
  const ping = async () => {
    try {
      await fetch(backendUrl);
      console.log("🔁 Backend ping → OK");
    } catch (err) {
      console.warn("⚠️ Backend ping failed:", err.message);
    }
  };

  // prima execuție imediat
  ping();
  // apoi la fiecare 10 minute
  setInterval(ping, 10 * 60 * 1000);
}
