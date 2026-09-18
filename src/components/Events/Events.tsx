import { useState, useEffect, useCallback, useMemo } from "react";
import EventsPageHeader from "./EventsPageHeader";
import SearchFilterBar from "./SearchFilterBar";
import EventsTable from "./EventsTable";
import EventCardList from "./EventCardList";
import EventsPagination from "./EventsPagination";
import DeleteEventModal from "./DeleteEventModal";
import UnpublishEventModal from "./UnpublishEventModal";
import EventDetails from "./EventsDetails";
import CreateEventModal from "../DashBoard/AdminDashboard/CreateEvent/CreateEventModal";

import type { EventRowData } from "./Types";
import Loader from "../layouts/Loader";
import { DEFAULT_PROMO_CODE, DEFAULT_PROMO_DISCOUNT, DEFAULT_REFUND_POLICY, DEFAULT_DESCRIPTION, type EventDetailData } from "./EventsDetailsTypes";

const API_BASE_URL = "https://peacemaker001-001-site1.ltempurl.com";

export default function EventsPage() {
      const [search, setSearch] = useState("");
      const [rows, setRows] = useState<EventRowData[]>([]);
      const [isLoading, setIsLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

      const [statusOverrides, setStatusOverrides] = useState<Record<string | number, string>>({});
      const [deleteTarget, setDeleteTarget] = useState<EventRowData | null>(null);
      const [unpublishTarget, setUnpublishTarget] = useState<EventRowData | null>(null);

      const [viewTargetId, setViewTargetId] = useState<string | number | null>(null);
      const [viewTarget, setViewTarget] = useState<EventDetailData | null>(null);
      const [viewLoading, setViewLoading] = useState(false);

      const [editTarget, setEditTarget] = useState<EventRowData | null>(null);
      const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

      const fetchEvents = useCallback(async () => {
            setIsLoading(true);
            setError(null);
            try {
                  const token = localStorage.getItem("token");
                  const userId = localStorage.getItem("userId");

                  if (!userId) {
                        setError("Not logged in");
                        setIsLoading(false);
                        return;
                  }

                  // Appending query parameters as many ASP.NET controllers require default page params
                  const queryParams = new URLSearchParams({
                        Page: "1",
                        PageSize: "50",
                  });

                  const response = await fetch(`${API_BASE_URL}/api/Events/my-events/${userId}?${queryParams.toString()}`, {
                        method: "GET",
                        headers: {
                              ...(token ? { Authorization: `Bearer ${token}` } : {}),
                              Accept: "application/json",
                        },
                  });

                  if (!response.ok) {
                        throw new Error(`Request failed with status ${response.status}`);
                  }

                  const result = await response.json();

                  if (!result.success) {
                        throw new Error(result.message || "Failed to load events");
                  }

                  const rawItems = Array.isArray(result.data) ? result.data : (result.data?.items ?? []);

                  const mappedEvents: EventRowData[] = rawItems.map((event: any) => {
                        const eventDateObj = event.eventDate ? new Date(event.eventDate) : null;
                        const isValidDate = eventDateObj && !Number.isNaN(eventDateObj.getTime());

                        return {
                              id: event.id,
                              title: event.title ?? "Untitled Event",
                              venue: [event.venue, event.city].filter(Boolean).join(", ") || "No venue set",
                              date: isValidDate ? eventDateObj.toLocaleDateString() : "TBD",
                              time: isValidDate ? eventDateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "TBD",
                              category: event.eventCategory || event.category || "Event",
                              image: event.bannerUrl || null,
                              bannerUrl: event.bannerUrl || null,
                              revenue: "₦0",
                              status: statusOverrides[event.id] ?? event.status ?? "Draft",
                        };
                  });

                  setRows(mappedEvents);
            } catch (err) {
                  console.error("Fetch events error:", err);
                  setError((err as Error).message || "Failed to load events");
            } finally {
                  setIsLoading(false);
            }
      }, [statusOverrides]);

      useEffect(() => {
            fetchEvents();
      }, [fetchEvents]);

      useEffect(() => {
            if (viewTargetId === null) {
                  setViewTarget(null);
                  return;
            }

            let cancelled = false;

            const fetchEventDetails = async () => {
                  setViewLoading(true);
                  try {
                        const token = localStorage.getItem("token");

                        const response = await fetch(`${API_BASE_URL}/api/Events/${viewTargetId}`, {
                              method: "GET",
                              headers: {
                                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                                    Accept: "application/json",
                              },
                        });

                        const result = await response.json();

                        if (!response.ok || !result.success) {
                              throw new Error(result?.message || "Failed to load event details");
                        }

                        const event = result.data;
                        const startDate = event.eventDate ? new Date(event.eventDate) : null;
                        const isValidDate = startDate && !Number.isNaN(startDate.getTime());

                        if (cancelled) return;

                        setViewTarget({
                              id: event.id,
                              status: statusOverrides[event.id] ?? event.status ?? "Draft",
                              title: event.title ?? "Untitled Event",
                              category: event.eventCategory || event.category || "Event",
                              venue: event.venue ?? "No venue specified",
                              state: event.state ?? "",
                              numberAttending: event.numberAttending ?? 0,
                              startDate: isValidDate ? startDate.toLocaleDateString() : "TBD",
                              startTime: isValidDate ? startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "TBD",
                              bannerUrl: event.bannerUrl || null,
                              promoCode: DEFAULT_PROMO_CODE,
                              promoDiscount: DEFAULT_PROMO_DISCOUNT,
                              refundPolicy: event.eventPolicy || DEFAULT_REFUND_POLICY,
                              description: event.description || DEFAULT_DESCRIPTION,
                              ticketTiers: (event.ticketTypes ?? []).map((ticket: any) => ({
                                    id: ticket.id,
                                    name: ticket.name,
                                    price: `₦${Number(ticket.price || 0).toLocaleString("en-NG")}`,
                              })),
                        });
                  } catch (err) {
                        console.error("Failed to load event details:", err);
                        if (!cancelled) setViewTarget(null);
                  } finally {
                        if (!cancelled) setViewLoading(false);
                  }
            };

            fetchEventDetails();

            return () => {
                  cancelled = true;
            };
      }, [viewTargetId, statusOverrides]);

      const handleConfirmDelete = async () => {
            if (!deleteTarget) return;

            try {
                  const token = localStorage.getItem("token");

                  const response = await fetch(`${API_BASE_URL}/api/Events/${deleteTarget.id}`, {
                        method: "DELETE",
                        headers: {
                              ...(token ? { Authorization: `Bearer ${token}` } : {}),
                        },
                  });

                  const result = await response.json();

                  if (!response.ok) {
                        throw new Error(result?.message || "Failed to delete event");
                  }

                  setRows((prev) => prev.filter((event) => event.id !== deleteTarget.id));
                  setDeleteTarget(null);
            } catch (error) {
                  console.error("Delete failed:", error);
            }
      };

      const handleConfirmUnpublish = () => {
            if (!unpublishTarget) return;

            setStatusOverrides((prev) => ({
                  ...prev,
                  [unpublishTarget.id]: "Draft",
            }));

            setRows((prev) => prev.map((row) => (row.id === unpublishTarget.id ? { ...row, status: "Draft" } : row)));

            setUnpublishTarget(null);
      };

      const handleCreateOrEditModalClose = () => {
            setEditTarget(null);
            setIsCreateModalOpen(false);
            fetchEvents();
      };

      const filteredRows = useMemo(() => {
            const query = search.toLowerCase().trim();
            if (!query) return rows;

            return rows.filter((event) => [event.title, event.venue, event.category, event.status].some((field) => field?.toLowerCase().includes(query)));
      }, [rows, search]);

      if (isLoading) return <Loader />;

      return (
            <div className="min-w-0 min-h-dvh bg-neutral-950 text-white flex flex-col">
                  <main className="min-w-0 flex-1 flex flex-col">
                        <div className="bg-neutral-950 p-4 md:p-8 flex-1 flex flex-col">
                              <EventsPageHeader onCreateClick={() => setIsCreateModalOpen(true)} />

                              <div className="rounded-2xl p-4 md:p-8 flex-1 flex flex-col border border-white/5" style={{ backgroundColor: "#111213" }}>
                                    <SearchFilterBar search={search} onSearchChange={setSearch} />

                                    {error && !isLoading && (
                                          <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
                                                <p className="text-red-400 text-sm mb-4">Error loading events. please try again</p>
                                                <button
                                                      type="button"
                                                      onClick={fetchEvents}
                                                      className="rounded-lg bg-neutral-800 px-4 py-2 text-xs font-medium text-neutral-200 hover:bg-neutral-700 transition-colors"
                                                >
                                                      Try Again
                                                </button>
                                          </div>
                                    )}

                                    {!error && (
                                          <>
                                                {rows.length === 0 && (
                                                      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                                                            <h3 className="text-lg font-semibold text-neutral-100 mb-1">No events created yet</h3>
                                                            <p className="text-neutral-500 text-sm max-w-sm mb-6">
                                                                  You haven't published any events yet. Get started by creating your first one.
                                                            </p>
                                                      </div>
                                                )}

                                                {rows.length > 0 && filteredRows.length === 0 && (
                                                      <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
                                                            <p className="text-neutral-400 text-sm">
                                                                  No events matching <span className="text-neutral-200">"{search}"</span>
                                                            </p>
                                                      </div>
                                                )}

                                                {filteredRows.length > 0 && (
                                                      <>
                                                            <div className="hidden md:block">
                                                                  <EventsTable
                                                                        events={filteredRows}
                                                                        onViewClick={(row) => setViewTargetId(row.id)}
                                                                        onDeleteClick={setDeleteTarget}
                                                                        onUnpublishClick={setUnpublishTarget}
                                                                        onEditClick={setEditTarget}
                                                                  />
                                                            </div>

                                                            <div className="block md:hidden">
                                                                  <EventCardList
                                                                        events={filteredRows}
                                                                        onViewClick={(row) => setViewTargetId(row.id)}
                                                                        onDeleteClick={setDeleteTarget}
                                                                        onUnpublishClick={setUnpublishTarget}
                                                                  />
                                                            </div>

                                                            <EventsPagination />
                                                      </>
                                                )}
                                          </>
                                    )}
                              </div>
                        </div>
                  </main>

                  {deleteTarget && <DeleteEventModal onCancel={() => setDeleteTarget(null)} onConfirm={handleConfirmDelete} />}

                  {(editTarget || isCreateModalOpen) && <CreateEventModal isOpen={true} eventId={editTarget?.id} onClose={handleCreateOrEditModalClose} />}

                  {unpublishTarget && <UnpublishEventModal onCancel={() => setUnpublishTarget(null)} onConfirm={handleConfirmUnpublish} />}

                  {viewLoading && !viewTarget && viewTargetId !== null && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                              <p className="text-neutral-300 text-sm">Loading event...</p>
                        </div>
                  )}

                  {viewTarget && (
                        <div
                              className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-8"
                              onClick={() => setViewTargetId(null)}
                        >
                              <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl">
                                    <EventDetails
                                          event={viewTarget}
                                          onClose={() => setViewTargetId(null)}
                                          onBack={() => setViewTargetId(null)}
                                          onEdit={() => {
                                                const target = rows.find((r) => r.id === viewTarget.id) || ({ id: viewTarget.id } as EventRowData);
                                                setEditTarget(target);
                                                setViewTargetId(null);
                                          }}
                                    />
                              </div>
                        </div>
                  )}
            </div>
      );
}
