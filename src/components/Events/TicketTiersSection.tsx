import TicketTierRow from "./TicketTierRow";
import type { TicketTier } from "./EventsDetailsTypes";
 
interface TicketTiersSectionProps {
  ticketTiers: TicketTier[];
}
 
export default function TicketTiersSection({ ticketTiers }: TicketTiersSectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-white text-sm font-medium">Ticket Tiers</p>
      <div
        className="rounded-2xl p-4 flex flex-col gap-4"
        style={{ backgroundColor: "#35363B" }}
      >
        {ticketTiers.map((tier) => (
          <TicketTierRow key={tier.id} tier={tier} />
        ))}
      </div>
    </div>
  );
}