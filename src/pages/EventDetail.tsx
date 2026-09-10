import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
 
interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  totalQuantity: number;
  remainingQuantity?: number;
  soldQuantity?: number;
}
 
interface EventDetailData {
  id: string;
  title: string;
  description: string;
  venue: string;
  state: string;
  city: string;
  eventDate: string;
  bannerUrl: string;
  eventPolicy: string;
  availabilityStart: string;
  availabilityEnd: string;
  status: string;
  organizerName: string;
  ticketTypes: TicketType[];
}
 
interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  errors: string[];
  data: T;
}
 
const BASE_URL = "https://peacemaker001-001-site1.ltempurl.com";
 
const EventDetail = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
 
  const [event, setEvent] = useState<EventDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qtyByTicketId, setQtyByTicketId] = useState<Record<string, number>>({});
 
  useEffect(() => {
    if (!eventId) return;
    let isMounted = true;
 
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BASE_URL}/api/Events/${eventId}`);
 
        if (!res.ok) {
          throw new Error(`Request failed (${res.status})`);
        }
 
        const json: ApiResponse<EventDetailData> = await res.json();
 
        if (!json.success) {
          throw new Error(json.message || "Failed to fetch event");
        }
 
        if (isMounted) setEvent(json.data);
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Something went wrong");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
 
    fetchEvent();
    return () => {
      isMounted = false;
    };
  }, [eventId]);
 
  const updateQty = (ticketId: string, delta: number) => {
    setQtyByTicketId((prev) => ({
      ...prev,
      [ticketId]: Math.max(0, (prev[ticketId] ?? 0) + delta),
    }));
  };
 
  const totalTickets = Object.values(qtyByTicketId).reduce((a, b) => a + b, 0);
 
  if (loading) return <div className="p-8 text-center text-white">Loading event…</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!event) return <div className="p-8 text-center text-white">Event not found.</div>;
 
  return (
    <div className="max-w-fit mx-auto bg-neutral-1000 text-white">
      <button onClick={() => navigate(-1)} className="my-4 text-sm text-neutral-400">
        ← Back
      </button>
 
      {event.bannerUrl && (
        <img src={event.bannerUrl} alt={event.title} className="w-fit h-auto rounded-lg" />
      )}
 
      <h1 className="text-2xl font-bold mt-4">{event.title}</h1>
      <p className="text-neutral-400 mt-2">{event.description}</p>
      <p className="text-sm text-neutral-400 mt-2">
        {event.venue}, {event.city}, {event.state}
      </p>
      <p className="text-sm text-neutral-400">
        {new Date(event.eventDate).toLocaleString()}
      </p>
      <p className="text-sm text-neutral-400">Organizer: {event.organizerName}</p>
 
      <h2 className="text-lg font-semibold mt-6">Select Ticket</h2>
      <p className="text-sm text-neutral-400 mb-3">
        {event.ticketTypes.length} ticket types available
      </p>
 
      {event.ticketTypes.map((ticket) => {
        const left = ticket.remainingQuantity ?? ticket.totalQuantity;
        return (
          <div key={ticket.id} className="border border-neutral-700 rounded-lg p-4 mb-3">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">{ticket.name}</p>
                <p className="text-sm text-neutral-400">{ticket.description}</p>
              </div>
              <p>₦{Number(ticket.price).toLocaleString()}</p>
            </div>
 
            {typeof left === "number" && (
              <p className="text-xs text-neutral-500 mt-1">{left} left</p>
            )}
 
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => updateQty(ticket.id, -1)}
                className="w-7 h-7 rounded-full bg-neutral-700 flex items-center justify-center"
              >
                −
              </button>
              <span>{qtyByTicketId[ticket.id] ?? 0}</span>
              <button
                onClick={() => updateQty(ticket.id, 1)}
                className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        );
      })}
 
      <button
        onClick={() => navigate("/login", { state: { from: `/events/${event.id}` } })}
        disabled={totalTickets === 0}
        className="w-full bg-purple-600 disabled:bg-neutral-700 text-white py-3 rounded-lg mt-4"
      >
        Login to Continue
      </button>
    </div>
  );
};
 
export default EventDetail;
 