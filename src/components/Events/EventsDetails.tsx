import Pill from "./Pill";
import DetailField from "./DetailField";
import EventDetailsHeader from "./EventDetailsHeader";
import EventDetailGrid from "./EventDetailGrid";
import TicketTiersSection from "./TicketTiersSection";
import PromoCodeBanner from "./PromoCodeBanner";
import BannerImageSection from "./BannerImageSection";
import EventDetailsFooter from "./EventDetailsFooter";
import type { EventDetailData } from "./EventsDetailsTypes";

interface EventDetailsProps {
  event: EventDetailData;
  onClose: () => void;
  onBack: () => void;
  onEdit: () => void;
}

const statusColors: Record<string, string> = {
  Published: "#0F973D",
  Draft: "#E4A63D",
};

export default function EventDetails({
  event,
  onClose,
  onBack,
  onEdit,
}: EventDetailsProps) {
  return (
    <div
      className="w-full max-h-[95vh] max-w-282 rounded-2xl border flex flex-col gap-8 sm:gap-10 p-5 sm:py-10 sm:px-8"
      style={{ backgroundColor: "#111213", borderColor: "#282A2D" }}
    >
      <EventDetailsHeader onClose={onClose} />

      <div className="flex flex-col gap-6 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
        <Pill
          label={event.status}
          color={statusColors[event.status] ?? "#6B7280"}
        />
        <EventDetailGrid event={event} />
        <TicketTiersSection ticketTiers={event.ticketTiers} />
        <PromoCodeBanner
          code={event.promoCode}
          discount={event.promoDiscount}
        />
        <DetailField label="Refund Policy" value={event.refundPolicy} />
        <DetailField label="Description" value={event.description} />
        <BannerImageSection image={event.bannerUrl} alt={event.title} />
      </div>

      <EventDetailsFooter onBack={onBack} onEdit={onEdit} />
    </div>
  );
}
