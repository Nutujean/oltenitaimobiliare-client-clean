import { Link } from "react-router-dom";
import { FaHome, FaBuilding, FaTree, FaWarehouse, FaStore } from "react-icons/fa";

export default function Categories() {
  const categories = [
    { name: "Apartamente", icon: <FaBuilding />, path: "/search?category=apartamente" },
    { name: "Case", icon: <FaHome />, path: "/search?category=case" },
    { name: "Terenuri", icon: <FaTree />, path: "/search?category=terenuri" },
    { name: "Garsoniere", icon: <FaWarehouse />, path: "/search?category=garsoniere" },
    { name: "Spații comerciale", icon: <FaStore />, path: "/search?category=spatii" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Categorii populare</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map((cat, index) => (
          <Link
            key={index}
            to={cat.path}
            className="flex flex-col items-center bg-white shadow rounded-xl p-6 hover:shadow-lg transition"
          >
            <div className="text-blue-600 text-3xl mb-2">{cat.icon}</div>
            <span className="font-medium">{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
