import { SmallCards } from "../cards";

const steps = [
    {
      header: "Discover Your Event",
      text: "Browse thousands of events across music, tech, food, sports, and more. Filter by city, date, or price to find your perfect match.",
    },
    {
      header: "Choose & Checkout",
      text: "Select your ticket type and quantity, apply a promo code if you have one, then complete your secure payment in seconds.",
    },
    {
      header: "Arrive & Enjoy",
      text: "Your QR code lands in your inbox instantly. At the gate, just scan and walk in. No printouts, no hassle.",
    },
  ];

export default function TicketSteps() {
  
  return (
    <div className="bg-neutral-950 py-16 px-6 md:px-30 ">
      <h2 className="text-white text-2xl font-bold mb-2">
        Your ticket in 3 simple steps
      </h2>
      <p className="text-neutral-400 text-sm mb-8">
        No complicated processes, no long queues. TixO makes getting into your
        favourite events effortless.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <SmallCards
            key={i}
            cardNumber={i + 1}
            cardHeader={s.header}
            cardText={s.text}
          />
        ))}
      </div>
    </div>
  );
}
