import { Button } from "@/components/ui/button";
 
interface EventDetailsFooterProps {
  onBack: () => void;
  onEdit: () => void;
}
 
export default function EventDetailsFooter({ onBack, onEdit }: EventDetailsFooterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button
        variant="neutral"
        size="lg"
        className="sm:w-94 border"
        style={{ borderColor: "#60838C" }}
        onClick={onBack}
      >
        Back
      </Button>
      <Button variant="accent" size="lg" className="flex-1" onClick={onEdit}>
        Edit
      </Button>
    </div>
  );
}
 