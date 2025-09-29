const handleDelete = async () => {
  if (window.confirm("Sigur vrei să ștergi acest anunț?")) {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate("/");
    } catch (error) {
      console.error("Eroare la ștergere:", error);
    }
  }
};

const handleReserve = async () => {
  try {
    await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status: "rezervat" }),
    });
    setListing((prev) => ({ ...prev, status: "rezervat" }));
    alert("Anunțul a fost marcat ca rezervat ✅");
  } catch (error) {
    console.error("Eroare la actualizare:", error);
  }
};
