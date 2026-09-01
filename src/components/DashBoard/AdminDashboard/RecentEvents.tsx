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
 
const RecentEvents = () => {
  const [recentEvents, setRecentEvents] = useState<EventItem[]>([]);
 
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
  "https://ticketing-management-system-be.onrender.com/api/Events/published"
);
        const data = await response.json();
        console.log(data);
        console.log("Status:", response.status);
        console.log("Events:", data.data.items);
        setRecentEvents(data.data.items || []);
      } catch (error) {
        console.error(error);
        
      }
    };
 
    fetchEvents();
  }, []);
 
  return (
    <div className="bg-neutral-1000 rounded-2xl p-6 h-full flex flex-col">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Recent Events
      </h2>
 
      <div className="divide-y divide-[#252525] flex-1 overflow-auto">
        {recentEvents.map((event) => (
          <div
            key={event.id}
            className="flex items-center justify-between py-5"
          >
            <div className="flex items-center gap-4">
              <img
                src={event.bannerUrl}
                alt={event.title}
                className="w-14 h-14 rounded-full object-cover"
              />
 
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {event.title}
                </h3>
 
                <div className="flex items-center gap-2 mt-2 text-gray-400 text-sm">
                  <CalenderIcon className="w-4 h-4" />
                  <span>
                    {new Date(event.eventDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
 
            <span className="px-4 py-1.5 rounded-full bg-orange-500/20 text-orange-400 text-sm font-medium">
              {event.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
 
export default RecentEvents;
 