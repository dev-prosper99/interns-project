import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import EventsPagination from "@/components/Events/EventsPagination";
import { EventCard } from "@/components/cards/EventCard";
import { Events } from "@/constants/events";

const SavedEvents = () => {
      const navigate = useNavigate();

      return (
            <div className="min-w-0 bg-neutral-925 pb-10">
                  <main className="mx-auto w-full max-w-7xl px-4 py-5 ">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <p className="text-white sm:text-xl text-lg font-medium font-jakarta">All events in your wish list</p>

                              <Button variant="yellow" className="md:w-auto w-1/2" onClick={() => navigate("/events")}>
                                    Discover Events
                              </Button>
                        </div>

                        <div className="mt-5 w-full font-poppins">
                              <div className="rounded-2xl p-4 space-y-7 bg-neutral-1000">
                                    <div className="space-y-2 w-full">
                                          <p className="text-white">3 events found</p>
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6  xl:grid-cols-3">
                                                {Events.slice(0, 3).map((event, i) => (
                                                      <div key={`${event.eventTitle}-${i}`} className="flex min-w-0">
                                                            <EventCard
                                                                  imageUrl={event.imageUrl}
                                                                  eventTitle={event.eventTitle}
                                                                  eventCategory={event.eventCategory}
                                                                  venue={event.venue}
                                                                  numberAttending={event.numberAttending}
                                                                  startDate={event.startDate}
                                                                  startTime={event.startTime}
                                                                  ticketPrice={event.regular_ticketPrice}
                                                            />
                                                      </div>
                                                ))}
                                                <EventsPagination className="col-span-full w-full" />
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </main>
            </div>
      );
};

export default SavedEvents;
