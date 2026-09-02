import { BellIcon } from "@/assets/icons"; // TODO: rename to match your bell SVG's export name
 
interface DashboardHeaderProps {
  title: string;
}

export default function DashboardHeader({ title }: DashboardHeaderProps) {
  return (
    <div
      className="flex items-center justify-between border-b border-neutral-800 py-6 px-4 md:py-8 md:px-10"
      style={{ backgroundColor: "#111213" }}
    >
      <h1 className="text-white text-lg md:text-xl font-semibold">{title}</h1>
      <button aria-label="Notifications" className="relative">
        <BellIcon className="w-5 h-5 text-neutral-300" />
        <span
          className="absolute rounded-full bg-red-500"
          style={{ width: 6, height: 6, top: -1, right: -1 }}
        />
      </button>
    </div>
  );
}
 