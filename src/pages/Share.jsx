// src/pages/Share.jsx
import { useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import API_URL from "../api";

export default function Share() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/listings/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Eroare la preluare anunț");
        setListing(data);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [id]);

  if (error) return <h2 style={{ textAlign: "center", marginTop: 50 }}>Eroare: {error}</h2>;
  if (!listing) return <p style={{ textAlign: "center", marginTop: 50 }}>Se încarcă...</p>;

  const image =
    listing.images?.[0] ||
    listing.imageUrl ||
    "https://oltenitaimobiliare.ro/preview.jpg";

  const title = listing.title || "Anunț imobiliar din Oltenița";
  const desc =
    listing.description?.substring(0, 150) ||
    "Vezi detalii despre acest anunț imobiliar din Oltenița și împrejurimi.";

  // ✅ Facebook citește OG tags de aici, apoi redirectăm spre anunț real
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:image" content={image} />
        <meta
          property="og:url"
          content={`https://oltenitaimobiliare.ro/share/${listing._id}`}
        />
        <meta property="og:type" content="article" />
      </Helmet>
      <Navigate to={`/anunt/${listing._id}`} replace />
    </>
  );
}
