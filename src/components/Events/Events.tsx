import { useState, useEffect, useCallback } from "react";

import DashboardHeader from "./DashboardHeader";
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

import ResponsiveAdminSidebar from "../layouts/ResponsiveAdminSidebar";
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
      const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

                  const response = await fetch(`${API_BASE_URL}/api/Events/my-events/${userId}`, {
                        method: "GET",
                        headers: {
                              Authorization: `Bearer ${token}`,
                              "Content-Type": "application/json",
                        },
                  });

                  if (!response.ok) {
                        throw new Error(`Request failed with status ${response.status}`);
                  }

                  const result = await response.json();

                  if (!result.success) {
                        throw new Error(result.message || "Failed to load events");
                  }

                  const mappedEvents = result.data.items.map((event: any) => ({
                        id: event.id,
                        title: event.title,
                        venue: `${event.venue}, ${event.city}`,
                        date: new Date(event.eventDate).toLocaleDateString(),
                        time: new Date(event.eventDate).toLocaleTimeString(),
                        category: "Event",
                        image: event.bannerUrl,
                        bannerUrl: event.bannerUrl,

                        revenue: "₦0",
                        status: event.status,
                  }));

                  setRows(mappedEvents);
            } catch (err) {
                  console.error(err);
                  setError((err as Error).message || "Failed to load events");
            } finally {
                  setIsLoading(false);
            }
      }, []);

      useEffect(() => {
            fetchEvents();
      }, [fetchEvents]);

      // Fetches full event details (with ticket types) from the API whenever
      // the "view" modal is opened for a given event id.
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
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "application/json",
                              },
                        });

                        const result = await response.json();

                        if (!response.ok || !result.success) {
                              throw new Error(result?.message || "Failed to load event details");
                        }

                        const event = result.data;
                        const startDate = new Date(event.eventDate);

                        if (cancelled) return;

                        setViewTarget({
                              id: event.id,
                              status: statusOverrides[event.id] ?? event.status ?? "Draft",
                              title: event.title,
                              category: "Event",
                              venue: event.venue,
                              state: event.state,
                              numberAttending: event.numberAttending ?? 0,
                              startDate: startDate.toLocaleDateString(),
                              startTime: startDate.toLocaleTimeString(),
                              bannerUrl: event.bannerUrl,

                              promoCode: DEFAULT_PROMO_CODE,
                              promoDiscount: DEFAULT_PROMO_DISCOUNT,
                              refundPolicy: event.eventPolicy || DEFAULT_REFUND_POLICY,
                              description: event.description || DEFAULT_DESCRIPTION,
                              ticketTiers: (event.ticketTypes ?? []).map((ticket: any) => ({
                                    id: ticket.id,
                                    name: ticket.name,
                                    price: `₦${ticket.price}`,
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
                              Authorization: `Bearer ${token}`,
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
            if (unpublishTarget) {
                  setStatusOverrides((prev) => ({
                        ...prev,
                        [unpublishTarget.id]: "Draft",
                  }));
            }

            setUnpublishTarget(null);
      };

      // Called when CreateEventModal closes, whether from create or edit flow —
      // refetches so the table/list reflects the latest data without a manual reload
      const handleCreateOrEditModalClose = () => {
            setEditTarget(null);
            setIsCreateModalOpen(false);
            fetchEvents();
      };

      if (isLoading) return <Loader />;

      return (
            <div className="flex min-h-screen bg-neutral-950 text-white">
                  <ResponsiveAdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                  <main className="min-w-0 flex-1">
                        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />

                        <div className="bg-neutral-950 p-4 md:p-8">
                              <EventsPageHeader onCreateClick={() => setIsCreateModalOpen(true)} />

                              <div className="rounded-2xl p-4 md:p-8" style={{ backgroundColor: "#111213" }}>
                                    <SearchFilterBar search={search} onSearchChange={setSearch} />

                                    {error && <p className="text-red-400 text-sm py-8 text-center">Couldn't load events: {error}</p>}

                                    {!error && (
                                          <>
                                                <EventsTable
                                                      events={rows}
                                                      onViewClick={(row) => setViewTargetId(row.id)}
                                                      onDeleteClick={setDeleteTarget}
                                                      onUnpublishClick={setUnpublishTarget}
                                                      onEditClick={setEditTarget}
                                                />

                                                <EventCardList
                                                      events={rows}
                                                      onViewClick={(row) => setViewTargetId(row.id)}
                                                      onDeleteClick={setDeleteTarget}
                                                      onUnpublishClick={setUnpublishTarget}
                                                />

                                                <EventsPagination />
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
                        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-8">
                              <EventDetails
                                    event={viewTarget}
                                    onClose={() => setViewTargetId(null)}
                                    onBack={() => setViewTargetId(null)}
                                    onEdit={() => {
                                          if (viewTarget) {
                                                setEditTarget({ id: viewTarget.id } as EventRowData);
                                          }
                                          setViewTargetId(null);
                                    }}
                              />
                        </div>
                  )}
            </div>
      );
}
