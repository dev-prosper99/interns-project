import EventCard from "./EventCard";
import type { EventRowData } from "./Types";

interface EventCardListProps {
      events: EventRowData[];
      onViewClick: (event: EventRowData) => void;
      onDeleteClick: (event: EventRowData) => void;
      onUnpublishClick: (event: EventRowData) => void;
      onEditClick: (event: EventRowData) => void;
}

export default function EventCardList({ events, onViewClick, onDeleteClick, onUnpublishClick, onEditClick }: EventCardListProps) {
      return (
            <div className="xl:hidden">
                  <div className="flex items-center justify-between rounded-md bg-neutral-925 px-3 py-2.5 text-xs font-medium text-neutral-300">
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
                              onEditClick={onEditClick}
                        />
                  ))}
            </div>
      );
}
