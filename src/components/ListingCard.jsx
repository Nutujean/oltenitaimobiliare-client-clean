import { Link } from "react-router-dom";

export default function ListingCard({ listing }) {
  const isPromoted =
    listing.featuredUntil &&
    new Date(listing.featuredUntil).getTime() > Date.now();

  return (
    <div className="relative bg-white border rounded-xl overflow-hidden shadow hover:shadow-lg transition">
      <Link to={`/anunt/${listing._id}`}>
        <div className="relative">
          <img
            src={
              listing.images?.[0] ||
              listing.imageUrl ||
              "https://via.placeholder.com/400x250?text=Fără+imagine"
            }
            alt={listing.title}
            className="w-full h-48 object-cover"
          />

          {/* 💎 Badge Promovat */}
          {isPromoted && (
            <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-lg shadow-md flex items-center gap-1">
              💎 Promovat
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <h2 className="text-lg font-semibold mb-1">{listing.title}</h2>
        <p className="text-gray-600 text-sm mb-2">{listing.location}</p>
        <p className="text-blue-700 font-bold text-lg">{listing.price} €</p>
      </div>
    </div>
  );
}
