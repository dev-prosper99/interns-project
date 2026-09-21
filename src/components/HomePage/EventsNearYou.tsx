"use client";

import { LeftArrow, RightArrow } from "@/assets/icons";
import { EventCard } from "@/components/cards/EventCard";
import { useEffect, useRef, useState } from "react";

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

function SectionHeader({ title, subtitle, onScroll }: { title: string; subtitle: string; onScroll: (direction: "left" | "right") => void }) {
      return (
            <div className="flex items-center justify-between mb-8">
                  <div>
                        <h2 className="text-white text-2xl font-bold">{title}</h2>
                        <p className="text-neutral-400 text-sm mt-1">{subtitle}</p>
                  </div>
                  <div className="flex gap-2">
                        <button
                              type="button"
                              aria-label="Scroll events left"
                              onClick={() => onScroll("left")}
                              className="w-12.5 h-12.5 rounded-lg bg-neutral-900 flex items-center justify-center hover:bg-neutral-800 transition-colors"
                        >
                              <LeftArrow className="w-5 h-5 text-white" />
                        </button>
                        <button
                              type="button"
                              aria-label="Scroll events right"
                              onClick={() => onScroll("right")}
                              className="w-12.5 h-12.5 rounded-lg bg-neutral-900 flex items-center justify-center hover:bg-neutral-800 transition-colors"
                        >
                              <RightArrow className="w-5 h-5 text-white" />
                        </button>
                  </div>
            </div>
      );
}

export default function EventsNearYou() {
      const eventsTrackRef = useRef<HTMLDivElement>(null);
      const [events, setEvents] = useState<EventListItem[]>([]);
      const [isLoading, setIsLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

      useEffect(() => {
            const controller = new AbortController();
            async function fetchEvents() {
                  setIsLoading(true);
                  setError(null);
                  try {
                        const params = new URLSearchParams({
                              Page: "1",
                              PageSize: "20",
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
                        setEvents(json.data.items);
                  } catch (err) {
                        if ((err as Error).name !== "AbortError") {
                              setError((err as Error).message || "Something went wrong");
                        }
                  } finally {
                        setIsLoading(false);
                  }
            }
            fetchEvents();
            return () => controller.abort();
      }, []);

      const scrollEvents = (direction: "left" | "right") => {
            eventsTrackRef.current?.scrollBy({
                  left: direction === "right" ? 360 : -360,
                  behavior: "smooth",
            });
      };

      return (
            <div className="py-16 bg-neutral-950">
                  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <SectionHeader title="Events Near You" subtitle="Don't miss what is happening around you" onScroll={scrollEvents} />
                        {isLoading && <p className="text-neutral-400 text-sm">Loading events...</p>}
                        {error && !isLoading && <p className="text-red-400 text-sm">Error loading events. Please refresh</p>}
                        {!isLoading && !error && events.length === 0 && <p className="text-neutral-400 text-sm">No events near you yet.</p>}
                        {!isLoading && !error && events.length > 0 && (
                              <div
                                    ref={eventsTrackRef}
                                    className="flex w-full min-w-0 gap-6 overflow-x-auto overscroll-x-contain scroll-smooth no-scrollbar pb-2"
                              >
                                    {events.slice(5, 11).map((event) => {
                                          const date = new Date(event.eventDate);
                                          return (
                                                <div
                                                      key={event.id}
                                                      className="w-[calc(100vw-3rem)] min-w-[calc(100vw-3rem)] flex-none sm:w-80 sm:min-w-80 lg:w-88 lg:min-w-88"
                                                >
                                                      <EventCard
                                                            eventId={event.id}
                                                            imageUrl={event.bannerUrl || "null"}
                                                            eventTitle={event.title}
                                                            eventCategory={event.status}
                                                            venue={`${event.venue}, ${event.city}`}
                                                            numberAttending={event.status === "Published" ? event.organizerName : "N/A"}
                                                            startDate={date.toLocaleDateString()}
                                                            startTime={date.toLocaleTimeString([], {
                                                                  hour: "2-digit",
                                                                  minute: "2-digit",
                                                            })}
                                                            ticketPrice={event.status === "Published" ? "₦0" : "N/A"}
                                                      />
                                                </div>
                                          );
                                    })}
                              </div>
                        )}
                  </div>
            </div>
      );
}
