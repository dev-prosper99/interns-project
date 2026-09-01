import { Pencil } from "lucide-react";
import type { TicketTier } from "@/types/tickets";
import { StatusBadge } from "./StatusBadge";

interface TicketsTableProps {
  tickets: TicketTier[];
  onEdit: (ticket: TicketTier) => void;
}

function formatNaira(value: number) {
  return `₦${value.toLocaleString("en-NG")}`;
}

export function TicketsTable({ tickets, onEdit }: TicketsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-800 text-left text-neutral-400">
            <th className="px-4 py-3 font-medium">Ticket Tier</th>
            <th className="px-4 py-3 font-medium">Event</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">Total</th>
            <th className="px-4 py-3 font-medium">Sold</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-12 text-center text-neutral-500">
                No ticket tiers match your filters.
              </td>
            </tr>
          )}

          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="border-b border-neutral-800 last:border-0 text-white"
            >
              <td className="px-4 py-3">
                <p className="font-medium">{ticket.ticketTier}</p>
                <p className="text-xs text-neutral-500">{ticket.tierSubtitle}</p>
              </td>
              <td className="px-4 py-3 text-neutral-300">{ticket.event}</td>
              <td className="px-4 py-3">
                {ticket.isFree ? (
                  <span className="text-green-400">Free</span>
                ) : (
                  formatNaira(ticket.price)
                )}
              </td>
              <td className="px-4 py-3 text-neutral-300">
                {ticket.total.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-neutral-300">
                {ticket.sold.toLocaleString()}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={ticket.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onEdit(ticket)}
                  aria-label={`Edit ${ticket.ticketTier} for ${ticket.event}`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-800 hover:text-white"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
