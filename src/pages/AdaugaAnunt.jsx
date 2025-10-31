import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdaugaAnunt = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const [formData, setFormData] = useState({
    titlu: "",
    descriere: "",
    pret: "",
    locatie: "",
    imagini: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, imagini: e.target.files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "imagini") {
          for (let i = 0; i < formData.imagini.length; i++) {
            data.append("imagini", formData.imagini[i]);
          }
        } else {
          data.append(key, formData[key]);
        }
      });

      const res = await axios.post(
        "https://oltenitaimobiliare-backend.onrender.com/api/listings",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (res.status === 200) {
        alert("✅ Anunțul tău a fost adăugat cu succes!");
        navigate("/anunturile-mele");
      }
    } catch (err) {
      console.error("Eroare la adăugarea anunțului:", err);
      alert("A apărut o eroare, te rugăm să încerci din nou.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Adaugă un anunț nou
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="titlu"
          placeholder="Titlul anunțului"
          value={formData.titlu}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
        <textarea
          name="descriere"
          placeholder="Descriere"
          value={formData.descriere}
          onChange={handleChange}
          className="w-full border rounded p-2"
          rows={4}
          required
        />
        <input
          type="number"
          name="pret"
          placeholder="Preț (lei)"
          value={formData.pret}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
        <input
          type="text"
          name="locatie"
          placeholder="Localitate / Zonă"
          value={formData.locatie}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Publică anunțul
        </button>
      </form>
    </div>
  );
};

export default AdaugaAnunt;
