import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://oltenitaimobiliare-backend.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error("Eroare la login");

      const data = await res.json();
      localStorage.setItem("token", data.token);
      alert("Logare reușită!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Email sau parolă incorectă!");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Autentificare</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 space-y-6"
      >
        {/* Email */}
        <div>
          <label className="block font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>

        {/* Parola */}
        <div>
          <label className="block font-medium mb-2">Parolă</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>

        {/* Buton */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>

        <p className="text-center text-sm mt-4">
          Nu ai cont?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Înregistrează-te
          </Link>
        </p>
      </form>
    </div>
  );
}
