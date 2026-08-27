  import crowd from "@/assets/images/crowd.jpg";
  import partynight from "@/assets/images/partynight.png"

  import partynight2 from "@/assets/images/partynight2.png";
import {CalenderIcon} from "@/assets/icons";


const recentEvents = [
  {
    id: 1,
    title: "Afrobeats & Vibes Festival 2026",
    date: "16-06-2026",
    time: "07:00PM",
    image: crowd,
    status: "Upcoming",
  },
  {
    id: 2,
    title: "TechFest West Africa 2026",
    date: "16-06-2026",
    time: "07:00PM",
    image: partynight2,
    status: "Upcoming",
  },
  {
    id: 3,
    title: "Lagos Comedy Fiesta",
    date: "16-06-2026",
    time: "07:00PM",
    image: partynight,
    status: "Upcoming",
  },
  {
    id: 4,
    title: "AFCON Watch Party — Grand Final",
    date: "16-06-2026",
    time: "07:00PM",
    image: partynight2,
    status: "Upcoming",
  },
  {
    id: 5,
    title: "Nollywood & Afro Art Exhibition",
    date: "16-06-2026",
    time: "07:00PM",
    image: crowd,
    status: "Upcoming",
  },
];

const RecentEvents = () => {
  return(
    <div className="bg-neutral-1000 rounded-2xl p-6 h-full flex flex-col">
  <h2 className="text-2xl font-semibold text-white mb-6">
    Recent Events
  </h2>
 
  <div className="divide-y divide-[#252525] flex-1 overflow-auto">
    {recentEvents.map((event) => (
      <div
        key={event.id}
        className="flex items-center justify-between py-5"
      >
        <div className="flex items-center gap-4">
          <img
            src={event.image}
            alt={event.title}
            className="w-14 h-14 rounded-full object-cover"
          />
 
          <div>
            <h3 className="text-xl font-semibold text-white">
              {event.title}
            </h3>
 
            <div className="flex items-center gap-2 mt-2 text-gray-400 text-sm">
              <CalenderIcon className="w-4 h-4" />
 
              <span>
                {event.date} - {event.time}
              </span>
            </div>
          </div>
        </div>
 
        <span className="px-4 py-1.5 rounded-full bg-orange-500/20 text-orange-400 text-sm font-medium">
          {event.status}
        </span>
      </div>
    ))}
  </div>
</div>
 
  );
};

export default RecentEvents;