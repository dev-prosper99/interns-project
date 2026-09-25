import { useState } from "react";
import { TicketIcon } from "@/assets/icons";
import { Mail } from "lucide-react";
import EventsPagination from "@/components/Events/EventsPagination";
import TicketsCard from "../../../cards/TicketsCard";
import { Events } from "@/constants/events";
import QRCodeModal from "../Sections/MyTicketsSections/QRCodeModal";
import ResendTicketModal from "../Sections/MyTicketsSections/ResendTicketModal";

const tab = [
      { name: "All", count: 4 },
      { name: "Upcoming", count: 4 },
      { name: "Used", count: 0 },
      { name: "Concluded", count: 0 },
];

export default function MyTickets() {
      const [activeTab, setActiveTab] = useState("All");
      const [isOpen, setIsOpen] = useState(false);
      const [selectedEvent, setSelectedEvent] = useState<(typeof Events)[number] | null>(null);

      const [resendOrder, setResendOrder] = useState<{
            isOpen: boolean;
            orderId: string;
            eventTitle: string;
      }>({
            isOpen: false,
            orderId: "",
            eventTitle: "",
      });

      const activeTabCount = tab.find((item) => item.name === activeTab)?.count ?? 0;

      const handleTicketClick = (event: (typeof Events)[number]) => {
            setSelectedEvent(event);
            setIsOpen(true);
      };

      const handleOpenResend = (e: React.MouseEvent, eventTitle: string, orderId: string) => {
            e.stopPropagation();
            setResendOrder({
                  isOpen: true,
                  orderId,
                  eventTitle,
            });
      };

      return (
            <div className="min-w-0 bg-neutral-925 pb-10">
                  <main className="mx-auto w-full py-5 px-4 font-poppins">
                        <p className="text-lg font-medium font-jakarta text-white sm:text-xl">All your purchased tickets in one place</p>

                        <div className="mt-5 w-full">
                              <div className="rounded-2xl p-6 space-y-7 bg-neutral-1000 border border-neutral-900">
                                    <div className="mb-6 flex w-full flex-wrap items-center gap-2 sm:gap-4">
                                          {tab.map((tabs, index) => (
                                                <div
                                                      key={index}
                                                      onClick={() => setActiveTab(tabs.name)}
                                                      className={`flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border px-2 py-2 text-center text-xs text-white sm:flex-none sm:px-3 sm:text-sm ${
                                                            activeTab === tabs.name
                                                                  ? "border-purple-600/24 bg-purple-600/24 text-purple-400 font-medium"
                                                                  : "border-neutral-900 hover:border-neutral-800"
                                                      }`}
                                                >
                                                      {tabs.name}
                                                      <span
                                                            className={`rounded-full px-2 py-0.5 text-xs text-white ${
                                                                  activeTab === tabs.name ? "bg-purple-600" : "bg-neutral-800"
                                                            }`}
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
                                                      You do not have any {activeTab.toLowerCase()} tickets at the moment.
                                                </p>
                                          </div>
                                    ) : (
                                          <div className="space-y-4 w-full">
                                                <div className="flex items-center justify-between">
                                                      <p className="text-sm text-neutral-300">4 tickets found</p>
                                                      <p className="text-xs text-neutral-500">Click a ticket to view gate entry QR code</p>
                                                </div>

                                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                                      {Events.slice(0, 4).map((event, i) => {
                                                            const sampleOrderId = `TXO-2026-${7480 + i}`;
                                                            return (
                                                                  <div
                                                                        key={`${event.eventTitle}-${i}`}
                                                                        className="flex flex-col rounded-2xl border border-neutral-800/80 bg-neutral-950/40 p-1"
                                                                  >
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
                                                                              ticketID={sampleOrderId}
                                                                        />

                                                                        <div className="flex items-center justify-between border-t border-neutral-900 px-4 py-2.5 bg-neutral-900/30 rounded-b-2xl">
                                                                              <span className="text-[11px] text-neutral-500">
                                                                                    Didn't receive your email copy?
                                                                              </span>
                                                                              <button
                                                                                    type="button"
                                                                                    onClick={(e) => handleOpenResend(e, event.eventTitle, sampleOrderId)}
                                                                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-400 hover:text-orange-300 transition-colors"
                                                                              >
                                                                                    <Mail className="w-3.5 h-3.5" /> Resend Confirmation
                                                                              </button>
                                                                        </div>
                                                                  </div>
                                                            );
                                                      })}
                                                      <EventsPagination className="col-span-full w-full" />
                                                </div>
                                          </div>
                                    )}
                              </div>
                        </div>
                  </main>

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

                  <ResendTicketModal
                        isOpen={resendOrder.isOpen}
                        onClose={() => setResendOrder((prev) => ({ ...prev, isOpen: false }))}
                        orderId={resendOrder.orderId}
                        eventTitle={resendOrder.eventTitle}
                        recipientEmail={localStorage.getItem("email") || undefined}
                  />
            </div>
      );
}
