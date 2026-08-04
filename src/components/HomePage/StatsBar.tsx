import { BuildingIcon, Star01Icon, TicketIcon, UserGroupIcon } from "@/assets/icons";

const stats = [
    { Icon: TicketIcon, label: "Tickets Sold", value: "2M+" },
    { Icon: BuildingIcon, label: "Events", value: "10,000+" },
    { Icon: UserGroupIcon, label: "Organizers", value: "2,000+" },
    { Icon: Star01Icon, label: "Happy Attendees", value: "98%" },
  ];

export default function StatsBar() {
  
  return (
   <div className="bg-neutral-925 px-6 md:px-30">
    <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row flex-wrap md:justify-between items-center py-8 gap-4 ">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col items-center gap-2">
          <s.Icon className="w-12 h-12" />
          <p className="text-white text-2xl font-bold">{s.value}</p>
          <p className="text-neutral-400 text-sm">{s.label}</p>
        </div>
      ))}
    </div>
   </div>
  );
}