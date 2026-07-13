import { FaWhatsapp } from "react-icons/fa";
export default function WhatsAppButton() {
  const phoneNumber = "919761452901";

  const message =
    "Hello Tashekari, I would like to know more about your handmade products.";

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Tashekari on WhatsApp"
     className="fixed bottom-6 right-6 z-[9997] flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_15px_35px_rgba(37,211,102,0.35)] transition-all duration-300 hover:scale-110 hover:shadow-[0_20px_45px_rgba(37,211,102,0.5)]"
    >
      <FaWhatsapp size={30} />
    </a>
  );
}