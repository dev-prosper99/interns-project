import { useEffect, useState } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import DashboardHeader from "@/components/DashBoard/AttendeeDashboard/DashboardHeader";
import { EventCard } from "@/components/cards/EventCard";
import { DashboardIcon, EventIcon, SettingsIcon, TicketIcon } from "@/assets/icons";
import EventsPagination from "@/components/Events/EventsPagination";
import { Input } from "@/components/ui/input";
import { ChevronDown, HeartIcon, Search } from "lucide-react";
import Loader from "@/components/layouts/Loader";

const API_BASE_URL = "https://peacemaker001-001-site1.ltempurl.com";

const priceRanges = [
      { label: "Under ₦5,000", value: "under-5000" },
      { label: "₦5,000 - ₦10,000", value: "5000-10000" },
      { label: "Above ₦10,000", value: "above-10000" },
];

const attendeeSidebarItems = [
      { label: "Dashboard", path: "/dashboard/attendee", icon: DashboardIcon },
      { label: "Discover Events", path: "/dashboard/attendee/events", icon: EventIcon },
      { label: "My Tickets", path: "/dashboard/attendee/tickets", icon: TicketIcon },
      { label: "Saved Events", path: "/dashboard/attendee/saved-events", icon: HeartIcon },
      { label: "Settings", path: "/dashboard/attendee/settings", icon: SettingsIcon },
];

type FilterSelectProps = {
      placeholder: string;
      options: string[];
      optionValues?: string[];
};

type EventListItem = {
      id: string;
      title: string;
      venue: string;
      city: string;
      eventDate: string;
      bannerUrl: string | null;
      status: string;
      organizerName: string;
};

type EventWithPrice = EventListItem & {
      minPrice: number | null;
};

type EventsApiResponse = {
      success: boolean;
      message?: string;
      data: { items: EventListItem[] };
};

type EventDetailApiResponse = {
      success: boolean;
      data: { ticketTypes?: Array<{ price: number }> };
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
      const [events, setEvents] = useState<EventWithPrice[]>([]);
      const [isLoading, setIsLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

      useEffect(() => {
            const controller = new AbortController();

            async function fetchEvents() {
                  try {
                        setIsLoading(true);
                        setError(null);

                        const response = await fetch(`${API_BASE_URL}/api/Events?page=1&pageSize=100`, {
                              headers: { Accept: "application/json" },
                              signal: controller.signal,
                        });

                        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

                        const result: EventsApiResponse = await response.json();
                        if (!result.success) throw new Error(result.message || "Failed to load events");

                        const eventsWithPrices = await Promise.all(
                              result.data.items.map(async (event) => {
                                    try {
                                          const detailResponse = await fetch(`${API_BASE_URL}/api/Events/${event.id}`, {
                                                headers: { Accept: "application/json" },
                                                signal: controller.signal,
                                          });
                                          const detail: EventDetailApiResponse = await detailResponse.json();
                                          const prices = detail.data.ticketTypes?.map((ticket) => ticket.price) ?? [];
                                          return { ...event, minPrice: prices.length ? Math.min(...prices) : null };
                                    } catch {
                                          return { ...event, minPrice: null };
                                    }
                              }),
                        );

                        setEvents(eventsWithPrices);
                  } catch (requestError) {
                        if ((requestError as Error).name !== "AbortError") {
                              setError((requestError as Error).message || "Something went wrong");
                        }
                  } finally {
                        if (!controller.signal.aborted) setIsLoading(false);
                  }
            }

            fetchEvents();
            return () => controller.abort();
      }, []);

      const categories = [...new Set(events.map((event) => event.status))].sort();
      const cities = [...new Set(events.map((event) => event.city || event.venue))].sort();
      const dates = [...new Set(events.map((event) => new Date(event.eventDate).toLocaleDateString()))].sort();

      if (isLoading) return <Loader />;

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
                                                {error && <p className="py-8 text-center text-red-400">Could not load events: {error}</p>}
                                                {!error && <p className="text-white">{events.length} events found</p>}
                                                {!error && (
                                                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                                            {events.map((event, i) => {
                                                                  const date = new Date(event.eventDate);
                                                                  return (
                                                                        <div key={`${event.id}-${i}`} className="flex min-w-0">
                                                                              <EventCard
                                                                                    eventId={event.id}
                                                                                    imageUrl={event.bannerUrl || "null"}
                                                                                    eventTitle={event.title}
                                                                                    eventCategory={event.status}
                                                                                    venue={`${event.venue}, ${event.city}`}
                                                                                    numberAttending={event.organizerName}
                                                                                    startDate={date.toLocaleDateString()}
                                                                                    startTime={date.toLocaleTimeString([], {
                                                                                          hour: "2-digit",
                                                                                          minute: "2-digit",
                                                                                    })}
                                                                                    ticketPrice={event.minPrice ?? 0}
                                                                              />
                                                                        </div>
                                                                  );
                                                            })}
                                                            <EventsPagination className="col-span-full w-full" />
                                                      </div>
                                                )}
                                          </div>
                                    </div>
                              </div>
                        </main>
                  </div>
            </div>
      );
};

export default DiscoverEvents;
