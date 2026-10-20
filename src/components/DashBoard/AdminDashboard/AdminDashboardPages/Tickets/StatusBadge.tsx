import type { TicketStatus } from "@/types/tickets";

const statusStyles: Record<TicketStatus, string> = {
      Confirmed: "bg-green-500/15 text-green-400",
      "Sold Out": "bg-red-500/15 text-red-400",
      "Low Stock": "bg-yellow-500/15 text-yellow-400",
};

export function StatusBadge({ status }: { status: TicketStatus }) {
      return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${statusStyles[status]}`}>{status}</span>;
}
