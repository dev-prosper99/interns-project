import type { TicketTier } from "./EventsDetailsTypes";

interface TicketTierRowProps {
  tier: TicketTier;
}

export default function TicketTierRow({ tier }: TicketTierRowProps) {
  return (
    <div className="grid grid-cols-3 items-center">
      <div className="flex flex-col gap-0.5 p-2">
        <p className="text-white font-medium text-sm">{tier.name}</p>
        {tier.subtitle && (
          <p className="text-neutral-400 text-xs">{tier.subtitle}</p>
        )}
      </div>
      <div className="p-2">
        <p className="text-sm" style={{ color: "#EA580C" }}>
          {tier.price}
        </p>
      </div>
      <div className="p-2">
        {tier.ticketsAvailable && (
          <p className="text-white text-sm">{tier.ticketsAvailable}</p>
        )}
      </div>
    </div>
  );
}
