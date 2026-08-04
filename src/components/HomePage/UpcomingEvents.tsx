import { LeftArrow, RightArrow } from "@/assets/icons";
import { EventCard } from "@/components/cards/EventCard";
// import { SmallCards } from "@/components/cards";
// import EventDetail from "./EventDetail";
import { Events } from "@/constants/events";
import event1 from "@/assets/event-1.png";
import event2 from "@/assets/event-2.png";
import event3 from "@/assets/event-3.png";
import event4 from "@/assets/event-4.png";
import event5 from "@/assets/event-5.png";
import event6 from "@/assets/event-6.png";

const images = [event1, event2, event3, event4, event5, event6];

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-white text-2xl font-bold">{title}</h2>
        <p className="text-neutral-400 text-sm mt-1">{subtitle}</p>
      </div>
      <div className="flex gap-2">
        <button className="w-12.5 h-12.5 rounded-lg bg-neutral-900 flex items-center justify-center hover:bg-neutral-800">
          <LeftArrow className="w-5 h-5 text-white" />
        </button>
        <button className="w-12.5 h-12.5 rounded-lg bg-neutral-900 flex items-center justify-center hover:bg-neutral-800">
          <RightArrow className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}

export default function UpcomingEvents() {
    return (
      <div className="pl-6 md:pl-30 py-16 bg-neutral-950">
        <div className="pr-6 md:pr-30">
        <SectionHeader
         title="Upcoming Events"
         subtitle="Don't miss upcoming events"
          />
        </div>
        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-2">
          {Events.slice(0, 20).map((event, i) => (
           <div key={i}>
            <EventCard
             key={i}
             imageUrl={images[i % images.length]}
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
        </div>
      </div>
 );
}
    