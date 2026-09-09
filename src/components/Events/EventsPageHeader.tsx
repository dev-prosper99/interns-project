import { useState } from "react";
import CreateEventModal from "../DashBoard/AdminDashboard/CreateEvent/CreateEventModal";
import { Button } from "@/components/ui/button";

export default function EventsPageHeader() {
      const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);

      return (
            <>
                  <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <p className="text-lg font-medium text-white">Here's the list of all your events.</p>

                        <Button variant="yellow" className="w-1/2 md:w-auto" onClick={() => setIsCreateEventOpen(true)}>
                              + Create New Event
                        </Button>
                  </div>

                  {isCreateEventOpen && <CreateEventModal isOpen={isCreateEventOpen} onClose={() => setIsCreateEventOpen(false)} />}
            </>
      );
}
