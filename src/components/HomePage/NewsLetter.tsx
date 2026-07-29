import { HugeIcons, Ticket02Icon } from "@/assets/icons";

export default function Newsletter() {
  return (
    <div className="relative bg-purple-500 py-16 px-6 w-full flex justify-center overflow-hidden">
      <Ticket02Icon
        className="absolute pointer-events-none"
        style={{
          width: "34%",
          aspectRatio: "1",
          top: "-30%",
          left: "-5%",
          transform: "rotate(15deg)",
          opacity: 0.6,
        }}
      />
      <HugeIcons
        className="absolute pointer-events-none"
        style={{
          width: "34%",
          aspectRatio: "1",
          top: "-50%",
          right: "-5%",
          transform: "rotate(15deg)",
          opacity: 0.6,
        }}
      />
 
      <div className="relative z-10 bg-neutral-950 rounded-xl p-8 max-w-lg w-full text-center flex flex-col gap-4">
        <h3 className="text-white text-xl font-bold">
          Never miss an event again
        </h3>
        <p className="text-neutral-400 text-sm">
          Get weekly roundups of the best events in your city, exclusive
          early-bird access, and promo codes — straight to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <input
            type="email"
            placeholder="Enter your email address"
            className="bg-neutral-900 w-full rounded-lg px-4 py-3 text-sm outline-none"
          />
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg text-sm font-medium">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}