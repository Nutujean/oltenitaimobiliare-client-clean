import { useEffect, useState } from react;
import API_URL from ..api;
import ListingCard from ..componentsListingCard;
import { Helmet } from react-helmet-async;

export default function Case() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() = {
    window.scrollTo(0, 0);
    (async () = {
      const res = await fetch(`${API_URL}listings`);
      const data = await res.json();
      setListings(data.filter((x) = x.category === spatiu comercial));
      setLoading(false);
    })();
  }, []);

  return (
    div className=max-w-6xl mx-auto px-4 pt-24 pb-10
      Helmet
        titleSpatiu comercial de vânzare în Oltenița – Oltenița Imobiliaretitle
        meta
          name=description
          content=Vezi cele mai noi spatii comerciale de vânzare în Oltenița. Locuințe moderne, vile și case tradiționale – anunțuri actualizate zilnic.
        
      Helmet

      h1 className=text-3xl font-bold mb-4 text-gray-900
        🏠 Spatii comerciale de vânzare în Oltenița
      h1
      p className=text-gray-600 mb-6
        Descoperă cele mai recente anunțuri cu spatii comerciale de vânzare în Oltenița și
        împrejurimi. Alege spatiul potrivit pentru tine din ofertele locale.
      p

      {loading  (
        pSe încarcă...p
      )  listings.length  0  (
        div className=grid smgrid-cols-2 mdgrid-cols-3 gap-5
          {listings.map((l) = (
            ListingCard key={l._id} listing={l} 
          ))}
        div
      )  (
        pMomentan nu există spatii comerciale disponibile.p
      )}
    div
  );
}
