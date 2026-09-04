import { ViewIcon, Edit02Icon, ToggleOnIcon, Delete02Icon } from "@/assets/icons";
import Pill from "./Pill";
import type { EventRowData } from "./Types";
 
const categoryColors: Record<string, string> = {
  Music: "#EA580C",
  Tech: "#7C3AED",
  Comedy: "#E4A63D",
  Art: "#7C3AED",
};
 
const statusColors: Record<string, string> = {
  Published: "#0F973D",
  Draft: "#E4A63D",
};
 
interface EventsTableProps {
  events: EventRowData[];
  onViewClick: (event: EventRowData) => void;
  onDeleteClick: (event: EventRowData) => void;
  onUnpublishClick: (event: EventRowData) => void;
  onEditClick: (event: EventRowData) => void
}
 
// Full table with Date/Category/Revenue/Status columns — desktop only.
export default function EventsTable({ events, onViewClick, onDeleteClick, onUnpublishClick, onEditClick }: EventsTableProps) {
  return (
    <table className="hidden md:table w-full text-left text-sm">
      <thead>
        <tr className="text-neutral-500 border-b border-neutral-800">
          <th className="py-3 font-medium">Event</th>
          <th className="py-3 font-medium">Date</th>
          <th className="py-3 font-medium">Category</th>
          <th className="py-3 font-medium">Revenue</th>
          <th className="py-3 font-medium">Status</th>
          <th className="py-3 font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event) => {
          const isPublished = event.status === "Published";
 
          return (
            <tr
              key={event.id}
              className="border-b border-neutral-900 hover:bg-neutral-900/50 transition-colors"
            >
              <td className="py-4 flex items-center gap-3">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-white font-medium">{event.title}</p>
                  <p className="text-neutral-500 text-xs">{event.venue}</p>
                </div>
              </td>
              <td className="py-4 text-neutral-300">
                {event.date} {event.time}
              </td>
              <td className="py-4">
                <Pill label={event.category} color={categoryColors[event.category] ?? "#6B7280"} />
              </td>
              <td className="py-4 text-neutral-300">{event.revenue}</td>
              <td className="py-4">
                <Pill label={event.status} color={statusColors[event.status]} />
              </td>
              <td className="py-4">
                <div className="flex items-center" style={{ width: 164, height: 60, gap: 10 }}>
                  <button aria-label="View event" onClick={() => onViewClick(event)}>
                    <ViewIcon className="w-4 h-4 text-neutral-400 hover:text-white" />
                  </button>
                 <button
  aria-label="Edit event"
  onClick={() => onEditClick(event)}
>
  <Edit02Icon className="w-4 h-4 text-neutral-400 hover:text-white" />
</button>
                  <button
                    aria-label="Publish/unpublish event"
                    onClick={() => onUnpublishClick(event)}
                  >
                    <ToggleOnIcon
                      className="w-4 h-4"
                      style={{ color: isPublished ? "#0F973D" : "#6B7280" }}
                    />
                  </button>
                  <button aria-label="Delete event" onClick={() => onDeleteClick(event)}>
                    <Delete02Icon className="w-4 h-4" style={{ color: "#EA580C" }} />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}