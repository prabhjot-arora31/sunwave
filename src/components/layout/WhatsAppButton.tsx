import { Phone, MessageCircle } from "lucide-react";
import { company } from "@/data/site";

export default function WhatsAppButton() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      <a
        href={`tel:${company.phone.replace(/\s/g, "")}`}
        aria-label="Call us"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-900 text-white shadow-lg shadow-sky-900/30 hover:scale-105 transition-transform"
      >
        <Phone className="h-6 w-6" />
      </a>
      <a
        href={`https://wa.me/${company.whatsapp}?text=Hi%20Sun%20Wave%2C%20I%20am%20interested%20in%20a%20solar%20system%20for%20my%20property.`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 hover:scale-105 transition-transform"
      >
        <MessageCircle className="h-6 w-6" fill="white" />
      </a>
    </div>
  );
}
