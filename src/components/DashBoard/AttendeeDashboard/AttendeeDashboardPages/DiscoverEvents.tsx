import { useState } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import DashboardHeader from "@/components/Dashboard/AttendeeDashboard/DashboardHeader";
import { EventCard } from "@/components/cards/EventCard";
import { Events } from "@/constants/events";
import { DashboardIcon, EventIcon, SettingsIcon, TicketIcon } from "@/assets/icons";
import EventsPagination from "@/components/Events/EventsPagination";
import { Input } from "@/components/ui/input";
import { ChevronDown, HeartIcon, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = [...new Set(Events.map((event) => event.eventCategory))].sort();
const cities = [...new Set(Events.map((event) => event.venue.split(",").pop()?.trim() || event.venue))].sort();

const priceRanges = [
      { label: "Under ₦5,000", value: "under-5000" },
      { label: "₦5,000 - ₦10,000", value: "5000-10000" },
      { label: "Above ₦10,000", value: "above-10000" },
];

const dates = [...new Set(Events.map((event) => event.startDate))].sort();
const attendeeSidebarItems = [
      { label: "Dashboard", path: "/Dashboard", icon: DashboardIcon },
      { label: "Discover Events", path: "/discover-events", icon: EventIcon },
      { label: "My Tickets", path: "/my-tickets", icon: TicketIcon },
      { label: "Saved Events", path: "/saved-events", icon: HeartIcon },
      { label: "Settings", path: "/my-settings", icon: SettingsIcon },
];

type FilterSelectProps = {
      placeholder: string;
      options: string[];
      optionValues?: string[];
};

function FilterSelect({ placeholder, options, optionValues }: FilterSelectProps) {
      return (
            <div className="relative min-w-0">
                  <select
                        defaultValue="all"
                        className="w-full appearance-none rounded-[10px] border border-neutral-925 bg-neutral-925 px-3 py-2 pr-10 text-sm text-neutral-400 outline-none focus:border-orange-500"
                  >
                        <option value="all">{placeholder}</option>
                        {options.map((option, index) => (
                              <option key={option} value={optionValues?.[index] || option}>
                                    {option}
                              </option>
                        ))}
                  </select>
                  <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            </div>
      );
}

const DiscoverEvents = () => {
      const [isSidebarOpen, setIsSidebarOpen] = useState(false);
      const navigate = useNavigate();

      return (
            <div className="flex min-h-screen">
                  <div className="hidden lg:block">
                        <Sidebar items={attendeeSidebarItems} />
                  </div>

                  <div className="min-w-0 flex-1 bg-neutral-925 pb-10">
                        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} title="Discover Events" />

                        {isSidebarOpen && (
                              <>
                                    <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
                                    <div className="fixed inset-y-0 left-0 z-50 w-[min(21rem,88vw)] lg:hidden">
                                          <Sidebar items={attendeeSidebarItems} onClose={() => setIsSidebarOpen(false)} />
                                    </div>
                              </>
                        )}

                        <main className="mx-auto w-full max-w-7xl px-4 py-5 ">
                              <p className="text-lg font-medium font-jakarta text-white sm:text-xl">Find your next unforgettable experience</p>

                              <div className="mt-5 w-full font-poppins">
                                    <div className="rounded-2xl p-4 space-y-7 bg-neutral-1000">
                                          <div className="">
                                                <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-[2.5fr_repeat(4,minmax(0,1fr))] md:items-center md:gap-4">
                                                      <Input
                                                            type="text"
                                                            placeholder="Search events..."
                                                            leadingIcon={<Search className="h-5 w-5 text-neutral-400" />}
                                                      />
                                                      <FilterSelect placeholder="All Categories" options={categories} />
                                                      <FilterSelect placeholder="All Cities" options={cities} />
                                                      <FilterSelect
                                                            placeholder="All Prices"
                                                            options={priceRanges.map((range) => range.label)}
                                                            optionValues={priceRanges.map((range) => range.value)}
                                                      />
                                                      <FilterSelect placeholder="All Dates" options={dates} />
                                                </div>
                                          </div>

                                          <div className="space-y-2 w-full">
                                                <p className="text-white">6 events found</p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6  xl:grid-cols-3">
                                                      {Events.slice(0, 6).map((event, i) => (
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

export default DiscoverEvents;
