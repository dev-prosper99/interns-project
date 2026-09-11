import { useEffect, useState } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import DashboardHeader from "@/components/DashBoard/AdminDashboard/Sections/DashboardHeader";
import { DashboardIcon, EventIcon, SettingsIcon, TicketIcon, LocationIcon } from "@/assets/icons";
import { Events } from "@/constants/events";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { FaMinus } from "react-icons/fa";
import { PiPlus } from "react-icons/pi";
import GetTicketModal from "./GetTicketModal";
import Loader from "@/components/layouts/Loader";

const attendeeSidebarItems = [
      { label: "Dashboard", path: "/Dashboard", icon: DashboardIcon },
      { label: "Discover Events", path: "/discover-events", icon: EventIcon },
      { label: "My Tickets", path: "/my-tickets", icon: TicketIcon },
      { label: "Settings", path: "/my-settings", icon: SettingsIcon },
];

type TicketType = "regular" | "vip" | "vvip";

type TicketQuantities = Record<TicketType, number>;
type EventDetailLocationState = { ticketQuantities?: TicketQuantities };

type ApiTicketType = {
      name: string;
      price: number;
};

type ApiEvent = {
      id?: string;
      title: string;
      description?: string;
      venue: string;
      city?: string;
      eventDate: string;
      bannerUrl?: string;
      organizerName?: string;
      ticketTypes?: ApiTicketType[];
};

type DisplayEvent = (typeof Events)[number] & {
      description?: string;
      organizerName?: string;
};

type ApiEventResponse = {
      success: boolean;
      message?: string;
      data: ApiEvent;
};

type ApiEventListResponse = {
      success: boolean;
      message?: string;
      data: {
            items: Array<{ id: string; title: string }>;
      };
};

const API_BASE_URL = "https://peacemaker001-001-site1.ltempurl.com";

const toEventSlug = (value: string) => value.trim().replace(/\s+/g, "-").toLowerCase();

function toDisplayEvent(apiEvent: ApiEvent): DisplayEvent {
      const date = new Date(apiEvent.eventDate);
      const ticketTypes = apiEvent.ticketTypes ?? [];
      const priceFor = (name: string, fallbackIndex: number) =>
            ticketTypes.find((ticket) => ticket.name.toLowerCase().includes(name))?.price ?? ticketTypes[fallbackIndex]?.price ?? 0;

      return {
            imageUrl: apiEvent.bannerUrl || "",
            eventTitle: apiEvent.title,
            eventCategory: "Event",
            venue: [apiEvent.venue, apiEvent.city].filter(Boolean).join(", "),
            numberAttending: "0",
            startDate: date.toLocaleDateString(),
            startTime: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            regular_ticketPrice: String(priceFor("regular", 0)),
            vip_ticketPrice: String(priceFor("vip", 1)),
            vvip_ticketPrice: String(priceFor("vvip", 2)),
            description: apiEvent.description,
            organizerName: apiEvent.organizerName,
      };
}

