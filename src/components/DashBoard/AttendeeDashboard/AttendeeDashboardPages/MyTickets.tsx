import { useState } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import DashboardHeader from "@/components/Dashboard/AttendeeDashboard/DashboardHeader";
import { DashboardIcon, EventIcon, SettingsIcon, TicketIcon } from "@/assets/icons";
import EventsPagination from "@/components/Events/EventsPagination";
import TicketsCard from "../../../cards/TicketsCard";
import { Events } from "@/constants/events";
import { HeartIcon } from "lucide-react";
import QRCodeModal from "../Sections/MyTicketsSections/QRCodeModal";

const attendeeSidebarItems = [
      { label: "Dashboard", path: "/Dashboard", icon: DashboardIcon },
      { label: "Discover Events", path: "/discover-events", icon: EventIcon },
      { label: "My Tickets", path: "/my-tickets", icon: TicketIcon },
      { label: "Saved Events", path: "/saved-events", icon: HeartIcon },
      { label: "Settings", path: "/my-settings", icon: SettingsIcon },
];

const tab = [
      { name: "All", count: 4 },
      { name: "Upcoming", count: 4 },
      { name: "Used", count: 0 },
      { name: "Concluded", count: 0 },
];

const MyTickets = () => {
      const [isSidebarOpen, setIsSidebarOpen] = useState(false);
      const [activeTab, setActiveTab] = useState("All");
      const [isOpen, setIsOpen] = useState(false);
      const [selectedEvent, setSelectedEvent] = useState<(typeof Events)[number] | null>(null);
      const activeTabCount = tab.find((item) => item.name === activeTab)?.count ?? 0;

      const handleTicketClick = (event: (typeof Events)[number]) => {
            setSelectedEvent(event);
            setIsOpen(true);
      };

      return (
            <div className="flex ">
                  <div className="hidden lg:block">
                        <Sidebar items={attendeeSidebarItems} />
                  </div>

                  <div className="min-w-0 flex-1 bg-neutral-925 pb-10">
                        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} title="My Tickets" />

                        {isSidebarOpen && (
                              <>
                                    <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
                                    <div className="fixed inset-y-0 left-0 z-50 w-[min(21rem,88vw)] lg:hidden">
                                          <Sidebar items={attendeeSidebarItems} onClose={() => setIsSidebarOpen(false)} />
                                    </div>
                              </>
                        )}

                        <main className="mx-auto w-full max-w-7xl py-5 px-4 ">
                              <p className="text-lg font-medium font-jakarta text-white sm:text-xl">All your purchased tickets in one place</p>

                              <div className="mt-5 w-full font-poppins">
                                    <div className="rounded-2xl p-6 space-y-7 bg-neutral-1000">
                                          <div className="mb-6 flex w-full flex-wrap items-center gap-2 sm:gap-4">
                                                {tab.map((tabs, index) => (
                                                      <div
                                                            key={index}
                                                            onClick={() => setActiveTab(tabs.name)}
                                                            className={`flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border px-2 py-2 text-center text-xs text-white sm:flex-none sm:px-3 sm:text-sm ${
                                                                  activeTab === tabs.name
                                                                        ? "border-purple-600/24 bg-purple-600/24 text-purple-500!"
                                                                        : "border-neutral-900"
                                                            }`}
                                                      >
                                                            {tabs.name}
                                                            <span
                                                                  className={`rounded-full bg-neutral-800 px-2 py-1 text-white sm:px-3
                                                            ${activeTab === tabs.name ? "border-purple-600 bg-purple-600" : "border-neutral-900"}
                                                                  `}
                                                            >
                                                                  {tabs.count}
                                                            </span>
                                                      </div>
                                                ))}
                                          </div>

                                          {activeTabCount === 0 ? (
                                                <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-800 px-6 py-16 text-center">
                                                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900">
                                                            <TicketIcon className="h-8 w-8 text-neutral-500" />
                                                      </div>
                                                      <p className="text-lg font-semibold text-white">No active tickets</p>
                                                      <p className="mt-2 max-w-sm text-sm text-neutral-400">
                                                            You don&apos;t have any {activeTab.toLowerCase()} tickets at the moment.
                                                      </p>
                                                </div>
                                          ) : (
                                                <div className="space-y-2 w-full">
                                                      <p className="text-white">6 tickets found</p>
                                                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 ">
                                                            {Events.slice(0, 4).map((event, i) => (
                                                                  <div key={`${event.eventTitle}-${i}`} className="flex min-w-0 w-full">
                                                                        <TicketsCard
                                                                              onClick={() => handleTicketClick(event)}
                                                                              image={event.imageUrl}
                                                                              title={event.eventTitle}
                                                                              date={event.startDate}
                                                                              venue={event.venue}
                                                                              time={event.startTime}
                                                                              ticketPrice={event.regular_ticketPrice}
                                                                              category="Upcoming"
                                                                              type="Regular"
                                                                              numberOfTicket="2"
                                                                              ticketID="TXO-2026-7481"
                                                                        />
                                                                  </div>
                                                            ))}
                                                            <EventsPagination className="col-span-full w-full" />
                                                      </div>
                                                </div>
                                          )}
                                    </div>
                              </div>
                        </main>
                  </div>
                  {isOpen && selectedEvent && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                              <QRCodeModal
                                    onClose={() => {
                                          setIsOpen(false);
                                          setSelectedEvent(null);
                                    }}
                                    title={selectedEvent.eventTitle}
                                    ticketID="TXO-2026-7481"
                                    type="Regular"
                                    numberOfTicket={2}
                              />
                        </div>
                  )}
            </div>
      );
};

export default MyTickets;
