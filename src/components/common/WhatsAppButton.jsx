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
      className="
        fixed
        bottom-5
        right-5
        md:bottom-6
        md:right-6
        z-40
        flex
        h-14
        w-14
        md:h-16
        md:w-16
        items-center
        justify-center
        rounded-full
        bg-[#25D366]
        text-white
        shadow-lg
        transition-all
        duration-300
        hover:scale-110
      "
    >
      <FaWhatsapp className="text-[28px] md:text-[32px]" />
    </a>
  );
}