const DiscoverEventsDetails = () => {
      const [isSidebarOpen, setIsSidebarOpen] = useState(false);
      const navigate = useNavigate();
      const location = useLocation();
      const { title } = useParams<{ title: string }>();
      const locationState = location.state as EventDetailLocationState | null;
      const localEvent: DisplayEvent | undefined = Events.find((item) => toEventSlug(item.eventTitle) === title?.toLowerCase());
      const [apiEvent, setApiEvent] = useState<DisplayEvent | null>(null);
      const [isLoading, setIsLoading] = useState(true);
      const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
      const [ticketQuantities, setTicketQuantities] = useState<TicketQuantities>(locationState?.ticketQuantities ?? { regular: 0, vip: 0, vvip: 0 });
      const [isOpen, setIsOpen] = useState(false);

      useEffect(() => {
            const controller = new AbortController();

            fetch(`${API_BASE_URL}/api/Events?page=1&pageSize=100`, {
                  headers: { Accept: "application/json" },
                  signal: controller.signal,
            })
                  .then(async (response) => {
                        if (!response.ok) throw new Error(`Request failed (${response.status})`);
                        const result: ApiEventListResponse = await response.json();
                        if (!result.success) throw new Error(result.message || "Failed to load event");
                        const matchingEvent = result.data.items.find((item) => toEventSlug(item.title) === title?.toLowerCase());
                        if (!matchingEvent) return;

                        const detailResponse = await fetch(`${API_BASE_URL}/api/Events/${encodeURIComponent(matchingEvent.id)}`, {
                              headers: { Accept: "application/json" },
                              signal: controller.signal,
                        });
                        if (!detailResponse.ok) throw new Error(`Request failed (${detailResponse.status})`);

                        const detailResult: ApiEventResponse = await detailResponse.json();
                        if (!detailResult.success) throw new Error(detailResult.message || "Failed to load event details");
                        setApiEvent(toDisplayEvent(detailResult.data));
                  })
                  .catch((error: unknown) => {
                        if (error instanceof Error && error.name !== "AbortError") {
                              console.error("Failed to load event details:", error);
                        }
                  })
                  .finally(() => {
                        if (!controller.signal.aborted) setIsLoading(false);
                  });

            return () => controller.abort();
      }, [title]);

      const updateTicketQuantity = (ticket: TicketType, quantity: number, limit: number) => {
            setSelectedTicket(ticket);
            setTicketQuantities((current) => ({ ...current, [ticket]: Math.max(0, Math.min(limit, quantity)) }));
      };

      const event = apiEvent ?? localEvent;

      const totalTicketAmount =
            ticketQuantities.regular * Number(event?.regular_ticketPrice ?? 0) +
            ticketQuantities.vip * Number(event?.vip_ticketPrice ?? 0) +
            ticketQuantities.vvip * Number(event?.vvip_ticketPrice ?? 0);

      const formattedTotalTicketAmount = `₦${totalTicketAmount.toLocaleString("en-NG")}`;
      const isLoggedIn = Boolean(localStorage.getItem("token"));

      if (isLoading) return <Loader />;

      return (
            <div className="flex ">
                  <div className="hidden lg:block">
                        <Sidebar items={attendeeSidebarItems} />
                  </div>

                  <div className="min-w-0 flex-1 bg-neutral-925 pb-10">
                        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />

                        {isSidebarOpen && (
                              <>
                                    <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
                                    <div className="fixed inset-y-0 left-0 z-50 w-[min(21rem,88vw)] lg:hidden">
                                          <Sidebar items={attendeeSidebarItems} onClose={() => setIsSidebarOpen(false)} />
                                    </div>
                              </>
                        )}

                        <div className="p-4 w-full ">
                              <div className="flex items-center gap-2 text-gray-600 text-sm font-jakarta">
                                    <button
                                          type="button"
                                          onClick={() => navigate(-1)}
                                          className="text-gray-600 text-sm hover:text-white  transition-colors duration-200"
                                    >
                                          Back
                                    </button>{" "}
                                    / <span className="text-white text-sm font-medium">{event?.eventTitle || "Event not found"}</span>
                              </div>
                        </div>

                        <div className="mt-2 w-full space-y-6">
                              <div className="h-full max-h-[calc(100dvh-180px)] w-full overflow-hidden  sm:h-96 lg:h-140">
                                    <img src={event?.imageUrl} alt={event?.eventTitle} className="h-full w-full object-cover object-top" />
                              </div>

                              <div className="flex items-start justify-between gap-6 md:flex-nowrap flex-wrap px-4 font-poppins">
                                    <div className="w-full space-y-6 md:flex-2">
                                          <div className=" border border-neutral-600 rounded-2xl p-6 w-full">
                                                <h3 className="text-neutral-25 text-lg md:text-xl mb-4 font-medium leading-7 tracking-[-0.02em]">
                                                      {event?.eventTitle}
                                                </h3>
                                                <span className="w-fit rounded-full  border border-neutral-600 bg-neutral-800 text-neutral-300 text-xs px-3 py-1.5">
                                                      {event?.eventCategory}
                                                </span>

                                                <div className="flex  flex-col items-start justify-between mt-8">
                                                      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div className="flex items-start gap-2">
                                                                  <div className="bg-orange-600/30 border border-orange-600/30 p-1.5 rounded-lg flex items-center justify-center">
                                                                        <LocationIcon className="w-5 h-5  text-orange-600" />
                                                                  </div>
                                                                  <div className="flex flex-col gap-1">
                                                                        <h4 className="text-white text-xs">Venue</h4>
                                                                        <p className="text-white text-sm font-medium">{event?.venue}</p>
                                                                        <a
                                                                              href="/"
                                                                              target="_blank"
                                                                              rel="noopener noreferrer"
                                                                              className="text-orange-600 text-xs font-medium hover:underline"
                                                                        >
                                                                              View on map
                                                                        </a>
                                                                  </div>
                                                            </div>

                                                            <div className="flex items-start gap-2 w-full">
                                                                  <div className="bg-orange-600/30 border border-orange-600/30 p-1.5 rounded-lg flex items-center justify-center">
                                                                        <EventIcon className="w-5 h-5  text-orange-600" />
                                                                  </div>
                                                                  <div className="flex flex-col gap-1">
                                                                        <h4 className="text-white text-xs">Date & Time</h4>
                                                                        <p className="text-white text-sm font-medium">
                                                                              {event?.startDate} {event?.startTime}
                                                                        </p>
                                                                  </div>
                                                            </div>

                                                            <div className="flex items-start gap-2">
                                                                  <div className="bg-orange-600/30 border border-orange-600/30 p-1.5 rounded-lg flex items-center justify-center">
                                                                        <LocationIcon className="w-5 h-5  text-orange-600" />
                                                                  </div>
                                                                  <div className="flex flex-col gap-1">
                                                                        <h4 className="text-white text-xs">Attendance</h4>
                                                                        <p className="text-white text-sm font-medium">{event?.numberAttending} Attending</p>
                                                                  </div>
                                                            </div>
                                                      </div>

                                                      <Button type="button" variant="outline" className="mt-8 text-sm gap-2 px-4  font-normal font-poppins">
                                                            <Share2 aria-hidden="true" className="h-4 w-4 text-orange-600" />
                                                            Share Event
                                                      </Button>
                                                </div>
                                          </div>

                                          <div className=" border border-neutral-600 rounded-2xl p-6 w-full">
                                                <h3 className="text-neutral-25 text-xl mb-4 font-medium leading-7 tracking-[-0.02em]">About Event</h3>
                                                <div className=" space-y-6">
                                                      <p className="text-white font-light font-poppins  text-xs md:text-sm">
                                                            Get ready for the most electrifying night of the year. Afrobeats & Vibes Festival 2026 brings
                                                            together Africa's hottest acts for one unforgettable evening of music, dance, and culture. From
                                                            Afrobeats to Amapiano, Highlife to Afropop — every beat tells a story.
                                                      </p>
                                                      <p className="text-white font-light font-poppins  text-xs md:text-sm">
                                                            Join thousands of music lovers under the stars at the iconic Eko Hotel grounds as we celebrate the
                                                            global phenomenon that is African music. World-class production, celebrity appearances, and non-stop
                                                            entertainment from 6pm till dawn.
                                                      </p>
                                                      <p className="text-white font-light font-poppins  text-xs md:text-sm">
                                                            Featuring: Burna Boy, Davido, Tiwa Savage, Wizkid, Ayra Starr, and many surprise guests.{" "}
                                                      </p>

                                                      <p className="text-white font-light font-poppins  text-xs md:text-sm">
                                                            Get ready for the most electrifying night of the year. Afrobeats & Vibes Festival 2026 brings
                                                            together Africa's hottest acts for one unforgettable evening of music, dance, and culture. From
                                                            Afrobeats to Amapiano, Highlife to Afropop — every beat tells a story.
                                                      </p>
                                                      <p className="text-white font-light font-poppins  text-xs md:text-sm">
                                                            Join thousands of music lovers under the stars at the iconic Eko Hotel grounds as we celebrate the
                                                            global phenomenon that is African music. World-class production, celebrity appearances, and non-stop
                                                            entertainment from 6pm till dawn.
                                                      </p>
                                                </div>
                                          </div>

                                          <div className=" border border-neutral-600 rounded-2xl p-6 w-full">
                                                <h3 className="text-neutral-25 text-xl mb-4 font-medium leading-7 tracking-[-0.02em]">Location</h3>
                                                <div className="h-96 w-full overflow-hidden ">
                                                      <iframe
                                                            title={`Map showing ${event?.venue || "event venue"}`}
                                                            src={`https://www.google.com/maps?q=${encodeURIComponent(event?.venue || "")}&output=embed`}
                                                            className="h-full w-full border-0"
                                                            loading="lazy"
                                                            referrerPolicy="no-referrer-when-downgrade"
                                                            allowFullScreen
                                                      />
                                                </div>
                                          </div>

                                          <div className=" border border-neutral-600 rounded-2xl p-6 w-full">
                                                <h3 className="text-neutral-25 text-xl mb-4 font-medium leading-7 tracking-[-0.02em]">Organizer</h3>
                                                <div className="flex items-center gap-2">
                                                      <div className="">
                                                            <img
                                                                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                                                                  alt={event?.eventTitle}
                                                                  loading="lazy"
                                                                  className="w-16 h-16 rounded-full object-cover"
                                                            />
                                                      </div>
                                                      <div className="flex flex-col gap-1">
                                                            <h4 className="text-white text-sm md:text-lg">{event?.organizerName || "Organizer"}</h4>
                                                            <p className="text-white font-normal text-xs md:text-sm">Verified event organizer</p>
                                                      </div>
                                                </div>
                                          </div>
                                    </div>
                                    <div className="w-full space-y-6 md:flex-[1.3]">
                                          <div className=" border border-neutral-600 rounded-2xl p-6 w-full">
                                                <div className="flex flex-col gap-1">
                                                      <h4 className="text-white text-lg">Select Ticket</h4>
                                                      <p className="text-white font-normal text-sm">3 ticket types available</p>
                                                </div>
                                                <div className="space-y-6 mt-6">
                                                      <div
                                                            onClick={() => setSelectedTicket("regular")}
                                                            className={`${selectedTicket === "regular" ? "bg-purple-600/24 border-purple-600/24" : "bg-neutral-950"} rounded-2xl border border-neutral-600 p-3 space-y-8 transition-colors hover:border-purple-600/60`}
                                                      >
                                                            <div className="flex items-start justify-between gap-4">
                                                                  <div className="min-w-0 space-y-1">
                                                                        <h3 className="text-base font-medium text-white">Regular</h3>
                                                                        <p className="text-xs font-normal text-neutral-400">Regular Sitting Area</p>
                                                                  </div>
                                                                  <div className="shrink-0">
                                                                        <h3 className="text-lg font-semibold text-orange-600">
                                                                              ₦{Number(event?.regular_ticketPrice ?? 0).toLocaleString("en-NG")}
                                                                        </h3>
                                                                        <p className="text-xs font-normal text-neutral-400">230 left</p>
                                                                  </div>
                                                            </div>
                                                            <div className="w-fit">
                                                                  <div className="flex items-center gap-1">
                                                                        <button
                                                                              type="button"
                                                                              aria-label="Decrease regular tickets"
                                                                              disabled={ticketQuantities.regular === 0}
                                                                              onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    updateTicketQuantity("regular", ticketQuantities.regular - 1, 230);
                                                                              }}
                                                                              className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-700 text-white transition-colors hover:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-40"
                                                                        >
                                                                              <FaMinus className="h-3 w-3" />
                                                                        </button>
                                                                        <span className="min-w-5 text-center text-sm font-medium text-white">
                                                                              {ticketQuantities.regular}
                                                                        </span>
                                                                        <button
                                                                              type="button"
                                                                              aria-label="Increase regular tickets"
                                                                              disabled={ticketQuantities.regular >= 230}
                                                                              onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    updateTicketQuantity("regular", ticketQuantities.regular + 1, 230);
                                                                              }}
                                                                              className="flex h-6 w-6  items-center justify-center rounded-full bg-purple-600 text-white transition-colors hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
                                                                        >
                                                                              <PiPlus />
                                                                        </button>
                                                                  </div>
                                                            </div>
                                                      </div>
                                                      <div
                                                            onClick={() => setSelectedTicket("vip")}
                                                            className={`${selectedTicket === "vip" ? "bg-purple-600/24 border-purple-600/24" : "bg-neutral-950"} rounded-2xl border border-neutral-600 p-3 space-y-8 transition-colors hover:border-purple-600/60`}
                                                      >
                                                            <div className="flex items-start justify-between gap-4">
                                                                  <div className="min-w-0 space-y-1">
                                                                        <h3 className="text-base font-medium text-white">VIP</h3>
                                                                        <p className="text-xs font-normal text-neutral-400">Best Experience</p>
                                                                  </div>
                                                                  <div className="shrink-0">
                                                                        <h3 className="text-lg font-semibold text-orange-600">
                                                                              ₦{Number(event?.vip_ticketPrice ?? 0).toLocaleString("en-NG")}
                                                                        </h3>
                                                                        <p className="text-xs font-normal text-neutral-400">40 left</p>
                                                                  </div>
                                                            </div>
                                                            <div className="w-fit">
                                                                  <div className="flex items-center gap-1">
                                                                        <button
                                                                              type="button"
                                                                              aria-label="Decrease VIP tickets"
                                                                              disabled={ticketQuantities.vip === 0}
                                                                              onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    updateTicketQuantity("vip", ticketQuantities.vip - 1, 40);
                                                                              }}
                                                                              className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-700 text-white transition-colors hover:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-40"
                                                                        >
                                                                              <FaMinus className="h-3 w-3" />
                                                                        </button>
                                                                        <span className="min-w-5 text-center text-sm font-medium text-white">
                                                                              {ticketQuantities.vip}
                                                                        </span>
                                                                        <button
                                                                              type="button"
                                                                              aria-label="Increase VIP tickets"
                                                                              disabled={ticketQuantities.vip >= 40}
                                                                              onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    updateTicketQuantity("vip", ticketQuantities.vip + 1, 40);
                                                                              }}
                                                                              className="flex h-6 w-6  items-center justify-center rounded-full bg-purple-600 text-white transition-colors hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
                                                                        >
                                                                              <PiPlus />
                                                                        </button>
                                                                  </div>
                                                            </div>
                                                      </div>
                                                      <div
                                                            onClick={() => setSelectedTicket("vvip")}
                                                            className={`${selectedTicket === "vvip" ? "bg-purple-600/24 border-purple-600/24" : "bg-neutral-950"} rounded-2xl border border-neutral-600 p-3 space-y-8 transition-colors hover:border-purple-600/60`}
                                                      >
                                                            <div className="flex items-start justify-between gap-4">
                                                                  <div className="min-w-0 space-y-1">
                                                                        <h3 className="text-base font-medium text-white">VVIP</h3>
                                                                        <p className="text-xs font-normal text-neutral-400">Special Reservation</p>
                                                                  </div>
                                                                  <div className="shrink-0">
                                                                        <h3 className="text-lg font-semibold text-orange-600">
                                                                              ₦{Number(event?.vvip_ticketPrice ?? 0).toLocaleString("en-NG")}
                                                                        </h3>
                                                                        <p className="text-xs font-normal text-neutral-400">2 left</p>
                                                                  </div>
                                                            </div>
                                                            <div className="w-fit">
                                                                  <div className="flex items-center gap-1">
                                                                        <button
                                                                              type="button"
                                                                              aria-label="Decrease VVIP tickets"
                                                                              disabled={ticketQuantities.vvip === 0}
                                                                              onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    updateTicketQuantity("vvip", ticketQuantities.vvip - 1, 2);
                                                                              }}
                                                                              className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-700 text-white transition-colors hover:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-40"
                                                                        >
                                                                              <FaMinus className="h-3 w-3" />
                                                                        </button>
                                                                        <span className="min-w-5 text-center text-sm font-medium text-white">
                                                                              {ticketQuantities.vvip}
                                                                        </span>
                                                                        <button
                                                                              type="button"
                                                                              aria-label="Increase VVIP tickets"
                                                                              disabled={ticketQuantities.vvip >= 2}
                                                                              onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    updateTicketQuantity("vvip", ticketQuantities.vvip + 1, 2);
                                                                              }}
                                                                              className="flex h-6 w-6  items-center justify-center rounded-full bg-purple-600 text-white transition-colors hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
                                                                        >
                                                                              <PiPlus />
                                                                        </button>
                                                                  </div>
                                                            </div>
                                                      </div>

                                                      <div className="rounded-lg mt-6 bg-neutral-950 p-3 flex items-center justify-between">
                                                            <h3 className="text-base font-medium text-white">Total</h3>
                                                            <p className="text-white text-base font-medium">{formattedTotalTicketAmount}</p>
                                                      </div>

                                                      <div className="w-full mt-6">
                                                            <Button
                                                                  variant="yellow"
                                                                  className="w-full"
                                                                  disabled={
                                                                        isLoggedIn &&
                                                                        ticketQuantities.regular === 0 &&
                                                                        ticketQuantities.vip === 0 &&
                                                                        ticketQuantities.vvip === 0
                                                                  }
                                                                  onClick={() => {
                                                                        if (!isLoggedIn) {
                                                                              navigate("/login", {
                                                                                    state: { from: location.pathname, ticketQuantities },
                                                                              });
                                                                              return;
                                                                        }
                                                                        setIsOpen(true);
                                                                  }}
                                                            >
                                                                  {isLoggedIn ? "Proceed to checkout" : "Login to continue"}
                                                            </Button>
                                                      </div>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </div>
                  {isOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                              <GetTicketModal
                                    onClose={() => setIsOpen(false)}
                                    title={(event?.eventTitle ?? "").replace(/\s+/g, "-").toLowerCase()}
                                    initialTicketQuantities={ticketQuantities}
                              />
                        </div>
                  )}
            </div>
      );
};

export default DiscoverEventsDetails;
