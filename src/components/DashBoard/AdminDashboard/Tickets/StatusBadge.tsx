import type { TicketStatus } from "@/types/tickets";

const statusStyles: Record<TicketStatus, string> = {
  Confirmed: "bg-green-500/15 text-green-400",
  "Sold Out": "bg-red-500/15 text-red-400",
  "Low Stock": "bg-yellow-500/15 text-yellow-400",
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
