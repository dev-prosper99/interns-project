import EventCard from "./EventCard";
import type { EventRowData } from "./Types";
 
interface EventCardListProps {
  events: EventRowData[];
  onViewClick: (event: EventRowData) => void;
  onDeleteClick: (event: EventRowData) => void;
  onUnpublishClick: (event: EventRowData) => void;
}
 
export default function EventCardList({
  events,
  onViewClick,
  onDeleteClick,
  onUnpublishClick,
}: EventCardListProps) {
  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between text-neutral-500 text-sm border-b border-neutral-800 py-3">
        <span>Event</span>
        <span>Actions</span>
      </div>
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onViewClick={onViewClick}
          onDeleteClick={onDeleteClick}
          onUnpublishClick={onUnpublishClick}
        />
      ))}
    </div>
  );
}
 