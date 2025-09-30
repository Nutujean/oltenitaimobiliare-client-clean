import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function Home() {
  const categories = [
    {
      name: "Apartamente",
      img: "https://res.cloudinary.com/demo/image/upload/v12345/apartament.jpg",
    },
    {
      name: "Case",
      img: "https://res.cloudinary.com/demo/image/upload/v12345/casa.jpg",
    },
    {
      name: "Terenuri",
      img: "https://res.cloudinary.com/demo/image/upload/v12345/teren.jpg",
    },
    {
      name: "Garsoniere",
      img: "/garsoniera.jpg",
    },
    {
      name: "Garaje",
      img: "/garaj.jpg",
    },
    {
      name: "Spații comerciale",
      img: "/spatiu_comercial.jpg",
    },
  ];

  const optimizeImage = (url) => {
    if (!url || !url.includes("cloudinary.com")) return url;
    return url.replace("/upload/", "/upload/f_auto,q_auto/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Helmet>
        <title>Oltenița Imobiliare - Apartamente, case, terenuri</title>
        <meta
          name="description"
          content="Caută și adaugă anunțuri imobiliare în Oltenița și împrejurimi: apartamente, case, terenuri, garsoniere și spații comerciale."
        />
      </Helmet>

      {/* HERO SECTION */}
      <div
        className="relative h-[400px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Bine ai venit la Oltenița Imobiliare
          </h1>
          <p className="text-lg md:text-2xl text-gray-200">
            Vânzări, închirieri și anunțuri imobiliare în zona Oltenița
          </p>
        </div>
      </div>

      {/* CATEGORII */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Categorii populare
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/anunturi?categorie=${cat.name.toLowerCase()}`}
              className="relative rounded-xl overflow-hidden shadow-lg group cursor-pointer"
            >
              <img
                src={optimizeImage(cat.img)}
                alt={cat.name}
                className="w-full h-56 object-cover transform group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-xl font-bold text-white">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
