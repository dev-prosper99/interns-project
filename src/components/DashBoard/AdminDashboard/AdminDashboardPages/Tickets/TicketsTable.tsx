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
            <div className="overflow-x-auto rounded-md">
                  <table className="w-full min-w-[720px] text-xs">
                        <thead>
                              <tr className="bg-[#1b1c1e] text-left text-neutral-400">
                                    <th className="rounded-l-md px-2.5 py-2.5 font-medium">Ticket Tier</th>
                                    <th className="px-2.5 py-2.5 font-medium">Event</th>
                                    <th className="px-2.5 py-2.5 font-medium">Price</th>
                                    <th className="px-2.5 py-2.5 font-medium">Total</th>
                                    <th className="px-2.5 py-2.5 font-medium">Sold</th>
                                    <th className="px-2.5 py-2.5 font-medium">Status</th>
                                    <th className="rounded-r-md px-2.5 py-2.5 text-right font-medium">Actions</th>
                              </tr>
                        </thead>
                        <tbody>
                              {tickets.length === 0 && (
                                    <tr>
                                          <td colSpan={7} className="px-3 py-10 text-center text-neutral-500">
                                                No ticket tiers match your filters.
                                          </td>
                                    </tr>
                              )}

                              {tickets.map((ticket) => (
                                    <tr key={ticket.id} className="border-b border-white/5 text-neutral-200 last:border-0 hover:bg-white/[0.025]">
                                          <td className="px-2.5 py-2">
                                                <p className="font-medium">{ticket.ticketTier}</p>
                                                <p className="text-[10px] text-neutral-500">{ticket.tierSubtitle}</p>
                                          </td>
                                          <td className="px-2.5 py-2 text-neutral-300">{ticket.event}</td>
                                          <td className="px-2.5 py-2">
                                                {ticket.isFree ? <span className="text-green-400">Free</span> : formatNaira(ticket.price)}
                                          </td>
                                          <td className="px-2.5 py-2 text-neutral-300">{ticket.total.toLocaleString()}</td>
                                          <td className="px-2.5 py-2 text-neutral-300">{ticket.sold.toLocaleString()}</td>
                                          <td className="px-2.5 py-2">
                                                <StatusBadge status={ticket.status} />
                                          </td>
                                          <td className="px-2.5 py-2 text-right">
                                                <button
                                                      onClick={() => onEdit(ticket)}
                                                      aria-label={`Edit ${ticket.ticketTier} for ${ticket.event}`}
                                                      className="inline-flex h-7 w-7 items-center justify-center rounded text-neutral-500 transition-colors hover:bg-white/5 hover:text-neutral-200"
                                                >
                                                      <Pencil className="h-3.5 w-3.5" />
                                                </button>
                                          </td>
                                    </tr>
                              ))}
                        </tbody>
                  </table>
            </div>
      );
}
