import { StarIcon } from "@/assets/icons";

const reviews = [
    {
      name: "Kemi Adeyemi",
      role: "Event Organiser, Lagos",
      text: "TixO transformed how I run my events. The analytics dashboard is incredible — I can see sales in real time.",
    },
    {
      name: "Emeka Nwosu",
      role: "Music Lover, Lagos",
      text: "I've used every ticketing platform in Nigeria. TixO is hands down the clearest experience.",
    },
    {
      name: "Hassan Aliyah",
      role: "Tech Conference Organiser, Lagos",
      text: "We hosted TechFest Lagos on TixO and the results were phenomenal. Sold out in 48 hours.",
    },
  ];

export default function Testimonials() {

  return (
    <div className="bg-neutral-950 py-16 px-6 md:px-30">
      <h2 className="text-white text-2xl font-bold mb-2">
        What people are saying about us
      </h2>
      <p className="text-neutral-400 text-sm mb-8">
        Event Organisers and attendees love using TixO.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r) => (
          <div
            key={r.name}
            className="bg-purple-900/40 rounded-xl p-5 flex flex-col gap-3"
          >
            <div className="flex gap-1">
             {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} className="w-3.5 h-3.5 -mx-1" />
            ))}
            </div>
            <p className="text-neutral-200 text-sm">"{r.text}"</p>
            <div>
              <p className="text-white text-sm font-medium">{r.name}</p>
              <p className="text-neutral-400 text-xs">{r.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}