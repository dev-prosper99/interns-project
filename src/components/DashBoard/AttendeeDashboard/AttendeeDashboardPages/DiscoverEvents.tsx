import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { EventCard } from "@/components/cards/EventCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, Search, CalendarX } from "lucide-react";
import Loader from "@/components/layouts/Loader";

const API_BASE_URL = "https://peacemaker001-001-site1.ltempurl.com";
const PAGE_SIZE = 9;

const PRICE_RANGES = [
      { label: "Free", value: "free" },
      { label: "Under ₦5,000", value: "under-5000" },
      { label: "₦5,000 - ₦10,000", value: "5000-10000" },
      { label: "Above ₦10,000", value: "above-10000" },
];

const DATE_OPTIONS = [
      { label: "Today", value: "today" },
      { label: "Tomorrow", value: "tomorrow" },
      { label: "This Week", value: "this-week" },
      { label: "This Month", value: "this-month" },
];

interface EventListItem {
      id: string;
      title: string;
      venue: string;
      city: string;
      eventDate: string;
      bannerUrl: string | null;
      status: string;
      organizerName: string;
      numberAttending?: string | number;
      NumberAttending?: string | number;
      category?: string;
      eventCategory?: string;
}

interface EventsApiResponse {
      success: boolean;
      message?: string;
      data: {
            items: EventListItem[];
            totalCount: number;
      };
}

interface TicketType {
      price: number;
}

interface EventDetailApiResponse {
      success: boolean;
      data: {
            ticketTypes?: TicketType[];
      };
}

interface FilterSelectProps {
      placeholder: string;
      options: { label: string; value: string }[];
      value: string;
      onChange: (value: string) => void;
}

function resolveBannerUrl(url: string | null | undefined): string {
      if (!url || url === "null" || url === "undefined") return "";
      let cleanUrl = url.trim();
      if (cleanUrl.includes("localhost:7055")) {
            cleanUrl = cleanUrl.replace(/https?:\/\/localhost:7055/g, API_BASE_URL);
      } else if (cleanUrl.startsWith("/uploads") || cleanUrl.startsWith("uploads/")) {
            cleanUrl = `${API_BASE_URL}/${cleanUrl.replace(/^\/+/, "")}`;
      }
      return cleanUrl;
}

function FilterSelect({ placeholder, options, value, onChange }: FilterSelectProps) {
      return (
            <div className="relative min-w-0">
                  <select
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full appearance-none rounded-[10px] border border-neutral-900 bg-neutral-925 px-3 py-2 pr-9 text-xs text-neutral-300 outline-none transition-colors hover:border-neutral-700 focus:border-purple-500"
                  >
                        <option value="all">{placeholder}</option>
                        {options.map((opt, index) => (
                              <option key={`${opt.value}-${index}`} value={opt.value} className="bg-neutral-900 text-white">
                                    {opt.label}
                              </option>
                        ))}
                  </select>
                  <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
            </div>
      );
}

function matchesDate(dateStr: string, filter: string): boolean {
      if (!filter || filter === "all") return true;
      const d = new Date(dateStr);
      if (Number.isNaN(d.getTime())) return true;

      const eventDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      switch (filter) {
            case "today":
                  return eventDay.getTime() === today.getTime();
            case "tomorrow": {
                  const tomorrow = new Date(today);
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  return eventDay.getTime() === tomorrow.getTime();
            }
            case "this-week": {
                  const endOfWeek = new Date(today);
                  endOfWeek.setDate(endOfWeek.getDate() + (7 - today.getDay()));
                  return eventDay >= today && eventDay <= endOfWeek;
            }
            case "this-month":
                  return eventDay.getFullYear() === today.getFullYear() && eventDay.getMonth() === today.getMonth();
            default:
                  return true;
      }
}

