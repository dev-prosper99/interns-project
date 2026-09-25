import { useEffect, useState } from "react";
import { EventIcon } from "@/assets/icons";

const API_BASE_URL = "https://peacemaker001-001-site1.ltempurl.com";

interface EventListItem {
      id: string;
      title: string;
      venue: string;
      city: string;
      eventDate: string;
      bannerUrl: string | null;
      status: string;
      organizerName: string;
}

interface EventsApiResponse {
      status: number;
      success: boolean;
      message: string;
      errors: string[];
      data: {
            items: EventListItem[];
            totalCount: number;
            page: number;
            pageSize: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
      };
}

interface TicketType {
      id: string;
      name: string;
      description: string;
      price: number;
      totalQuantity: number;
}

interface EventDetail {
      id: string;
      title: string;
      description: string;
      venue: string;
      state: string;
      city: string;
      eventDate: string;
      bannerUrl: string | null;
      eventPolicy: string;
      availabilityStart: string;
      availabilityEnd: string;
      status: string;
      organizerName: string;
      ticketTypes: TicketType[];
}

interface EventDetailApiResponse {
      status: number;
      success: boolean;
      message: string;
      errors: string[];
      data: EventDetail;
}

interface EventWithPrice extends EventListItem {
      minPrice: number | null;
      priceLoading: boolean;
}

async function fetchEventMinPrice(eventId: string, signal?: AbortSignal): Promise<number | null> {
      try {
            const token = localStorage.getItem("token");
            const cleanToken = token ? (token.startsWith("Bearer ") ? token.slice(7).trim() : token.trim()) : "";
            const res = await fetch(`${API_BASE_URL}/api/Events/${encodeURIComponent(eventId)}`, {
                  headers: {
                        Accept: "application/json",
                        ...(cleanToken ? { Authorization: `Bearer ${cleanToken}` } : {}),
                  },
                  signal,
            });
            if (!res.ok) return null;
            const json: EventDetailApiResponse = await res.json();
            if (!json.success || !json.data) return null;
            const prices = json.data.ticketTypes?.map((t) => t.price) ?? [];
            if (prices.length === 0) return null;
            return Math.min(...prices);
      } catch {
            return null;
      }
}

export default function SuggestedEvents() {
      const [events, setEvents] = useState<EventWithPrice[]>([]);
      const [isLoading, setIsLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

      useEffect(() => {
            const controller = new AbortController();
            let isMounted = true;

            async function fetchEvents() {
                  setIsLoading(true);
                  setError(null);
                  try {
                        const params = new URLSearchParams({
                              Page: "1",
                              PageSize: "6",
                        });
                        const res = await fetch(`${API_BASE_URL}/api/Events?${params.toString()}`, {
                              headers: { Accept: "application/json" },
                              signal: controller.signal,
                        });
                        if (!res.ok) {
                              throw new Error(`Request failed with status ${res.status}`);
                        }
                        const json: EventsApiResponse = await res.json();
                        if (!json.success) {
                              throw new Error(json.message || "Failed to load events");
                        }

                        const candidateItems = json.data.items.slice(3, 5);
                        const displayedItems = candidateItems.length > 0 ? candidateItems : json.data.items.slice(0, 2);

                        const withPricePlaceholders: EventWithPrice[] = displayedItems.map((item) => ({
                              ...item,
                              minPrice: null,
                              priceLoading: true,
                        }));

                        if (!isMounted) return;
                        setEvents(withPricePlaceholders);
                        setIsLoading(false);

                        for (const item of displayedItems) {
                              if (!isMounted) break;
                              const minPrice = await fetchEventMinPrice(item.id, controller.signal);
                              if (isMounted) {
                                    setEvents((prev) => prev.map((e) => (e.id === item.id ? { ...e, minPrice, priceLoading: false } : e)));
                              }
                        }
                  } catch (err: unknown) {
                        if ((err as Error).name !== "AbortError" && isMounted) {
                              setError((err as Error).message || "Something went wrong");
                        }
                        if (isMounted) {
                              setIsLoading(false);
                        }
                  }
            }

            fetchEvents();

            return () => {
                  isMounted = false;
                  controller.abort();
            };
      }, []);

      return (
            <div className="w-full h-full font-poppins">
                  <div className="bg-neutral-1000 py-4 rounded-2xl w-full h-full">
                        <div className="flex items-center justify-between border-b border-neutral-900 px-4 pb-2">
                              <p className="text-white text-sm">Events You Might Like</p>
                              <a href="/dashboard/attendee/events" className="text-purple-500 hover:underline text-xs">
                                    Discover
                              </a>
                        </div>
                        <div className="space-y-5 p-4">
                              {isLoading && <p className="text-neutral-400 text-sm">Loading events...</p>}
                              {error && !isLoading && <p className="text-red-400 text-sm">{error}</p>}
                              {!isLoading && !error && events.length === 0 && <p className="text-neutral-400 text-sm">No events found.</p>}
                              {!isLoading &&
                                    !error &&
                                    events.map((event) => {
                                          const date = new Date(event.eventDate);
                                          const formattedDate = date.toLocaleDateString();
                                          const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                                          return (
                                                <div
                                                      className="flex items-start gap-3 border-b w-full border-neutral-900 pb-4 last:border-none last:pb-0"
                                                      key={event.id}
                                                >
                                                      <img
                                                            src={event.bannerUrl || ""}
                                                            alt={event.title}
                                                            loading="lazy"
                                                            className="w-12 h-12 rounded-full object-cover bg-neutral-800"
                                                      />
                                                      <div className="flex md:flex-nowrap gap-3 w-full flex-wrap items-center justify-between">
                                                            <div className="flex flex-col">
                                                                  <p className="text-white text-sm md:text-lg mb-2 font-medium">{event.title}</p>
                                                                  <p className="text-neutral-400 text-xs flex items-center gap-2 mb-1">
                                                                        <EventIcon className="text-orange-600" /> {formattedDate} - {formattedTime}
                                                                  </p>
                                                                  <p className="text-orange-600 text-lg font-bold">
                                                                        {event.priceLoading
                                                                              ? "..."
                                                                              : event.minPrice === 0
                                                                                ? "Free"
                                                                                : `₦${Number(event.minPrice ?? 0).toLocaleString("en-NG")}`}
                                                                  </p>
                                                            </div>
                                                      </div>
                                                </div>
                                          );
                                    })}
                        </div>
                  </div>
            </div>
      );
}
