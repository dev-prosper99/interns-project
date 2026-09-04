import DetailField from "./DetailField";
import type { EventDetailData } from "./EventsDetailsTypes";

interface EventDetailGridProps {
  event: EventDetailData;
}

export default function EventDetailGrid({ event }: EventDetailGridProps) {
  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-md font-lightbold text-neutral-100">
        Review and Publish
      </h3>
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-15">
        <DetailField label="Event Title" value={event.title} />
        <DetailField label="Category" value={event.category} />
      </div>
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-15">
        <DetailField label="Start Date" value={event.startDate} />
        <DetailField label="Start Time" value={event.startTime} />
      </div>
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-15">
        <DetailField label="Venue" value={event.venue} />
        <DetailField label="State" value={event.state} />
      </div>
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-15">
        <DetailField label="Number Attending" value={event.numberAttending} />
      </div>
    </div>
  );
}
