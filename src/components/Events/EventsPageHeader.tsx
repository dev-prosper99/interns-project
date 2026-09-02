import { PlusIcon } from "@/assets/icons";
 
export default function EventsPageHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
      <p className="text-white text-lg font-medium">Here's the list of all your events.</p>
      <button
        className="flex items-center justify-center rounded-[10px] w-full md:w-auto"
        style={{
          backgroundColor: "#EA580C",
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 16,
          paddingRight: 16,
          gap: 10,
        }}
      >
        <PlusIcon className="w-4 h-4 text-white" />
        <span className="text-white text-sm font-medium">Create Event</span>
      </button>
    </div>
  );
}