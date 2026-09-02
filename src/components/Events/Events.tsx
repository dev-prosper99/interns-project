import { useState } from "react";
import { Events } from "@/constants/events";
import DashboardHeader from "./DashboardHeader";
import EventsPageHeader from "./EventsPageHeader";
import SearchFilterBar from "./SearchFilterBar";
import EventsTable from "./EventsTable";
import EventCardList from "./EventCardList";
import EventsPagination from "./EventsPagination";
import DeleteEventModal from "./DeleteEventModal";
import UnpublishEventModal from "./UnpublishEventModal";
import EventDetails from "./EventsDetails";
import type { EventRowData } from "./Types";
import {
  splitVenue,
  DEFAULT_PROMO_CODE,
  DEFAULT_PROMO_DISCOUNT,
  DEFAULT_REFUND_POLICY,
  DEFAULT_DESCRIPTION,
  type EventDetailData,
} from "./EventsDetailsTypes";
 
import events1 from "@/assets/event-1.png";
import events2 from "@/assets/event-2.png";
import events3 from "@/assets/event-3.png";
import events4 from "@/assets/event-4.png";
 
const eventImages = [events1, events2, events3, events4];
const hardcodedRevenue = "₦27,300,000";
const hardcodedStatus = ["Published", "Published", "Published", "Draft"];
 
export default function EventsPage() {
  const [search, setSearch] = useState("");

  const [hiddenIds, setHiddenIds] = useState<Set<string | number>>(new Set());
  const [statusOverrides, setStatusOverrides] = useState<Record<string | number, string>>({});
 
  const [deleteTarget, setDeleteTarget] = useState<EventRowData | null>(null);
  const [unpublishTarget, setUnpublishTarget] = useState<EventRowData | null>(null);
  const [viewTargetId, setViewTargetId] = useState<string | number | null>(null);
 
  const rows: EventRowData[] = Events.slice(0, 4)
    .map((event, index) => ({
      id: index,
      title: event.eventTitle,
      venue: event.venue,
      date: event.startDate,
      time: event.startTime,
      category: event.eventCategory,
      image: eventImages[index],
      revenue: hardcodedRevenue,
      status: statusOverrides[index] ?? hardcodedStatus[index],
    }))
    .filter((row) => !hiddenIds.has(row.id));

  const viewTarget: EventDetailData | null =
    viewTargetId !== null && typeof viewTargetId === "number"
      ? (() => {
          const raw = Events[viewTargetId];
          const { venue, state } = splitVenue(raw.venue);
          return {
            id: viewTargetId,
            status: statusOverrides[viewTargetId] ?? hardcodedStatus[viewTargetId],
            title: raw.eventTitle,
            category: raw.eventCategory,
            venue,
            state,
            numberAttending: raw.numberAttending,
            startDate: raw.startDate,
            startTime: raw.startTime,
            image: eventImages[viewTargetId],
            promoCode: DEFAULT_PROMO_CODE,
            promoDiscount: DEFAULT_PROMO_DISCOUNT,
            refundPolicy: DEFAULT_REFUND_POLICY,
            description: DEFAULT_DESCRIPTION,
            ticketTiers: [
              { id: "regular", name: "Regular", price: `₦${raw.regular_ticketPrice}` },
              { id: "vip", name: "VIP", price: `₦${raw.vip_ticketPrice}` },
              { id: "vvip", name: "VVIP", price: `₦${raw.vvip_ticketPrice}` },
            ],
          };
        })()
      : null;
 
  const handleConfirmDelete = () => {
    if (deleteTarget) {
      setHiddenIds((prev) => new Set(prev).add(deleteTarget.id));
    }
    setDeleteTarget(null);
  };
 
  const handleConfirmUnpublish = () => {
    if (unpublishTarget) {
      setStatusOverrides((prev) => ({ ...prev, [unpublishTarget.id]: "Draft" }));
    }
    setUnpublishTarget(null);
  };
 
  return (
    <>
      <DashboardHeader title="Events" />
 
      <div className="bg-neutral-950 p-4 md:p-8">
        <EventsPageHeader />
 
        <div className="rounded-2xl p-4 md:p-8" style={{ backgroundColor: "#111213" }}>
          <SearchFilterBar search={search} onSearchChange={setSearch} />
          <EventsTable
            events={rows}
            onViewClick={(row) => setViewTargetId(row.id)}
            onDeleteClick={setDeleteTarget}
            onUnpublishClick={setUnpublishTarget}
          />
          <EventCardList
            events={rows}
            onViewClick={(row) => setViewTargetId(row.id)}
            onDeleteClick={setDeleteTarget}
            onUnpublishClick={setUnpublishTarget}
          />
          <EventsPagination />
        </div>
      </div>
 
      {deleteTarget && (
        <DeleteEventModal
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
 
      {unpublishTarget && (
        <UnpublishEventModal
          onCancel={() => setUnpublishTarget(null)}
          onConfirm={handleConfirmUnpublish}
        />
      )}
 
      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8 overflow-y-auto">
          <EventDetails
            event={viewTarget}
            onClose={() => setViewTargetId(null)}
            onBack={() => setViewTargetId(null)}
            onEdit={() => {
              // TODO: wire to actual edit flow once that page/route exists.
              setViewTargetId(null);
            }}
          />
        </div>
      )}
    </>
  );
}