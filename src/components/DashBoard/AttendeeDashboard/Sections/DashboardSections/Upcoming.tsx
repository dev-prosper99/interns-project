import { useEffect, useState } from "react";
import { LocationIcon, EventIcon } from "@/assets/icons";
import { Link } from "react-router-dom";

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
      };
}

interface EventWithPrice extends EventListItem {
      minPrice: number | null;
      priceLoading: boolean;
}

export default function Upcoming() {
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
                              PageSize: "3",
                        });
                        const res = await fetch(`${API_BASE_URL}/api/Events?${params.toString()}`, {
                              headers: { Accept: "application/json" },
                              signal: controller.signal,
                        });

                        if (!res.ok) {
                              throw new Error(`Request failed with status ${res.status}`);
                        }

                        const json: EventsApiResponse = await res.json();
                        if (!json.success || !json.data?.items) {
                              throw new Error(json.message || "Failed to load events");
                        }

                        if (!isMounted) return;

                        const mappedEvents: EventWithPrice[] = json.data.items.slice(0, 3).map((item) => ({
                              ...item,
                              minPrice: 0,
                              priceLoading: false,
                        }));

                        setEvents(mappedEvents);
                  } catch (err: unknown) {
                        if ((err as Error).name !== "AbortError" && isMounted) {
                              setError((err as Error).message || "Something went wrong");
                        }
                  } finally {
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
            <div className="w-full font-poppins">
                  <div className="bg-neutral-1000 py-4 rounded-2xl w-full">
                        <div className="flex items-center justify-between border-b border-neutral-900 px-4 pb-2">
                              <p className="text-white text-sm">Your Upcoming Events</p>
                              <Link to="/dashboard/attendee/events" className="text-purple-500 hover:underline text-xs">
                                    View all
                              </Link>
                        </div>
                        <div className="space-y-5 p-4">
                              {isLoading && <p className="text-neutral-400 text-sm">Loading events...</p>}
                              {error && !isLoading && <p className="text-red-400 text-sm">{error}</p>}
                              {!isLoading && !error && events.length === 0 && <p className="text-neutral-400 text-sm">No upcoming events found.</p>}
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
                                                                  <p className="text-white text-sm md:text-lg mb-3 font-medium">{event.title}</p>
                                                                  <p className="text-neutral-400 text-xs flex items-center gap-2 mb-2">
                                                                        <LocationIcon className="text-orange-600" /> {event.venue}, {event.city}
                                                                  </p>
                                                                  <p className="text-neutral-400 text-xs flex items-center gap-2 mb-3">
                                                                        <EventIcon className="text-orange-600" /> {formattedDate} - {formattedTime}
                                                                  </p>
                                                                  <div className="flex items-center gap-2">
                                                                        <div className="rounded-2xl bg-green-400/20 text-green-600/80 font-normal text-xs px-3 py-0.5">
                                                                              Regular
                                                                        </div>
                                                                        <span className="text-neutral-400 text-xs"> 2</span>
                                                                  </div>
                                                            </div>
                                                            <div className="flex flex-col items-end gap-1">
                                                                  <p className="sm:block hidden text-neutral-400 text-sm">Paid</p>
                                                                  <p className="text-orange-600 text-lg font-bold">
                                                                        {event.minPrice === 0
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
