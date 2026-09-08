import { useState, useEffect } from "react";
import { Events } from "@/constants/events";

import DashboardHeader from "./DashboardHeader";
import EventsPageHeader from "./EventsPageHeader";
import SearchFilterBar from "./SearchFilterBar";
import EventsTable from "./EventsTable";
import EventCardList from "./EventCardList";
import EventsPagination from "./EventsPagination";
import DeleteEventModal from "./DeleteEventModal";
import UnpublishEventModal from "./UnpublishEventModal";
import EventDetails from "./EventsDetails";
import CreateEventModal from "../Dashboard/AdminDashboard/CreateEvent/CreateEventModal";

import type { EventRowData } from "./Types";

import Sidebar from "../layouts/Sidebar";

import { splitVenue, DEFAULT_PROMO_CODE, DEFAULT_PROMO_DISCOUNT, DEFAULT_REFUND_POLICY, DEFAULT_DESCRIPTION, type EventDetailData } from "./EventsDetailsTypes";

import events1 from "@/assets/event-1.png";
import events2 from "@/assets/event-2.png";
import events3 from "@/assets/event-3.png";
import events4 from "@/assets/event-4.png";

const eventImages = [events1, events2, events3, events4];

const hardcodedStatus = ["Published", "Published", "Published", "Draft"];

export default function EventsPage() {
      const [search, setSearch] = useState("");
      const [rows, setRows] = useState<EventRowData[]>([]);

      const [statusOverrides, setStatusOverrides] = useState<Record<string | number, string>>({});

      const [deleteTarget, setDeleteTarget] = useState<EventRowData | null>(null);

      const [unpublishTarget, setUnpublishTarget] = useState<EventRowData | null>(null);

      const [viewTargetId, setViewTargetId] = useState<string | number | null>(null);
      const [editTarget, setEditTarget] = useState<EventRowData | null>(null);

      useEffect(() => {
            const fetchEvents = async () => {
                  try {
                        const token = localStorage.getItem("token");

                        const response = await fetch("https://ticketing-management-system-be.onrender.com/api/Events", {
                              method: "GET",
                              headers: {
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "application/json",
                              },
                        });

                        const result = await response.json();

                        const mappedEvents = result.data.items.map((event: any) => ({
                              id: event.id,
                              title: event.title,
                              venue: `${event.venue}, ${event.city}`,
                              date: new Date(event.eventDate).toLocaleDateString(),
                              time: new Date(event.eventDate).toLocaleTimeString(),
                              category: "Event",
                              image: event.bannerUrl,
                              revenue: "₦0",
                              status: event.status,
                        }));

                        setRows(mappedEvents);
                  } catch (error) {
                        console.error(error);
                  }
            };

            fetchEvents();
      }, []);

      const viewTarget: EventDetailData | null =
            viewTargetId !== null && typeof viewTargetId === "number"
                  ? (() => {
                          const raw = Events[viewTargetId];

                          if (!raw) {
                                return null;
                          }

                          const { venue, state } = splitVenue(raw.venue);

                          return {
                                id: viewTargetId,

                                status: statusOverrides[viewTargetId] ?? hardcodedStatus[viewTargetId],

                                title: raw.eventTitle,
                                category: raw.eventCategory,

                                venue,
                                state,

                                numberAttending: raw.numberAttending,

                                startDate: raw.startDate,
                                startTime: raw.startTime,

                                image: eventImages[viewTargetId],

                                promoCode: DEFAULT_PROMO_CODE,
                                promoDiscount: DEFAULT_PROMO_DISCOUNT,

                                refundPolicy: DEFAULT_REFUND_POLICY,

                                description: DEFAULT_DESCRIPTION,

                                ticketTiers: [
                                      {
                                            id: "regular",
                                            name: "Regular",
                                            price: `₦${raw.regular_ticketPrice}`,
                                      },
                                      {
                                            id: "vip",
                                            name: "VIP",
                                            price: `₦${raw.vip_ticketPrice}`,
                                      },
                                      {
                                            id: "vvip",
                                            name: "VVIP",
                                            price: `₦${raw.vvip_ticketPrice}`,
                                      },
                                ],
                          };
                    })()
                  : null;

      const handleConfirmDelete = async () => {
            if (!deleteTarget) return;

            try {
                  const token = localStorage.getItem("token");

                  const response = await fetch(`https://ticketing-management-system-be.onrender.com/api/Events/${deleteTarget.id}`, {
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

      return (
            <div className="flex min-h-screen bg-neutral-950 text-white">
                  <Sidebar />

                  <main className="flex-1  ">
                        <DashboardHeader />

                        <div className="bg-neutral-950 p-4 md:p-8">
                              <EventsPageHeader />

                              <div className="rounded-2xl p-4 md:p-8" style={{ backgroundColor: "#111213" }}>
                                    <SearchFilterBar search={search} onSearchChange={setSearch} />

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
                              </div>
                        </div>
                  </main>

                  {deleteTarget && <DeleteEventModal onCancel={() => setDeleteTarget(null)} onConfirm={handleConfirmDelete} />}
                  {editTarget && <CreateEventModal isOpen={true} eventId={editTarget.id} onClose={() => setEditTarget(null)} />}

                  {unpublishTarget && <UnpublishEventModal onCancel={() => setUnpublishTarget(null)} onConfirm={handleConfirmUnpublish} />}

                  {viewTarget && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-8">
                              <EventDetails
                                    event={viewTarget}
                                    onClose={() => setViewTargetId(null)}
                                    onBack={() => setViewTargetId(null)}
                                    onEdit={() => {
                                          // TODO: wire to actual edit flow
                                          // once that page/route exists.
                                          setViewTargetId(null);
                                    }}
                              />
                        </div>
                  )}
            </div>
      );
}
