import { BuildingIcon, Star01Icon, TicketIcon, UserGroupIcon } from "@/assets/icons";

const stats = [
    { Icon: TicketIcon, label: "Tickets Sold", value: "2M+" },
    { Icon: BuildingIcon, label: "Events", value: "10,000+" },
    { Icon: UserGroupIcon, label: "Organizers", value: "2,000+" },
    { Icon: Star01Icon, label: "Happy Attendees", value: "98%" },
  ];

export default function StatsBar() {
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 bg-neutral-925 py-8 gap-4 text-center">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col items-center gap-2">
          <s.Icon className="w-12 h-12" />
          <p className="text-white text-2xl font-bold">{s.value}</p>
          <p className="text-neutral-400 text-sm">{s.label}</p>
        </div>
      ))}
    </div>
  );
}