<div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6 p-6">
  <div
    onClick={() => filterByCategory("Apartament")}
    className="cursor-pointer bg-white shadow hover:shadow-lg rounded-lg p-4 text-center"
  >
    <img
      src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80"
      alt="Apartamente"
      className="mx-auto mb-2 rounded h-28 w-full object-cover"
    />
    <h3 className="font-semibold">Apartamente</h3>
  </div>

  <div
    onClick={() => filterByCategory("Casă")}
    className="cursor-pointer bg-white shadow hover:shadow-lg rounded-lg p-4 text-center"
  >
    <img
      src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=400&q=80"
      alt="Case"
      className="mx-auto mb-2 rounded h-28 w-full object-cover"
    />
    <h3 className="font-semibold">Case</h3>
  </div>

  <div
    onClick={() => filterByCategory("Teren")}
    className="cursor-pointer bg-white shadow hover:shadow-lg rounded-lg p-4 text-center"
  >
    <img
      src="https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=400&q=80"
      alt="Terenuri"
      className="mx-auto mb-2 rounded h-28 w-full object-cover"
    />
    <h3 className="font-semibold">Terenuri</h3>
  </div>

  <div
    onClick={() => filterByCategory("Garaj")}
    className="cursor-pointer bg-white shadow hover:shadow-lg rounded-lg p-4 text-center"
  >
    <img
      src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=400&q=80"
      alt="Garaje"
      className="mx-auto mb-2 rounded h-28 w-full object-cover"
    />
    <h3 className="font-semibold">Garaje</h3>
  </div>

  <div
    onClick={() => filterByCategory("Spațiu comercial")}
    className="cursor-pointer bg-white shadow hover:shadow-lg rounded-lg p-4 text-center"
  >
    <img
      src="https://images.unsplash.com/photo-1598970434795-0c54fe7c0642?auto=format&fit=crop&w=400&q=80"
      alt="Spații comerciale"
      className="mx-auto mb-2 rounded h-28 w-full object-cover"
    />
    <h3 className="font-semibold">Spații comerciale</h3>
  </div>
</div>
