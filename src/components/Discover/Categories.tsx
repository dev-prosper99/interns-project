import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/cards/EventCard";
import { useEffect, useState } from "react";
 
import event1 from "@/assets/event-1.png";
import event2 from "@/assets/event-2.png";
import event3 from "@/assets/event-3.png";
import event4 from "@/assets/event-4.png";
import event5 from "@/assets/event-5.png";
import event6 from "@/assets/event-6.png";
 
const images = [event1, event2, event3, event4, event5, event6];
 
const API_BASE_URL = "https://peacemaker001-001-site1.ltempurl.com";
 
interface EventListItem {
  id: string;
  title: string;
  venue: string;
  city: string;
  eventDate: string;
  bannerUrl: string | null;
  status: string;
  organizerName: string;
}
 
interface EventsApiResponse {
  status: number;
  success: boolean;
  message: string;
  errors: string[];
  data: {
    items: EventListItem[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
 
interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  totalQuantity: number;
}
 
interface EventDetail {
  id: string;
  title: string;
  description: string;
  venue: string;
  state: string;
  city: string;
  eventDate: string;
  bannerUrl: string | null;
  eventPolicy: string;
  availabilityStart: string;
  availabilityEnd: string;
  status: string;
  organizerName: string;
  ticketTypes: TicketType[];
}
 
interface EventDetailApiResponse {
  status: number;
  success: boolean;
  message: string;
  errors: string[];
  data: EventDetail;
}
 
interface EventWithPrice extends EventListItem {
  minPrice: number | null;
  priceLoading: boolean;
}
 
const filterCategories = [
  { label: "All Categories", value: "all" },
  { label: "Music", value: "music" },
  { label: "Tech", value: "tech" },
  { label: "Comedy", value: "comedy" },
  { label: "Sports", value: "sports" },
  { label: "Art", value: "art" },
  { label: "Food", value: "food" },
  { label: "Fashion", value: "fashion" },
  { label: "Wellness", value: "wellness" },
  { label: "Culture", value: "culture" },
  { label: "Business", value: "business" },
  { label: "Gaming", value: "gaming" },
];
 
const PAGE_SIZE = 6;
 
function matchesDateFilter(eventDateStr: string, dateFilter?: string): boolean {
  if (!dateFilter) return true;
 
  const eventDate = new Date(eventDateStr);
  const eventDay = new Date(
    eventDate.getFullYear(),
    eventDate.getMonth(),
    eventDate.getDate()
  );
 
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
 
  switch (dateFilter) {
    case "Today": {
      return eventDay.getTime() === today.getTime();
    }
    case "Tomorrow": {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return eventDay.getTime() === tomorrow.getTime();
    }
    case "This Week": {
      const endOfWeek = new Date(today);
      endOfWeek.setDate(endOfWeek.getDate() + (7 - today.getDay()));
      return eventDay >= today && eventDay <= endOfWeek;
    }
    case "This Month": {
      return (
        eventDay.getFullYear() === today.getFullYear() &&
        eventDay.getMonth() === today.getMonth()
      );
    }
    default:
      return true;
  }
}
 
function matchesPriceFilter(minPrice: number | null, priceFilter?: string): boolean {
  if (!priceFilter) return true;
  if (minPrice === null) return false;
 
  switch (priceFilter) {
    case "Free":
      return minPrice === 0;
    case "₦0 - ₦5,000":
      return minPrice > 0 && minPrice <= 5000;
    case "₦5,000+":
      return minPrice > 5000;
    default:
      return true;
  }
}
 
interface CategoriesProps {
  search?: string;
  city?: string;
  price?: string;
  date?: string;
}
 
export default function Categories({ search, city, price, date }: CategoriesProps) {
  const [events, setEvents] = useState<EventWithPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(1);
 
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
 
        const response = await fetch(
          `${API_BASE_URL}/api/Events?page=1&pageSize=100`
        );
 
        const result: EventsApiResponse = await response.json();
 
        if (!result.success) {
          throw new Error(result.message);
        }
 
        const eventsWithPrices: EventWithPrice[] = await Promise.all(
          result.data.items.map(async (event) => {
            try {
              const detailResponse = await fetch(
                `${API_BASE_URL}/api/Events/${event.id}`
              );
 
              const detailData: EventDetailApiResponse = await detailResponse.json();
 
              const minPrice =
                detailData.data.ticketTypes.length > 0
                  ? Math.min(...detailData.data.ticketTypes.map((t) => t.price))
                  : 0;
 
              return {
                ...event,
                minPrice,
                priceLoading: false,
              };
            } catch {
              return {
                ...event,
                minPrice: null,
                priceLoading: false,
              };
            }
          })
        );
 
        setEvents(eventsWithPrices);
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };
 
    fetchEvents();
  }, []);
 
  const filteredEvents = events.filter((event) => {
    // NOTE: no category field exists on the API data yet, so this is a no-op
    // beyond "all" until the backend returns one.
    const matchesCategory = selectedCategory === "all";
 
    const matchesSearch =
      !search || event.title.toLowerCase().includes(search.toLowerCase());
 
    const matchesCity =
      !city || event.venue.toLowerCase().includes(city.toLowerCase());
 
    const matchesPrice = matchesPriceFilter(event.minPrice, price);
    const matchesDate = matchesDateFilter(event.eventDate, date);
 
    return matchesCategory && matchesSearch && matchesCity && matchesPrice && matchesDate;
  });
 
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE));
  const paginatedEvents = filteredEvents.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );
 
  const handleCategorySelect = (value: string) => {
    setSelectedCategory(value);
    setPage(1);
  };
 
  const goToPrevPage = () => setPage((p) => Math.max(1, p - 1));
  const goToNextPage = () => setPage((p) => Math.min(totalPages, p + 1));
 
  return (
    <div className="px-6 md:px-16 py-16 bg-neutral-950">
      <div className="mb-6">
        <h2 className="text-white text-2xl font-bold">Events Near You</h2>
        <p className="text-neutral-400 text-sm mt-1">
          Don't miss what's happening near you
        </p>
      </div>
 
      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-4">
        {filterCategories.map((category) => (
          <button
            key={category.value}
            onClick={() => handleCategorySelect(category.value)}
            className={`rounded-md px-3 py-1.5 text-sm border transition-colors ${
              selectedCategory === category.value
                ? "bg-purple-500 text-white border-purple-500"
                : "border-neutral-700 text-white hover:bg-purple-500/10 hover:text-purple-500"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
 
      <p className="text-neutral-400 text-sm mb-6">
        {loading ? "Loading events..." : `${filteredEvents.length} events found`}
      </p>
 
      {/* Grid */}
      {!loading && paginatedEvents.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedEvents.map((event, i) => {
            const eventDate = new Date(event.eventDate);
 
            return (
              <EventCard
                key={event.id}
                imageUrl={event.bannerUrl ?? images[i % images.length]}
                eventTitle={event.title}
                eventCategory=""
                venue={`${event.venue}, ${event.city}`}
                numberAttending={event.organizerName}
                startDate={eventDate.toLocaleDateString()}
                startTime={eventDate.toLocaleTimeString()}
                ticketPrice={event.minPrice !== null ? String(event.minPrice) : ""}
              />
            );
          })}
        </div>
      )}
 
      {!loading && paginatedEvents.length === 0 && (
        <p className="text-neutral-400 text-center py-16">
          No events match your filters.
        </p>
      )}
 
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <Button
            variant="outline"
            onClick={goToPrevPage}
            disabled={page === 1}
            className="bg-neutral-900 border-neutral-700 text-white hover:bg-neutral-800 disabled:opacity-40"
          >
            Prev
          </Button>
 
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
            <Button
              key={p}
              onClick={() => setPage(p)}
              className={
                p === page
                  ? "bg-purple-500 hover:bg-purple-600 text-white"
                  : "bg-neutral-900 hover:bg-neutral-800 text-white"
              }
            >
              {p}
            </Button>
          ))}
 
          <Button
            variant="outline"
            onClick={goToNextPage}
            disabled={page === totalPages}
            className="bg-neutral-900 border-neutral-700 text-white hover:bg-neutral-800 disabled:opacity-40"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}