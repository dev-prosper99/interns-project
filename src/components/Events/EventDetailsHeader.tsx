import { CancelCircleIcon } from "@/assets/icons"; // TODO: rename to match your close/X icon's export name
 
interface EventDetailsHeaderProps {
  onClose: () => void;
}
 
export default function EventDetailsHeader({ onClose }: EventDetailsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-white text-xl font-semibold">Event Details</h2>
      <button aria-label="Close" onClick={onClose}>
        <CancelCircleIcon className="w-6 h-6 text-neutral-400" />
      </button>
    </div>
  );
}
 