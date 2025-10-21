// src/components/ShareBar.jsx
import React from "react";
import { FaFacebook, FaWhatsapp, FaFacebookMessenger, FaLink } from "react-icons/fa";

const ShareBar = ({ listing }) => {
  if (!listing?._id) return null;

  const shareUrl = `https://oltenitaimobiliare.ro/share/${listing._id}`;
  const directUrl = `https://oltenitaimobiliare.ro/anunt/${listing._id}`;

  const handleFacebookShare = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, "facebook-share-dialog", "width=800,height=600");
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `Vezi acest anunț pe Oltenita Imobiliare:\n${directUrl}`
    )}`;
    window.open(waUrl, "_blank");
  };

  const handleMessengerShare = () => {
    const msgrUrl = `fb-messenger://share?link=${encodeURIComponent(directUrl)}`;
    window.open(msgrUrl, "_blank");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directUrl);
    alert("🔗 Link-ul anunțului a fost copiat în clipboard!");
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mt-4">
      {/* Facebook */}
      <button
        onClick={handleFacebookShare}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md transition-all"
      >
        <FaFacebook size={18} />
        <span>Facebook</span>
      </button>

      {/* WhatsApp */}
      <button
        onClick={handleWhatsAppShare}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md transition-all"
      >
        <FaWhatsapp size={18} />
        <span>WhatsApp</span>
      </button>

      {/* Messenger */}
      <button
        onClick={handleMessengerShare}
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md transition-all"
      >
        <FaFacebookMessenger size={18} />
        <span>Messenger</span>
      </button>

      {/* Copiază link */}
      <button
        onClick={handleCopyLink}
        className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md transition-all"
      >
        <FaLink size={18} />
        <span>Copiază link</span>
      </button>
    </div>
  );
};

export default ShareBar;
