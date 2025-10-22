import { useEffect, useState } from "react";
import API_URL from "../api";
import ListingCard from "../components/ListingCard";
import { Helmet } from "react-helmet-async";

export default function Apartamente() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      const res = await fetch(`${API_URL}/listings`);
      const data = await res.json();
      setListings(data.filter((x) => x.category === "apartamente"));
      setLoading(false);
    })();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 pt-24 pb-10">
      <Helmet>
        <title>Apartamente de vânzare în Oltenița – Oltenița Imobiliare</title>
        <meta
          name="description"
          content="Caută apartamente de vânzare în Oltenița. Anunțuri actualizate zilnic, direct de la proprietari și agenții locale."
        />
      </Helmet>

      <h1 className="text-3xl font-bold mb-4 text-gray-900">
        🏢 Apartamente de vânzare în Oltenița
      </h1>
      <p className="text-gray-600 mb-6">
        Găsește apartamente de vânzare și închiriere în Oltenița, potrivite
        pentru orice buget sau zonă. Verifică ofertele actualizate zilnic.
      </p>

      {loading ? (
        <p>Se încarcă...</p>
      ) : listings.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {listings.map((l) => (
            <ListingCard key={l._id} listing={l} />
          ))}
        </div>
      ) : (
        <p>Momentan nu există apartamente disponibile.</p>
      )}
    </div>
  );
}
