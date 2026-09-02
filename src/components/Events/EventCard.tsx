import { ViewIcon, Edit02Icon, ToggleOnIcon, Delete02Icon } from "@/assets/icons";
import type { EventRowData } from "./Types";
 
interface EventCardProps {
  event: EventRowData;
  onViewClick: (event: EventRowData) => void;
  onDeleteClick: (event: EventRowData) => void;
  onUnpublishClick: (event: EventRowData) => void;
}
 
export default function EventCard({ event, onViewClick, onDeleteClick, onUnpublishClick }: EventCardProps) {
  const isPublished = event.status === "Published";
 
  return (
    <div className="flex items-center justify-between gap-2 py-4 border-b border-neutral-900">
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={event.image}
          alt={event.title}
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />
        <div className="min-w-0">
          <p className="text-white font-medium truncate">{event.title}</p>
          <p className="text-neutral-500 text-xs truncate">{event.venue}</p>
        </div>
      </div>
 
      {/* Scrolls horizontally on narrow screens so Toggle/Delete stay reachable
          instead of getting clipped off the edge of the card. */}
      <div className="flex items-center gap-3 shrink-0 overflow-x-auto max-w-27.5 pl-1">
        <button aria-label="View event" className="shrink-0" onClick={() => onViewClick(event)}>
          <ViewIcon className="w-4 h-4 text-neutral-400" />
        </button>
        <button aria-label="Edit event" className="shrink-0">
          <Edit02Icon className="w-4 h-4 text-neutral-400" />
        </button>
        <button
          aria-label="Publish/unpublish event"
          className="shrink-0"
          onClick={() => onUnpublishClick(event)}
        >
          <ToggleOnIcon
            className="w-4 h-4"
            style={{ color: isPublished ? "#0F973D" : "#6B7280" }}
          />
        </button>
        <button
          aria-label="Delete event"
          className="shrink-0"
          onClick={() => onDeleteClick(event)}
        >
          <Delete02Icon className="w-4 h-4" style={{ color: "#EA580C" }} />
        </button>
      </div>
    </div>
  );
}