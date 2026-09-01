import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { TicketTier } from "@/types/tickets";

interface EditTicketDialogProps {
  ticket: TicketTier | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updated: TicketTier) => void;
}

export function EditTicketDialog({
  ticket,
  open,
  onOpenChange,
  onSave,
}: EditTicketDialogProps) {
  const [ticketTier, setTicketTier] = useState("");
  const [price, setPrice] = useState("");
  const [totalQty, setTotalQty] = useState("");
  const [description, setDescription] = useState("");

  // Sync local form state whenever a new ticket is opened for editing
  useEffect(() => {
    if (ticket) {
      setTicketTier(ticket.ticketTier);
      setPrice(String(ticket.price));
      setTotalQty(String(ticket.total));
      setDescription(ticket.description);
    }
  }, [ticket]);

  if (!open || !ticket) return null;

  const numericTotal = Number(totalQty) || 0;
  const isBelowSold = numericTotal < ticket.sold;

  const handleSave = () => {
    if (isBelowSold) return;
    onSave({
      ...ticket,
      ticketTier,
      price: Number(price) || 0,
      total: numericTotal,
      description,
    });
    onOpenChange(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={() => onOpenChange(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-ticket-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-white shadow-xl"
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 id="edit-ticket-title" className="text-lg font-semibold">
              Edit Ticket Tier
            </h2>
            <p className="text-sm text-neutral-400">{ticket.event}</p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="text-neutral-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm text-neutral-300">Ticket Tier</label>
            <Input
              value={ticketTier}
              onChange={(e) => setTicketTier(e.target.value)}
              className="bg-neutral-950 border-neutral-700 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm text-neutral-300">Price (NGN)</label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-neutral-950 border-neutral-700 text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-neutral-300">
                Total Qty (min 200)
              </label>
              <Input
                type="number"
                min={200}
                value={totalQty}
                onChange={(e) => setTotalQty(e.target.value)}
                className="bg-neutral-950 border-neutral-700 text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-neutral-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-500 resize-none focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg bg-orange-500/15 px-4 py-3">
            <span className="text-sm font-medium text-orange-400">
              Already Sold
            </span>
            <span className="text-sm font-medium text-orange-400">
              {ticket.sold}/{ticket.total}
            </span>
          </div>

          {isBelowSold && (
            <p className="text-xs text-red-400">
              Total qty can't be lower than the {ticket.sold} tickets already sold.
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-5">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isBelowSold}
            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-50"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
