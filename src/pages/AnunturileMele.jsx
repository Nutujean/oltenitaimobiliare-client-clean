import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingCard from "../components/ListingCard";

export default function AnunturileMele() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://oltenitaimobiliare-backend.onrender.com/api";

  // ✅ 1. verificăm autentificarea
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // ✅ 2. preluăm userul curent
    fetch(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Autentificare invalidă");
        return res.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch((err) => {
        console.error("Eroare utilizator:", err);
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  // ✅ 3. încărcăm anunțurile utilizatorului
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !user) return;

    fetch(`${API_URL}/listings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        // filtrăm doar anunțurile userului curent
        const myListings = data.filter((l) => l.user === user._id);
        setListings(myListings);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Eroare la încărcarea anunțurilor:", err);
        setLoading(false);
      });
  }, [user]);

  // ✅ 4. ștergere anunț
  const handleDeleteListing = async (id) => {
    const confirmDelete = window.confirm("Sigur vrei să ștergi acest anunț?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Trebuie să fii autentificat pentru a șterge un anunț.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setListings((prev) => prev.filter((l) => l._id !== id));
        alert("Anunțul a fost șters cu succes!");
      } else {
        alert(data.error || "Eroare la ștergere");
      }
    } catch (err) {
      console.error("Eroare ștergere:", err);
      alert("Eroare la comunicarea cu serverul.");
    }
  };

  if (loading) return <p className="text-center mt-6">Se încarcă anunțurile...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Anunțurile mele
      </h1>

      {!user ? (
        <p className="text-center text-gray-500">
          Trebuie să te <span className="text-blue-600 cursor-pointer" onClick={() => navigate("/login")}>autentifici</span> pentru a vedea anunțurile tale.
        </p>
      ) : listings.length === 0 ? (
        <p className="text-center text-gray-500">
          Nu ai publicat încă niciun anunț.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard
              key={listing._id}
              listing={listing}
              currentUser={user}
              onDelete={handleDeleteListing}
            />
          ))}
        </div>
      )}
    </div>
  );
}
