import DetailField from "./DetailField";
import { CategoryPill } from "./Pill";
import type { EventDetailData } from "./EventsDetailsTypes";

interface EventDetailGridProps {
      event: EventDetailData;
}

export default function EventDetailGrid({ event }: EventDetailGridProps) {
      return (
            <div className="flex flex-col gap-6">
                  <h3 className="text-md font-lightbold text-neutral-100">Review and Publish</h3>
                  <div className="flex flex-col sm:flex-row gap-6 sm:gap-15">
                        <DetailField label="Event Title" value={event.title} />
                        <div className="flex flex-1 flex-col gap-1">
                              <p className="text-neutral-500 text-xs">Category</p>
                              <CategoryPill label={event.category} />
                        </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-6 sm:gap-15">
                        <DetailField label="Start Date" value={event.startDate} />
                        <DetailField label="Start Time" value={event.startTime} />
                        <DetailField label="End Time" value={event.endTime} />
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
