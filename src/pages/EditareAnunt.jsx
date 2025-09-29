const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    });
    navigate(`/anunt/${id}`);
  } catch (error) {
    console.error("Eroare la actualizarea anunțului:", error);
  }
};
