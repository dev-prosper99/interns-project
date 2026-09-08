import { LocationIcon, EventIcon } from "@/assets/icons";
import { Link } from "react-router-dom";
import { Events } from "@/constants/events";

export default function Upcoming() {
      return (
            <div className="w-full font-poppins">
                  <div className="bg-neutral-1000 py-4 rounded-2xl w-full">
                        <div className="flex items-center justify-between border-b border-neutral-900 px-4 pb-2">
                              <p className="text-white text-sm">Your Upcoming Events</p>
                              <Link to="/events" className="text-purple-500 hover:underline text-xs">
                                    View all
                              </Link>
                        </div>
                        <div className="space-y-5 p-4">
                              {Events.slice(0, 3).map((event, index) => (
                                    <div className="flex items-start gap-3 border-b w-full border-neutral-900 pb-4 last:border-none last:pb-0" key={index}>
                                          <img src={event.imageUrl} alt={event.eventTitle} loading="lazy" className="w-12 h-12 rounded-full object-cover" />

                                          <div className="flex md:flex-nowrap gap-3 w-full flex-wrap items-center justify-between">
                                                <div className="flex flex-col">
                                                      <p className="text-white text-sm md:text-lg mb-3 font-medium">{event.eventTitle}</p>
                                                      <p className="text-neutral-400 text-xs flex items-center gap-2 mb-2">
                                                            <LocationIcon className="text-orange-600" /> {event.venue}
                                                      </p>
                                                      <p className="text-neutral-400 text-xs flex items-center gap-2  mb-3">
                                                            <EventIcon className="text-orange-600" /> {event.startDate} - {event.startTime}
                                                      </p>

                                                      <div className="flex items-center gap-2">
                                                            <div className="rounded-2xl bg-green-400/20 text-green-600/80 font-normal text-xs px-3 py-0.5">
                                                                  Regular
                                                            </div>
                                                            <span className="text-neutral-400 text-xs">×2</span>
                                                      </div>
                                                </div>

                                                <div className="flex flex-col items-end gap-1">
                                                      <p className="sm:block hidden text-neutral-400 text-sm">Paid</p>
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
