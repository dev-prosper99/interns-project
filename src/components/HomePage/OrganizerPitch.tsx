import { RightIcon } from "@/assets/icons";
import organizerImg from "@/assets/organizer.png"

const bullets = [
    "Sell unlimited ticket types (Free, Paid, VIP)",
    "Real-time sales analytics and revenue tracking",
    "QR code scanning for seamless event entry",
    "Export attendee lists and transaction reports",
    "Promo codes and group discount management",
  ];

export default function OrganizerPitch() {
  
  return (
    <div className="bg-purple-900 py-16 px-6 md:px-30 flex flex-col md:flex-row items-center gap-10">
      <div className="flex flex-col gap-6 items-start lg:w-1/2 px-4 sm:px-0">
        <span className="inline-flex items-center rounded-full border border-[#9EA0A9]/24 px-3 py-3 text-sm text-neutral-300 w-fit">
          For Event Organisers
        </span>
        <h2 className="font-jarkarta font-bold text-white text-3xl sm:text-4xl md:text-5xl lg:text-[52px]leading-tight lg-leading-14 tracking-[-0.02em]">
          Sell more tickets. Stress less.
        </h2>
        <p className="font-poppins font-medium text-sm sm:text-base leading-6 text-neutral-100">
          From intimate workshops to stadium concerts, TixO gives you everything
          you need to create, sell, and manage events with confidence.
        </p>
        <ul className="flex flex-col gap-4 w-full">
          {bullets.map((bullet, i) => (
            <li key={i} className="flex flex-row items-center gap-2 text-neutral-200 text-sm">
              <RightIcon className="w-5 h-5 shrink-0"/>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
        <button className="bg-purple-500 hover:bg-purple-800 text-neutral-200 px-6 py-3 rounded-lg font-medium">
          Get Started
        </button>
      </div>
      <div className="relative w-70 sm:w-100 md:-140 lg:w-145 aspect-680/548 rounded-2xl bg-neutral-900 overflow-hidden shrink-0 mx-auto lg:mx-0">
        <img
          src={organizerImg}
          alt="TixO organizer dashboard"
          className="absolute rounded-2xl shadow-lg"
          style={{ top: "11.3%", left: "11.3%", width: "127.6%", height: "111.9%" }}
        />
      </div>
    </div>
  );
}