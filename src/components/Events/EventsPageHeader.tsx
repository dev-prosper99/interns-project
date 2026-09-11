
import { Button } from "@/components/ui/button";
 
interface EventsPageHeaderProps {
  onCreateClick: () => void;
}
 
export default function EventsPageHeader({ onCreateClick }: EventsPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <p className="text-lg font-medium text-white">Here's the list of all your events.</p>
 
      <Button variant="yellow" className="w-1/2 md:w-auto" onClick={onCreateClick}>
        + Create New Event
      </Button>
    </div>
  );
}