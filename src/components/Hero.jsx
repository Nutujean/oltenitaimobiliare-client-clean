export default function Hero() {
  return (
    <section
      className="relative h-[600px] flex items-center justify-center text-center text-white"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* overlay semi-transparent */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 px-4 w-full max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Anunțuri imobiliare în Oltenița
        </h1>
        <p className="max-w-2xl mx-auto text-lg mb-8">
          Cumpără, vinde sau închiriază apartamente, case, terenuri și spații comerciale în Oltenița și împrejurimi.
        </p>

        {/* Formular căutare rapidă */}
        <div className="bg-white rounded-lg shadow-md p-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-gray-800">
          <input
            type="text"
            placeholder="Caută..."
            className="border rounded px-3 py-2 w-full"
          />
          <select className="border rounded px-3 py-2 w-full">
            <option>Tip proprietate</option>
            <option>Apartament</option>
            <option>Casă</option>
            <option>Teren</option>
            <option>Garaj</option>
            <option>Spațiu comercial</option>
          </select>
          <input
            type="number"
            placeholder="Preț maxim (€)"
            className="border rounded px-3 py-2 w-full"
          />
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
            Caută
          </button>
        </div>
      </div>
    </section>
  );
}
