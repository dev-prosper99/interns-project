import { TicketIcon } from "@/assets/icons";
import { EventIcon } from "../../../../../assets/icons";
import { HeartIcon } from "lucide-react";

export default function DashboardStats() {
      return (
            <div className="w-full">
                  <div className="flex items-center gap-6 justify-between md:flex-nowrap flex-wrap">
                        <div className="bg-neutral-1000 p-4 rounded-2xl w-full space-y-8">
                              <div className="flex items-center gap-3">
                                    <div className="bg-orange-400/30 p-1.5 rounded-lg flex items-center justify-center">
                                          <TicketIcon className="w-5 h-5  text-orange-600" />
                                    </div>
                                    <h3 className="text-white text-sm font-normal">Tickets Bought</h3>
                              </div>
                              <h1 className="text-white text-2xl md:text-4xl font-bold">10</h1>
                        </div>

                        <div className="bg-neutral-1000 p-4 rounded-2xl w-full space-y-8">
                              <div className="flex items-center gap-3">
                                    <div className="bg-green-400/30 p-1.5 rounded-lg flex items-center justify-center">
                                          <EventIcon className="w-5 h-5  text-green-400" />
                                    </div>
                                    <h3 className="text-white text-sm font-normal">Upcoming Events</h3>
                              </div>
                              <h1 className="text-white text-2xl md:text-4xl font-bold">4</h1>
                        </div>

                        <div className="bg-neutral-1000 p-4 rounded-2xl w-full space-y-8">
                              <div className="flex items-center gap-3">
                                    <div className="bg-red-400/30 p-1.5 rounded-lg flex items-center justify-center">
                                          <HeartIcon className="w-5 h-5  text-red-400" />
                                    </div>
                                    <h3 className="text-white text-sm font-normal">Saved Events</h3>
                              </div>
                              <h1 className="text-white text-2xl md:text-4xl font-bold">4</h1>
                        </div>
                  </div>
            </div>
      );
}
