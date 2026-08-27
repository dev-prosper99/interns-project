import { FlashIcon, GlobeIcon, KnightIcon } from "@/assets/icons";
import { SmallCards } from "../cards";

const features = [
    {
      icon: FlashIcon,
      header: "Instant Ticket Delivery",
      text: "Receive your tickets instantly via email with a unique QR code — no printing, no waiting, no stress.",
    },
    {
      icon: KnightIcon,
      header: "Safe & Secure Payments",
      text: "Every transaction is protected with bank-grade encryption. We support Paystack, Stripe, bank transfers, and USSD.",
    },
    {
      icon: GlobeIcon,
      header: "Events Across Nigeria",
      text: "From Lagos to Abuja, Ibadan to Jos — discover what's happening in your city and beyond.",
    },
  ];

export default function BuiltForNigerians() {
  
  return (
    <div className="bg-neutral-950 py-16 px-6 md:px-30">
      <h2 className="text-white text-2xl font-bold mb-2">
        Built for Nigerians, loved globally
      </h2>
      <p className="text-neutral-400 text-sm mb-8">
        TixO was designed from the ground up for the realities of Nigerian
        event-going and organizing.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <SmallCards
            key={i}
            icon={f.icon}
            cardHeader={f.header}
            cardText={f.text}
          />
        ))}
      </div>
    </div>
  );
}