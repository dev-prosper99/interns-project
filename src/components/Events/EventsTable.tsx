import { Eye, Pencil, ToggleRight, Trash2 } from "lucide-react";
import Pill, { CategoryPill } from "./Pill";
import type { EventRowData } from "./Types";

const statusColors: Record<string, string> = {
      Published: "#0F973D",
      Draft: "#E4A63D",
};

interface EventsTableProps {
      events: EventRowData[];
      onViewClick: (event: EventRowData) => void;
      onDeleteClick: (event: EventRowData) => void;
      onUnpublishClick: (event: EventRowData) => void;
      onEditClick: (event: EventRowData) => void;
}

export default function EventsTable({ events, onViewClick, onDeleteClick, onUnpublishClick, onEditClick }: EventsTableProps) {
      return (
            <table className="hidden min-w-[760px] w-full table-fixed text-left text-xs md:table">
                  <colgroup>
                        <col className="w-[34%]" />
                        <col className="w-[14%]" />
                        <col className="w-[13%]" />
                        <col className="w-[13%]" />
                        <col className="w-[13%]" />
                        <col className="w-[13%]" />
                  </colgroup>
                  <thead>
                        <tr className="bg-neutral-925 text-neutral-300">
                              <th className="rounded-l-md px-2.5 py-3 font-medium">Event</th>
                              <th className="px-2.5 py-3 font-medium">Date</th>
                              <th className="px-2.5 py-3 font-medium">Category</th>
                              <th className="px-2.5 py-3 font-medium">Revenue</th>
                              <th className="px-2.5 py-3 font-medium">Status</th>
                              <th className="rounded-r-md px-2.5 py-3 font-medium">Actions</th>
                        </tr>
                  </thead>
                  <tbody>
                        {events.map((event) => {
                              const isPublished = event.status === "Published";
                              return (
                                    <tr key={event.id} className="border-b border-neutral-900 transition-colors hover:bg-neutral-925/60">
                                          <td className="px-2.5 py-2">
                                                <div className="flex min-w-0 items-center gap-2">
                                                      {event.image ? (
                                                            <img src={event.image} alt="" className="h-6 w-6 shrink-0 rounded-full object-cover" />
                                                      ) : (
                                                            <span aria-hidden="true" className="h-6 w-6 shrink-0 rounded-full bg-neutral-800" />
                                                      )}
                                                      <div className="min-w-0">
                                                            <p className="truncate font-medium text-neutral-200">{event.title}</p>
                                                            <p className="truncate text-[10px] text-neutral-500">{event.venue}</p>
                                                      </div>
                                                </div>
                                          </td>
                                          <td className="px-2.5 py-2 text-neutral-300">
                                                {event.date} {event.time}
                                          </td>
                                          <td className="px-2.5 py-2">
                                                <CategoryPill label={event.category} />
                                          </td>
                                          <td className="px-2.5 py-2 text-neutral-300">{event.revenue}</td>
                                          <td className="px-2.5 py-2">
                                                <Pill label={event.status} color={statusColors[event.status] ?? "#6B7280"} />
                                          </td>
                                          <td className="px-2.5 py-2">
                                                <div className="flex items-center gap-1">
                                                      <button
                                                            type="button"
                                                            aria-label="View event"
                                                            title="View event"
                                                            className="rounded p-1 text-neutral-500 transition-colors hover:bg-white/5 hover:text-neutral-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400"
                                                            onClick={() => onViewClick(event)}
                                                      >
                                                            <Eye aria-hidden="true" className="h-3.5 w-3.5" />
                                                      </button>
                                                      <button
                                                            type="button"
                                                            aria-label="Edit event"
                                                            title="Edit event"
                                                            className="rounded p-1 text-neutral-500 transition-colors hover:bg-white/5 hover:text-neutral-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400"
                                                            onClick={() => onEditClick(event)}
                                                      >
                                                            <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
                                                      </button>
                                                      <button
                                                            type="button"
                                                            aria-label={isPublished ? "Unpublish event" : "Publish event"}
                                                            title={isPublished ? "Unpublish event" : "Publish event"}
                                                            className="rounded p-1 transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400"
                                                            onClick={() => onUnpublishClick(event)}
                                                      >
                                                            <ToggleRight
                                                                  aria-hidden="true"
                                                                  className={`h-3.5 w-3.5 ${isPublished ? "text-success-500" : "text-neutral-500"}`}
                                                            />
                                                      </button>
                                                      <button
                                                            type="button"
                                                            aria-label="Delete event"
                                                            title="Delete event"
                                                            className="rounded p-1 text-error-500 transition-colors hover:bg-error-500/10 hover:text-error-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-error-400"
                                                            onClick={() => onDeleteClick(event)}
                                                      >
                                                            <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
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
