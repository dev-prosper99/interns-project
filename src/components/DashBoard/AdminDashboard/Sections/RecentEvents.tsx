import { useEffect, useState } from "react";
import { CalenderIcon } from "@/assets/icons";

interface EventItem {
      id: string;
      title: string;
      bannerUrl: string;
      eventDate: string;
      status: string;
      venue: string;
      city: string;
      organizerName: string;
}

interface ApiEventItem {
      id?: string | number;
      Id?: string | number;
      title?: string;
      Title?: string;
      bannerUrl?: string;
      BannerUrl?: string;
      eventDate?: string;
      EventDate?: string;
      availabilityStart?: string;
      AvailabilityStart?: string;
      status?: string;
      Status?: string;
      venue?: string;
      Venue?: string;
      city?: string;
      City?: string;
      organizerName?: string;
      OrganizerName?: string;
}

interface EventsApiResponse {
      success?: boolean;
      message?: string;
      data?: { items?: ApiEventItem[] };
}

const RecentEvents = ({ refreshKey = 0 }: { refreshKey?: number }) => {
      const [recentEvents, setRecentEvents] = useState<EventItem[]>([]);
      const [loadError, setLoadError] = useState("");

      useEffect(() => {
            let cancelled = false;

            const fetchEvents = async () => {
                  setLoadError("");
                  try {
                        const userId = localStorage.getItem("userId");

                        if (!userId) {
                              console.error("User ID not found");
                              return;
                        }

                        const token = localStorage
                              .getItem("token")
                              ?.replace(/^Bearer\s+/i, "")
                              .trim();
                        const query = new URLSearchParams({ page: "1", pageSize: "100" });
                        const response = await fetch(
                              `https://peacemaker001-001-site1.ltempurl.com/api/Events/my-events/${encodeURIComponent(userId)}?${query.toString()}`,
                              {
                                    headers: {
                                          Accept: "application/json",
                                          ...(token ? { Authorization: `Bearer ${token}` } : {}),
                                    },
                              },
                        );

                        if (response.status === 401) {
                              throw new Error("Your login session may have expired. Log in again to view your events.");
                        }
                        if (response.status === 403) {
                              throw new Error("Your account is not authorized to view these events. Refresh or log in again.");
                        }
                        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
                        const data = (await response.json()) as EventsApiResponse;
                        if (!data.success) throw new Error(data.message || "Failed to fetch events");

                        if (cancelled) return;
                        setRecentEvents(
                              (data.data?.items ?? []).map((event) => ({
                                    id: String(event.id ?? event.Id ?? ""),
                                    title: event.title ?? event.Title ?? "Untitled Event",
                                    bannerUrl: event.bannerUrl ?? event.BannerUrl ?? "",
                                    eventDate: event.eventDate ?? event.EventDate ?? event.availabilityStart ?? event.AvailabilityStart ?? "",
                                    status: event.status ?? event.Status ?? "Draft",
                                    venue: event.venue ?? event.Venue ?? "",
                                    city: event.city ?? event.City ?? "",
                                    organizerName: event.organizerName ?? event.OrganizerName ?? "",
                              })),
                        );
                  } catch (error) {
                        if (!cancelled) {
                              console.error("Failed to fetch events:", error);
                              setLoadError(
                                    error instanceof TypeError
                                          ? "The server connection was interrupted. Refresh the page and try again; if it continues, log in again."
                                          : error instanceof Error
                                            ? error.message
                                            : "Unable to load events. Refresh the page and try again.",
                              );
                        }
                  }
            };

            void fetchEvents();
            return () => {
                  cancelled = true;
            };
      }, [refreshKey]);
      return (
            <div className="bg-neutral-1000 rounded-2xl p-6 h-full flex flex-col">
                  <h2 className="text-2xl font-semibold text-white mb-6">Recent Events</h2>
                  {loadError && (
                        <p className="mb-3 text-sm text-red-400" role="alert">
                              {loadError}
                        </p>
                  )}

                  <div className="divide-y divide-[#252525] flex-1 overflow-auto">
                        {recentEvents.slice(0, 3).map((event) => (
                              <div key={event.id} className="flex items-center justify-between py-5">
                                    <div className="flex items-center gap-4">
                                          <img src={event.bannerUrl} alt={event.title} className="w-14 h-14 rounded-full object-cover" />

                                          <div>
                                                <h3 className="text-xl font-semibold text-white">{event.title}</h3>

                                                <div className="flex items-center gap-2 mt-2 text-gray-400 text-sm">
                                                      <CalenderIcon className="w-4 h-4" />
                                                      <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                                                </div>
                                          </div>
                                    </div>

                                    <span className="px-4 py-1.5 rounded-full bg-orange-500/20 text-orange-400 text-sm font-medium">{event.status}</span>
                              </div>
                        ))}
                  </div>
            </div>
      );
};

export default RecentEvents;
