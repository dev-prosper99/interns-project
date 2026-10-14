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
import { DEFAULT_REFUND_POLICY, DEFAULT_DESCRIPTION, type EventDetailData } from "./EventsDetailsTypes";
import type { RawApiEvent, RawApiTicket } from "./Types";

const API_BASE_URL = "https://peacemaker001-001-site1.ltempurl.com";

interface EventApiResponse {
      success?: boolean;
      message?: string;
      data?: RawApiEvent | RawApiEvent[] | { items?: RawApiEvent[] };
}

export default function EventsPage() {
      const [search, setSearch] = useState("");
      const [categoryFilter, setCategoryFilter] = useState("all");
      const [statusFilter, setStatusFilter] = useState("all");
      const [rows, setRows] = useState<EventRowData[]>([]);
      const [isLoading, setIsLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);
      const [statusOverrides, setStatusOverrides] = useState<Record<string | number, string>>({});
      const [deleteTarget, setDeleteTarget] = useState<EventRowData | null>(null);
      const [unpublishTarget, setUnpublishTarget] = useState<EventRowData | null>(null);
      const [viewTargetId, setViewTargetId] = useState<string | number | null>(null);
      const [viewTarget, setViewTarget] = useState<EventDetailData | null>(null);
      const [viewLoading, setViewLoading] = useState(false);
      const [editTarget, setEditTarget] = useState<any>(null);
      const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

      const fetchEvents = useCallback(async () => {
            setIsLoading(true);
            setError(null);
            try {
                  const token = localStorage.getItem("token");
                  const cleanToken = token ? (token.startsWith("Bearer ") ? token.slice(7) : token) : "";
                  const userId = localStorage.getItem("userId");
                  if (!userId) {
                        setError("Not logged in");
                        setIsLoading(false);
                        return;
                  }

                  const queryParams = new URLSearchParams({
                        Page: "1",
                        PageSize: "50",
                  });
                  const response = await fetch(`${API_BASE_URL}/api/Events/my-events/${userId}?${queryParams.toString()}`, {
                        method: "GET",
                        headers: {
                              ...(cleanToken ? { Authorization: `Bearer ${cleanToken}` } : {}),
                              Accept: "application/json",
                        },
                  });

                  if (!response.ok) {
                        throw new Error(`Request failed with status ${response.status}`);
                  }

                  const result = (await response.json()) as EventApiResponse;
                  if (!result.success) {
                        throw new Error(result.message || "Failed to load events");
                  }

                  const rawData = result.data;
                  const rawItems: RawApiEvent[] = Array.isArray(rawData)
                        ? rawData
                        : rawData && typeof rawData === "object" && "items" in rawData && Array.isArray(rawData.items)
                          ? rawData.items
                          : [];

                  const mappedEvents: EventRowData[] = rawItems.map((event: RawApiEvent) => {
                        const rawDate = event.eventDate || event.EventDate || event.availabilityStart;
                        const eventDateObj = rawDate ? new Date(rawDate) : null;
                        const isValidDate = eventDateObj && !Number.isNaN(eventDateObj.getTime());
                        const realId = event.id ?? event.Id ?? "";
                        const venueName = event.venue ?? event.Venue;
                        const cityName = event.city ?? event.City;
                        return {
                              id: realId,
                              title: event.title ?? event.Title ?? "Untitled Event",
                              venue: [venueName, cityName].filter(Boolean).join(", ") || "No venue set",
                              date: isValidDate ? eventDateObj.toLocaleDateString() : "TBD",
                              time: isValidDate ? eventDateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "TBD",
                              category: event.eventCategory || event.EventCategory || event.category || event.Category || "Event",
                              image: event.bannerUrl || event.image || "",
                              bannerUrl: event.bannerUrl || event.image || null,
                              revenue: "₦0.00",
                              status: statusOverrides[realId] ?? event.status ?? event.Status ?? "Draft",
                        };
                  });
                  setRows(mappedEvents);
            } catch (err: unknown) {
                  setError(err instanceof Error ? err.message : "Failed to load events");
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
                        const cleanToken = token ? (token.startsWith("Bearer ") ? token.slice(7) : token) : "";
                        const response = await fetch(`${API_BASE_URL}/api/Events/${viewTargetId}`, {
                              method: "GET",
                              headers: {
                                    ...(cleanToken ? { Authorization: `Bearer ${cleanToken}` } : {}),
                                    Accept: "application/json",
                              },
                        });
                        const result = (await response.json()) as { success?: boolean; message?: string; data?: RawApiEvent };
                        if (!response.ok || !result.success || !result.data) {
                              throw new Error(result?.message || "Failed to load event details");
                        }

                        const event = result.data;
                        const rawDate = event.eventDate || event.EventDate || event.availabilityStart;
                        const startDate = rawDate ? new Date(rawDate) : null;
                        const isValidDate = startDate && !Number.isNaN(startDate.getTime());
                        const rawEndTime = event.availabilityEnd || event.AvailabilityEnd || event.endTime || event.EndTime;
                        const endTimeDate = rawEndTime ? new Date(String(rawEndTime)) : null;
                        const endTime =
                              typeof rawEndTime === "string" && /^\d{1,2}:\d{2}/.test(rawEndTime)
                                    ? rawEndTime.slice(0, 5)
                                    : endTimeDate && !Number.isNaN(endTimeDate.getTime())
                                      ? endTimeDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                      : "TBD";

                        if (cancelled) return;

                        let savedMeta: Record<string, unknown> | null = null;
                        try {
                              const metaStr = localStorage.getItem(`event_meta_${event.id ?? viewTargetId}`);
                              if (metaStr) savedMeta = JSON.parse(metaStr) as Record<string, unknown>;
                              if (!savedMeta) {
                                    const cacheStr = localStorage.getItem(`event_cache_${event.id ?? viewTargetId}`);
                                    if (cacheStr) savedMeta = JSON.parse(cacheStr) as Record<string, unknown>;
                              }
                        } catch {
                              console.error();
                        }

                        const resolvedPromoCode = String(event.promoCode || event.PromoCode || event.promo_code || savedMeta?.promoCode || "");
                        const rawDiscount = event.discount ?? event.Discount ?? event.promoDiscount ?? savedMeta?.discount ?? "";
                        const resolvedPromoDiscount = rawDiscount
                              ? String(rawDiscount).includes("%")
                                    ? String(rawDiscount)
                                    : `${rawDiscount}% off`
                              : "0% off";

                        const resolvedRefund = String(event.eventPolicy || event.refundPolicy || savedMeta?.refundPolicy || DEFAULT_REFUND_POLICY);
                        const resolvedDescription = String(event.description || savedMeta?.description || DEFAULT_DESCRIPTION);

                        const rawTicketTypes = (event.ticketTypes ?? savedMeta?.tiers ?? []) as RawApiTicket[];
                        const mappedTiers = rawTicketTypes.map((ticket: RawApiTicket) => ({
                              id: String(ticket.id ?? ticket.Id ?? ""),
                              name: String(ticket.name ?? ticket.Name ?? ""),
                              price: `₦${Number(ticket.price ?? ticket.Price ?? 0).toLocaleString("en-NG")}`,
                              ticketsAvailable:
                                    ticket.totalQuantity != null || ticket.quantity != null ? `${ticket.totalQuantity ?? ticket.quantity} tickets` : undefined,
                              subtitle: (ticket.description ?? ticket.Description) ? String(ticket.description ?? ticket.Description) : undefined,
                        }));

                        const currentId = event.id ?? event.Id ?? viewTargetId;

                        setViewTarget({
                              id: currentId,
                              status: statusOverrides[currentId] ?? event.status ?? "Draft",
                              title: event.title ?? event.Title ?? "Untitled Event",
                              category: event.eventCategory || event.EventCategory || event.category || event.Category || "Event",
                              venue: event.venue ?? event.Venue ?? "No venue specified",
                              state: event.state ?? event.State ?? "",
                              numberAttending: String(event.numberAttending ?? event.NumberAttending ?? 0),
                              startDate: isValidDate ? startDate.toLocaleDateString() : "TBD",
                              startTime: isValidDate ? startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "TBD",
                              endTime,
                              bannerUrl: event.bannerUrl || event.BannerUrl || "",
                              promoCode: resolvedPromoCode,
                              promoDiscount: resolvedPromoDiscount,
                              refundPolicy: resolvedRefund,
                              description: resolvedDescription,
                              ticketTiers: mappedTiers,
                        });
                  } catch {
                        console.error();
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
                  const cleanToken = token ? (token.startsWith("Bearer ") ? token.slice(7) : token) : "";
                  const response = await fetch(`${API_BASE_URL}/api/Events/${deleteTarget.id}`, {
                        method: "DELETE",
                        headers: {
                              ...(cleanToken ? { Authorization: `Bearer ${cleanToken}` } : {}),
                        },
                  });
                  const result = (await response.json()) as { message?: string };
                  if (!response.ok) {
                        throw new Error(result?.message || "Failed to delete event");
                  }
                  setRows((prev) => prev.filter((event) => event.id !== deleteTarget.id));
                  setDeleteTarget(null);
            } catch {
                  console.error();
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
            return rows.filter((event) => {
                  const matchesSearch =
                        !query || [event.title, event.venue, event.category, event.status].some((field) => field?.toLowerCase().includes(query));
                  const matchesCategory = categoryFilter === "all" || event.category.toLowerCase() === categoryFilter.toLowerCase();
                  const matchesStatus = statusFilter === "all" || event.status.toLowerCase() === statusFilter.toLowerCase();
                  return matchesSearch && matchesCategory && matchesStatus;
            });
      }, [rows, search, categoryFilter, statusFilter]);

      const categories = useMemo(() => Array.from(new Set(rows.map((event) => event.category).filter(Boolean))).sort(), [rows]);
      const statuses = useMemo(() => Array.from(new Set(rows.map((event) => event.status).filter(Boolean))).sort(), [rows]);

      if (isLoading) return <Loader />;

      return (
            <div className="min-w-0 min-h-dvh bg-neutral-925 text-white flex flex-col">
                  <main className="min-w-0 flex-1 flex flex-col">
                        <div className="bg-neutral-925 p-4 md:p-8 flex-1 flex flex-col">
                              <EventsPageHeader onCreateClick={() => setIsCreateModalOpen(true)} />
                              <div className="rounded-xl p-4 flex-1 flex flex-col border border-white/5 bg-neutral-1000">
                                    <SearchFilterBar
                                          search={search}
                                          onSearchChange={setSearch}
                                          categories={categories}
                                          statuses={statuses}
                                          category={categoryFilter}
                                          onCategoryChange={setCategoryFilter}
                                          status={statusFilter}
                                          onStatusChange={setStatusFilter}
                                    />
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
                                                            <div className="flex-1 flex flex-col">
                                                                  <div className="hidden xl:block">
                                                                        <EventsTable
                                                                              events={filteredRows}
                                                                              onViewClick={(row) => setViewTargetId(row.id)}
                                                                              onDeleteClick={(row) => setDeleteTarget(row)}
                                                                              onUnpublishClick={(row) => setUnpublishTarget(row)}
                                                                              onEditClick={(row) => setEditTarget(row)}
                                                                        />
                                                                  </div>
                                                                  <div className="block xl:hidden">
                                                                        <EventCardList
                                                                              events={filteredRows}
                                                                              onViewClick={(row) => setViewTargetId(row.id)}
                                                                              onDeleteClick={(row) => setDeleteTarget(row)}
                                                                              onUnpublishClick={(row) => setUnpublishTarget(row)}
                                                                              onEditClick={(row) => setEditTarget(row)}
                                                                        />
                                                                  </div>
                                                            </div>
                                                            <EventsPagination className="mt-auto" />
                                                      </>
                                                )}
                                          </>
                                    )}
                              </div>
                        </div>
                  </main>
                  {deleteTarget && <DeleteEventModal onCancel={() => setDeleteTarget(null)} onConfirm={handleConfirmDelete} />}
                  {(editTarget || isCreateModalOpen) && (
                        <CreateEventModal
                              key={editTarget ? `edit-${editTarget.id}` : "create"}
                              isOpen={true}
                              eventId={editTarget?.id}
                              initialData={editTarget}
                              onClose={handleCreateOrEditModalClose}
                        />
                  )}
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
                                                setEditTarget({ ...target, ...viewTarget });
                                                setViewTargetId(null);
                                          }}
                                    />
                              </div>
                        </div>
                  )}
            </div>
      );
}
