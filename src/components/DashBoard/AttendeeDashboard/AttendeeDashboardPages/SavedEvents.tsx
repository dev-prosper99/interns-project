import { useState } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import DashboardHeader from "@/components/Dashboard/AttendeeDashboard/DashboardHeader";
import { DashboardIcon, EventIcon, SettingsIcon, TicketIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { HeartIcon } from "lucide-react";
import EventsPagination from "@/components/Events/EventsPagination";
import { EventCard } from "@/components/cards/EventCard";
import { Events } from "@/constants/events";

const attendeeSidebarItems = [
      { label: "Dashboard", path: "/dashboard", icon: DashboardIcon },
      { label: "Discover Events", path: "/discover-events", icon: EventIcon },
      { label: "My Tickets", path: "/my-tickets", icon: TicketIcon },
      { label: "Saved Events", path: "/saved-events", icon: HeartIcon },
      { label: "Settings", path: "/my-settings", icon: SettingsIcon },
];

const SavedEvents = () => {
      const [isSidebarOpen, setIsSidebarOpen] = useState(false);
      const navigate = useNavigate();

      return (
            <div className="flex ">
                  <div className="hidden lg:block">
                        <Sidebar items={attendeeSidebarItems} />
                  </div>

                  <div className="min-w-0 flex-1 bg-neutral-925 pb-10">
                        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} title="Saved Events" />

                        {isSidebarOpen && (
                              <>
                                    <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
                                    <div className="fixed left-0 top-0 h-full sm:w-64 max-w-xs z-50 lg:hidden overflow-y-auto">
                                          <div className="p-4 bg-neutral-1000 min-h-full">
                                                <div className="flex items-center justify-end mb-6">
                                                      <button
                                                            onClick={() => setIsSidebarOpen(false)}
                                                            aria-label="Close menu"
                                                            className="p-2 rounded-md hover:bg-white/10 text-white"
                                                      >
                                                            ×
                                                      </button>
                                                </div>
                                                <Sidebar items={attendeeSidebarItems} />
                                          </div>
                                    </div>
                              </>
                        )}

                        <main className="mx-auto w-full max-w-7xl px-4 py-5 ">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <p className="text-white sm:text-xl text-lg font-medium font-jakarta">All events in your wish list</p>

                                    <Button variant="yellow" className="md:w-auto w-1/2" onClick={() => navigate("/events")}>
                                          Discover Events
                                    </Button>
                              </div>

                              <div className="mt-5 w-full font-poppins">
                                    <div className="rounded-2xl p-4 space-y-7 bg-neutral-1000">
                                          <div className="space-y-2 w-full">
                                                <p className="text-white">3 events found</p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6  xl:grid-cols-3">
                                                      {Events.slice(0, 3).map((event, i) => (
                                                            <div key={`${event.eventTitle}-${i}`} className="flex min-w-0">
                                                                  <EventCard
                                                                        onClick={() =>
                                                                              navigate(
                                                                                    `/discover-events/${event.eventTitle.trim().replace(/\s+/g, "-").toLowerCase()}`,
                                                                              )
                                                                        }
                                                                        imageUrl={event.imageUrl}
                                                                        eventTitle={event.eventTitle}
                                                                        eventCategory={event.eventCategory}
                                                                        venue={event.venue}
                                                                        numberAttending={event.numberAttending}
                                                                        startDate={event.startDate}
                                                                        startTime={event.startTime}
                                                                        ticketPrice={event.regular_ticketPrice}
                                                                  />
                                                            </div>
                                                      ))}
                                                      <EventsPagination className="col-span-full w-full" />
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </main>
                  </div>
            </div>
      );
};

export default SavedEvents;
