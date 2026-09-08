import { EventIcon } from "@/assets/icons";
import { Events } from "@/constants/events";

export default function SavedEventsPreview() {
      return (
            <div className="w-full font-poppins">
                  <div className="bg-neutral-1000 py-4 rounded-2xl w-full">
                        <div className="flex items-center justify-between border-b border-neutral-900 px-4 pb-2">
                              <p className="text-white text-sm">Saved Events</p>
                              <a href="/events" className="text-purple-500 hover:underline text-xs">
                                    View all
                              </a>
                        </div>
                        <div className="space-y-3 p-4">
                              {Events.slice(0, 4).map((event, index) => (
                                    <div className="flex items-start gap-3 border-b w-full border-neutral-900 pb-4 last:border-none last:pb-0" key={index}>
                                          <img src={event.imageUrl} alt={event.eventTitle} loading="lazy" className="w-12 h-12 rounded-full object-cover" />

                                          <div className="flex md:flex-nowrap gap-3 w-full flex-wrap items-center justify-between">
                                                <div className="flex flex-col">
                                                      <p className="text-white text-sm md:text-lg mb-2 font-medium">{event.eventTitle}</p>
                                                      <p className="text-neutral-400 text-xs flex items-center gap-2  mb-1">
                                                            <EventIcon className="text-orange-600" /> {event.startDate} - {event.startTime}
                                                      </p>
                                                      <p className="text-orange-600 text-lg font-bold">
                                                            ₦{Number(event?.regular_ticketPrice ?? 0).toLocaleString("en-NG")}
                                                      </p>
                                                </div>
                                          </div>
                                    </div>
                              ))}
                        </div>
                  </div>
            </div>
      );
}
