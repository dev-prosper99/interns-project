import { ToggleOnIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";

interface UnpublishEventModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export default function UnpublishEventModal({
  onCancel,
  onConfirm,
}: UnpublishEventModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div
        className="w-full max-w-100 rounded-2xl border py-8 px-4 sm:px-8 flex flex-col items-center gap-8"
        style={{ backgroundColor: "#111213", borderColor: "#282A2D" }}
      >
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: 40,
            height: 40,
            padding: 8,
            backgroundColor: "#282A2D",
          }}
        >
          <ToggleOnIcon className="w-5 h-5 text-neutral-300" />
        </div>

        <div className="text-center">
          <p className="text-white text-lg font-semibold mb-1">
            Unpublish Event?
          </p>
          <p className="text-neutral-400 text-sm">
            Do you want to unpublish this event?
          </p>
        </div>

        <div className="flex w-full gap-2.5">
          <Button
            variant="neutral"
            size="lg"
            className="flex-1"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
