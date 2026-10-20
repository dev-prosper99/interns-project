import { Eye, Pencil, ToggleRight, Trash2 } from "lucide-react";
import { CategoryPill } from "./Pill";
import type { EventRowData } from "./Types";

interface EventCardProps {
      event: EventRowData;
      onViewClick: (event: EventRowData) => void;
      onDeleteClick: (event: EventRowData) => void;
      onUnpublishClick: (event: EventRowData) => void;
      onEditClick: (event: EventRowData) => void;
}

export default function EventCard({ event, onViewClick, onDeleteClick, onUnpublishClick, onEditClick }: EventCardProps) {
      const isPublished = event.status === "Published";
      return (
            <div className="flex items-center justify-between gap-2 border-b border-neutral-900 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                        {event.image ? (
                              <img src={event.image} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
                        ) : (
                              <span aria-hidden="true" className="h-8 w-8 shrink-0 rounded-full bg-neutral-800" />
                        )}
                        <div className="min-w-0">
                              <p className="text-white font-medium truncate">{event.title}</p>
                              <p className="text-neutral-500 text-xs truncate">{event.venue}</p>
                              <CategoryPill label={event.category} />
                        </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 pl-1">
                        <button
                              type="button"
                              aria-label="View event"
                              title="View event"
                              className="rounded p-1.5 text-neutral-500 transition-colors hover:bg-white/5 hover:text-neutral-200"
                              onClick={() => onViewClick(event)}
                        >
                              <Eye aria-hidden="true" className="h-3.5 w-3.5" />
                        </button>
                        <button
                              type="button"
                              aria-label="Edit event"
                              title="Edit event"
                              className="rounded p-1.5 text-neutral-500 transition-colors hover:bg-white/5 hover:text-neutral-200"
                              onClick={() => onEditClick(event)}
                        >
                              <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
                        </button>
                        <button
                              type="button"
                              aria-label={isPublished ? "Unpublish event" : "Publish event"}
                              title={isPublished ? "Unpublish event" : "Publish event"}
                              className="rounded p-1.5 transition-colors hover:bg-white/5"
                              onClick={() => onUnpublishClick(event)}
                        >
                              <ToggleRight aria-hidden="true" className={`h-3.5 w-3.5 ${isPublished ? "text-success-500" : "text-neutral-500"}`} />
                        </button>
                        <button
                              type="button"
                              aria-label="Delete event"
                              title="Delete event"
                              className="rounded p-1.5 text-error-500 transition-colors hover:bg-error-500/10 hover:text-error-400"
                              onClick={() => onDeleteClick(event)}
                        >
                              <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                        </button>
                  </div>
            </div>
      );
}