function matchesPrice(minPrice: number | null, filter: string): boolean {
      if (!filter || filter === "all") return true;
      if (minPrice === null) return true;

      switch (filter) {
            case "free":
                  return minPrice === 0;
            case "under-5000":
                  return minPrice > 0 && minPrice <= 5000;
            case "5000-10000":
                  return minPrice > 5000 && minPrice <= 10000;
            case "above-10000":
                  return minPrice > 10000;
            default:
                  return true;
      }
}

const toSlug = (title: string) => title.trim().replace(/\s+/g, "-").toLowerCase();

export default function DiscoverEvents() {
      const navigate = useNavigate();
      const [events, setEvents] = useState<EventListItem[]>([]);
      const [priceMap, setPriceMap] = useState<Record<string, number | null>>({});
      const [isLoading, setIsLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

      const [search, setSearch] = useState("");
      const [category, setCategory] = useState("all");
      const [city, setCity] = useState("all");
      const [priceRange, setPriceRange] = useState("all");
      const [dateFilter, setDateFilter] = useState("all");
      const [currentPage, setCurrentPage] = useState(1);

      useEffect(() => {
            const controller = new AbortController();
            let isMounted = true;

            async function loadEvents() {
                  setIsLoading(true);
                  setError(null);
                  try {
                        const response = await fetch(`${API_BASE_URL}/api/Events?page=1&pageSize=50`, {
                              headers: { Accept: "application/json" },
                              signal: controller.signal,
                        });

                        if (!response.ok) {
                              throw new Error(`Server returned status ${response.status}`);
                        }

                        const result: EventsApiResponse = await response.json();
                        if (!result.success || !result.data?.items) {
                              throw new Error(result.message || "Failed to load events");
                        }

                        if (!isMounted) return;
                        setEvents(result.data.items);
                  } catch (err: unknown) {
                        if ((err as Error).name !== "AbortError" && isMounted) {
                              setError((err as Error).message || "Unable to fetch events.");
                        }
                  } finally {
                        if (isMounted) setIsLoading(false);
                  }
            }

            loadEvents();
            return () => {
                  isMounted = false;
                  controller.abort();
            };
      }, []);

      const categories = useMemo(() => {
            const map = new Map<string, string>();
            for (const e of events) {
                  const rawVal = e.category || e.eventCategory || e.status;
                  if (!rawVal) continue;
                  const trimmed = rawVal.trim();
                  const lower = trimmed.toLowerCase();
                  if (!map.has(lower)) {
                        map.set(lower, trimmed);
                  }
            }
            return Array.from(map.entries()).map(([value, label]) => ({
                  label,
                  value,
            }));
      }, [events]);

      const cities = useMemo(() => {
            const map = new Map<string, string>();
            for (const e of events) {
                  const cityName = (e.city || e.venue || "").trim();
                  if (!cityName) continue;
                  const lower = cityName.toLowerCase();
                  if (!map.has(lower)) {
                        map.set(lower, cityName);
                  }
            }
            return Array.from(map.entries()).map(([value, label]) => ({
                  label,
                  value,
            }));
      }, [events]);

      const filteredEvents = useMemo(() => {
            return events.filter((event) => {
                  const q = search.trim().toLowerCase();
                  const matchesSearch =
                        !q ||
                        event.title.toLowerCase().includes(q) ||
                        event.venue.toLowerCase().includes(q) ||
                        (event.city && event.city.toLowerCase().includes(q)) ||
                        (event.organizerName && event.organizerName.toLowerCase().includes(q));

                  const eventCat = (event.category || event.eventCategory || event.status || "").toLowerCase();
                  const matchesCat = category === "all" || eventCat === category.toLowerCase();

                  const eventCity = (event.city || event.venue || "").toLowerCase();
                  const matchesCityFilter = city === "all" || eventCity.includes(city.toLowerCase());

                  const minPrice = priceMap[event.id] ?? null;
                  const matchesPriceFilter = matchesPrice(minPrice, priceRange);

                  const matchesDateFilter = matchesDate(event.eventDate, dateFilter);

                  return matchesSearch && matchesCat && matchesCityFilter && matchesPriceFilter && matchesDateFilter;
            });
      }, [events, search, category, city, priceRange, dateFilter, priceMap]);

      const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE));
      const activePage = Math.min(currentPage, totalPages);
      const paginatedEvents = useMemo(() => {
            return filteredEvents.slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE);
      }, [filteredEvents, activePage]);

      useEffect(() => {
            const missingItems = paginatedEvents.filter((item) => priceMap[item.id] === undefined);
            if (missingItems.length === 0) return;

            let cancelled = false;

            async function fetchPagePrices() {
                  for (const item of missingItems) {
                        if (cancelled) break;
                        try {
                              const res = await fetch(`${API_BASE_URL}/api/Events/${encodeURIComponent(item.id)}`, {
                                    headers: { Accept: "application/json" },
                              });
                              if (res.ok) {
                                    const data: EventDetailApiResponse = await res.json();
                                    const prices = data?.data?.ticketTypes?.map((t) => t.price) ?? [];
                                    const min = prices.length > 0 ? Math.min(...prices) : 0;
                                    if (!cancelled) {
                                          setPriceMap((prev) => ({ ...prev, [item.id]: min }));
                                    }
                              } else {
                                    if (!cancelled) {
                                          setPriceMap((prev) => ({ ...prev, [item.id]: 0 }));
                                    }
                              }
                        } catch {
                              if (!cancelled) {
                                    setPriceMap((prev) => ({ ...prev, [item.id]: 0 }));
                              }
                        }
                  }
            }

            void fetchPagePrices();
            return () => {
                  cancelled = true;
            };
      }, [paginatedEvents, priceMap]);

      const handleClearFilters = () => {
            setSearch("");
            setCategory("all");
            setCity("all");
            setPriceRange("all");
            setDateFilter("all");
            setCurrentPage(1);
      };

      if (isLoading) return <Loader />;

      return (
            <div className="min-w-0 bg-neutral-925 pb-12 font-poppins">
                  <main className="mx-auto w-full px-4 py-6 md:px-8">
                        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                              <div>
                                    <h2 className="text-xl md:text-2xl font-bold font-jakarta text-white">Discover Events</h2>
                                    <p className="text-xs text-neutral-400 mt-1">Find and book your next live experience across Nigeria</p>
                              </div>
                              {/* <p className="text-xs text-neutral-400">
                                    Showing <span className="font-semibold text-white">{filteredEvents.length}</span> events
                              </p> */}
                        </div>

                        <div className="rounded-2xl bg-neutral-1000 p-4 md:p-6 border border-neutral-900 shadow-xl space-y-6">
                              <div className="grid grid-cols-1 gap-3 md:grid-cols-[2fr_repeat(4,minmax(0,1fr))] md:items-center">
                                    <Input
                                          type="text"
                                          placeholder="Search by title, venue, or artist..."
                                          value={search}
                                          onChange={(e) => {
                                                setSearch(e.target.value);
                                                setCurrentPage(1);
                                          }}
                                          leadingIcon={<Search className="h-4 w-4 text-neutral-400" />}
                                    />
                                    <FilterSelect
                                          placeholder="All Categories"
                                          options={categories}
                                          value={category}
                                          onChange={(v) => {
                                                setCategory(v);
                                                setCurrentPage(1);
                                          }}
                                    />
                                    <FilterSelect
                                          placeholder="All Cities"
                                          options={cities}
                                          value={city}
                                          onChange={(v) => {
                                                setCity(v);
                                                setCurrentPage(1);
                                          }}
                                    />
                                    <FilterSelect
                                          placeholder="All Prices"
                                          options={PRICE_RANGES}
                                          value={priceRange}
                                          onChange={(v) => {
                                                setPriceRange(v);
                                                setCurrentPage(1);
                                          }}
                                    />
                                    <FilterSelect
                                          placeholder="All Dates"
                                          options={DATE_OPTIONS}
                                          value={dateFilter}
                                          onChange={(v) => {
                                                setDateFilter(v);
                                                setCurrentPage(1);
                                          }}
                                    />
                              </div>

                              {error && <div className="rounded-xl border border-red-500/20 bg-red-950/20 p-6 text-center text-sm text-red-400">{error}</div>}

                              {!error && paginatedEvents.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                                          <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-3 text-neutral-500">
                                                <CalendarX className="w-6 h-6" />
                                          </div>
                                          <h3 className="text-base font-semibold text-white font-jakarta">No events found</h3>
                                          <p className="text-xs text-neutral-400 mt-1 max-w-sm">
                                                No events match your current search and filter criteria. Try resetting your filters.
                                          </p>
                                          <Button variant="neutral" size="sm" onClick={handleClearFilters} className="mt-4">
                                                Reset Filters
                                          </Button>
                                    </div>
                              )}

                              {!error && paginatedEvents.length > 0 && (
                                    <>
                                          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                                {paginatedEvents.map((item) => {
                                                      const date = new Date(item.eventDate);
                                                      const validDate = !Number.isNaN(date.getTime());
                                                      const resolvedPrice = priceMap[item.id];

                                                      return (
                                                            <div
                                                                  key={item.id}
                                                                  onClick={() =>
                                                                        navigate(`/dashboard/attendee/events/${encodeURIComponent(toSlug(item.title))}`)
                                                                  }
                                                                  className="cursor-pointer transition-transform duration-200 hover:-translate-y-1"
                                                            >
                                                                  <EventCard
                                                                        eventId={item.id}
                                                                        imageUrl={resolveBannerUrl(item.bannerUrl)}
                                                                        eventTitle={item.title}
                                                                        eventCategory={item.category || item.eventCategory || item.status || "Event"}
                                                                        venue={[item.venue, item.city].filter(Boolean).join(", ") || "Lagos, Nigeria"}
                                                                        numberAttending={String(item.numberAttending ?? item.NumberAttending ?? 0)}
                                                                        startDate={validDate ? date.toLocaleDateString() : "TBD"}
                                                                        startTime={
                                                                              validDate
                                                                                    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                                                                    : "TBD"
                                                                        }
                                                                        ticketPrice={resolvedPrice !== undefined && resolvedPrice !== null ? resolvedPrice : 0}
                                                                  />
                                                            </div>
                                                      );
                                                })}
                                          </div>

                                          {totalPages > 1 && (
                                                <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-neutral-900 pt-4 text-xs text-neutral-400 sm:flex-row">
                                                      <span>
                                                            Page {activePage} of {totalPages}
                                                      </span>
                                                      <div className="flex items-center gap-1.5">
                                                            <button
                                                                  type="button"
                                                                  disabled={activePage === 1}
                                                                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                                                  className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-neutral-300 transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
                                                            >
                                                                  Prev
                                                            </button>
                                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                                                  <button
                                                                        key={p}
                                                                        type="button"
                                                                        onClick={() => setCurrentPage(p)}
                                                                        className={`h-7 w-7 rounded-lg text-xs font-medium transition-colors ${
                                                                              p === activePage
                                                                                    ? "bg-purple-600 text-white font-semibold"
                                                                                    : "border border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
                                                                        }`}
                                                                  >
                                                                        {p}
                                                                  </button>
                                                            ))}
                                                            <button
                                                                  type="button"
                                                                  disabled={activePage === totalPages}
                                                                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                                                  className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-neutral-300 transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
                                                            >
                                                                  Next
                                                            </button>
                                                      </div>
                                                      <span>9 per page</span>
                                                </div>
                                          )}
                                    </>
                              )}
                        </div>
                  </main>
            </div>
      );
}
