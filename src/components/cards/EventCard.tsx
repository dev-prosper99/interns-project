import { MapPin, Users, Calendar, Heart } from "lucide-react";

export interface EventCardProps {
      imageUrl: string;
      eventTitle: string;
      eventCategory: string;
      venue: string;
      numberAttending: string;
      startDate: string;
      startTime: string;
      ticketPrice: string;
      soldPercentage?: number;
      ticketsLeft?: number;
      onClick?: () => void;
}

export const EventCard = ({
      onClick,
      imageUrl,
      eventTitle,
      eventCategory,
      venue,
      numberAttending,
      startDate,
      startTime,
      ticketPrice,
      soldPercentage = 50,
      ticketsLeft = 1000,
}: EventCardProps) => {
      return (
            <div className="flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl bg-neutral-950 font-poppins">
                  {/* Image */}
                  <div className="relative h-fit w-full aspect-4/3">
                        <img onClick={onClick} src={imageUrl} alt={eventTitle} className="w-full h-full  object-cover rounded-t-2xl" />
                        <button
                              type="button"
                              aria-label="Add to favorites"
                              className="absolute top-2 right-3 flex items-center justify-center w-10 h-10 rounded-full bg-white/50 border border-white"
                        >
                              <Heart className="w-5 h-5 text-orange-600" />
                        </button>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex flex-col border-x border-b border-neutral-900">
                        <h3 className="text-neutral-25 text-xl mb-2 font-medium leading-7 tracking-[-0.02em]">{eventTitle}</h3>

                        <span className="w-fit rounded-full mb-2 border border-neutral-600 bg-neutral-800 text-neutral-300 text-xs px-3 py-1.5">
                              {eventCategory}
                        </span>

                        <div className="flex flex-col gap-2 text-base text-neutral-300 font-norma mb-3">
                              <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                                    {venue}
                              </div>
                              <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-orange-600 shrink-0" />
                                    {numberAttending} attending
                              </div>
                              <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-orange-600 shrink-0" />
                                    {startDate} - {startTime}
                              </div>
                        </div>

                        {/* Progress bar */}
                        <div className="flex flex-col gap-1.5">
                              <div className="flex justify-between text-xs text-neutral-400">
                                    <span>{soldPercentage}% sold</span>
                                    <span>{ticketsLeft.toLocaleString()} left</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-neutral-800">
                                    <div
                                          className="h-full rounded-full bg-orange-600"
                                          style={{
                                                width: `${soldPercentage}%`,
                                          }}
                                    />
                              </div>
                        </div>

                        {/* Price + CTA */}
                        <div className="flex items-center justify-between mt-6">
                              <div>
                                    <p className="text-xs text-neutral-500">From</p>
                                    <p className="text-orange-600 text-2xl font-extrabold leading-8 tracking-[-0.02em]">
                                          ₦{Number(ticketPrice).toLocaleString()}
                                    </p>
                              </div>
                              <button
                                    type="button"
                                    onClick={onClick}
                                    className="w-31.75 h-11 rounded-[10px] px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-medium text-sm whitespace-nowrap flex items-center justify-center"
                              >
                                    Get Ticket
                              </button>
                        </div>
                  </div>
            </div>
      );
};
