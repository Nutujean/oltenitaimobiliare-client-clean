import { useNavigate } from "react-router-dom";
import { FaHome, FaBuilding, FaTree, FaWarehouse, FaStore } from "react-icons/fa";

const categories = [
  { name: "Apartamente", icon: <FaBuilding />, slug: "apartamente" },
  { name: "Case", icon: <FaHome />, slug: "case" },
  { name: "Terenuri", icon: <FaTree />, slug: "terenuri" },
  { name: "Garsoniere", icon: <FaWarehouse />, slug: "garsoniere" },
  { name: "Spații comerciale", icon: <FaStore />, slug: "spatii" },
];

export default function Categories() {
  const navigate = useNavigate();

  const handleClick = (slug) => {
    navigate(`/search?category=${slug}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6 text-center">Categorii populare</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => handleClick(cat.slug)}
            className="flex flex-col items-center justify-center p-6 bg-white shadow rounded-xl hover:shadow-lg hover:bg-gray-50 transition"
          >
            <div className="text-3xl text-blue-600 mb-2">{cat.icon}</div>
            <span className="font-medium">{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
