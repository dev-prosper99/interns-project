import { LocationIcon, EventIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { DownloadIcon, ScanQrCodeIcon } from "lucide-react";

interface TicketsCardProps {
      image: string;
      title: string;
      venue: string;
      date: string;
      time: string;
      type: string;
      numberOfTicket: number | string;
      ticketPrice: number | string;
      ticketID: string;
      category: string;
      onClick?: () => void;
}

export default function TicketsCard({
      image,
      title,
      venue,
      date,
      time,
      type,
      numberOfTicket,
      ticketPrice,
      ticketID,
      category,
      onClick = () => undefined,
}: TicketsCardProps) {
      return (
            <div className="w-full">
                  <div className="bg-neutral-950 p-4 md:p-6 rounded-2xl">
                        <div className="flex items-start gap-3">
                              <img src={image} alt={title} loading="lazy" className="w-14 h-14 md:w-18 md:h-18 rounded-full object-cover" />
                              <div className=" flex flex-col w-full">
                                    <div className="gap-2 justify-between flex items-start md:flex-nowrap flex-wrap">
                                          <div className="flex flex-col w-full">
                                                <p className="text-white text-sm md:text-lg mb-3 font-medium">{title}</p>
                                                <p className="text-neutral-400 text-xs flex items-center gap-2 mb-2">
                                                      <LocationIcon className="text-orange-600" /> {venue}
                                                </p>
                                                <p className="text-neutral-400 text-xs flex items-center gap-2  mb-3">
                                                      <EventIcon className="text-orange-600" /> {date} - {time}
                                                </p>

                                                <div className="flex items-center gap-2">
                                                      <div className="rounded-2xl bg-green-400/20 text-green-600/80 font-normal text-xs px-3 py-0.5">
                                                            {type}
                                                      </div>
                                                      <span className="text-neutral-400 text-xs">×{numberOfTicket}</span>
                                                      <p className="text-orange-600 text-sm font-bold">₦{Number(ticketPrice).toLocaleString("en-NG")}</p>
                                                </div>
                                                <p className="text-base font-semibold text-orange-600 mt-2">{ticketID}</p>
                                          </div>
                                          <span className="px-2  text-xs py-1 text-warning-600 bg-warning-600/25 rounded-full">{category}</span>
                                    </div>
                                    <div className=" flex items-center  w-fit gap-4">
                                          <Button
                                                type="button"
                                                onClick={onClick}
                                                variant="secondary"
                                                className="mt-8 text-sm gap-2 px-4  font-normal font-poppins"
                                          >
                                                <ScanQrCodeIcon aria-hidden="true" className="h-4 w-4 text-purple-600" />
                                                Show QR Code
                                          </Button>
                                          <Button type="button" variant="neutral" className="mt-8 text-sm gap-2 px-4  font-normal font-poppins">
                                                <DownloadIcon aria-hidden="true" className="h-4 w-4 text-neutral-600" />
                                                Download
                                          </Button>
                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
      );
}
