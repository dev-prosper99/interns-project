import { useEffect, useMemo, useState } from "react";
import { WalletIcon, TicketIcon, SearchIcon } from "@/assets/icons";
import { Input } from "@/components/ui/input";

import { Pagination } from "@/components/ui/paginition";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCard } from "./StatCard";
import { TicketsTable } from "./TicketsTable";
import { EditTicketDialog } from "./EditTicketDialog";

import type { TicketTier, TicketStatus } from "@/types/tickets";

const API_BASE_URL = "https://peacemaker001-001-site1.ltempurl.com";

function getAuthToken(): string | null {
      return localStorage.getItem("token");
}

interface ApiResponse<T> {
      status: number;
      success: boolean;
      message: string;
      errors: string[];
      data: T;
}

interface TicketTypeDto {
      id: string;
      name: string;
      description: string;
      price: number;
      totalQuantity: number;
      soldCount: number;
      availableQuantity: number;
}

interface EventSummary {
      id?: string | number;
      Id?: string | number;
      title?: string;
      Title?: string;
}

interface EventsListResponse {
      success: boolean;
      message?: string;
      data?: { items?: EventSummary[] };
}

interface ApiTicketType {
      id?: string | number;
      Id?: string | number;
      name?: string;
      Name?: string;
      description?: string;
      Description?: string;
      price?: number | string;
      Price?: number | string;
      totalQuantity?: number | string;
      TotalQuantity?: number | string;
      soldCount?: number | string;
      SoldCount?: number | string;
      soldQuantity?: number | string;
      availableQuantity?: number | string;
      remainingQuantity?: number | string;
      ticketTypes?: ApiTicketType[];
      TicketTypes?: ApiTicketType[];
}

interface EventDetailsResponse {
      success: boolean;
      message?: string;
      data?: { ticketTypes?: ApiTicketType[]; TicketTypes?: ApiTicketType[] };
}

interface AnalyticsTicketType {
      ticketTypeId: string;
      name: string;
      soldCount: number;
      totalQuantity: number;
      remaining: number;
}

interface EventAnalyticsResponse {
      success: boolean;
      data?: { byTicketType?: AnalyticsTicketType[] };
}

interface UpdateTicketTypePayload {
      name: string;
      description: string;
      price: number;
      totalQuantity: number;
}

class TicketTypesApiError extends Error {
      errors: string[];
      status: number;

      constructor(message: string, status: number, errors: string[] = []) {
            super(message);
            this.name = "TicketTypesApiError";
            this.status = status;
            this.errors = errors;
      }
}

async function ticketTypesRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
      const token = getAuthToken();

      const res = await fetch(`${API_BASE_URL}${path}`, {
            ...options,
            headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                  ...options.headers,
            },
      });

      const body: ApiResponse<T> = await res.json();

      if (!res.ok || !body.success) {
            throw new TicketTypesApiError(body.message || "Request failed", res.status, body.errors ?? []);
      }

      return body.data;
}

/** PUT /api/TicketTypes/{ticketTypeId} */
function updateTicketType(ticketTypeId: string, payload: UpdateTicketTypePayload): Promise<TicketTypeDto> {
      return ticketTypesRequest<TicketTypeDto>(`/api/TicketTypes/${ticketTypeId}`, {
            method: "PUT",
            body: JSON.stringify(payload),
      });
}

function formatNaira(value: number) {
      return `₦${value.toLocaleString("en-NG")}`;
}

function computeStatus(availableQuantity: number, totalQuantity: number): TicketStatus {
      if (availableQuantity <= 0) return "Sold Out";
      if (totalQuantity > 0 && availableQuantity / totalQuantity <= 0.1) return "Low Stock";
      return "Confirmed";
}

export default function TicketsPage() {
      const [tickets, setTickets] = useState<TicketTier[]>([]);

      const [loadError, setLoadError] = useState<string | null>(null);
      const [isLoading, setIsLoading] = useState(true);
      const [search, setSearch] = useState("");
      const [eventFilter, setEventFilter] = useState("all");
      const [typeFilter, setTypeFilter] = useState("all");
      const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");

      const [editingTicket, setEditingTicket] = useState<TicketTier | null>(null);
      const [dialogOpen, setDialogOpen] = useState(false);

      const events = useMemo(() => Array.from(new Set(tickets.map((t) => t.event))), [tickets]);
      useEffect(() => {
            let cancelled = false;

            const loadTickets = async () => {
                  setIsLoading(true);
                  try {
                        setLoadError(null);
                        const userId = localStorage.getItem("userId");
                        if (!userId) throw new Error("User ID not found");

                        const token = getAuthToken()
                              ?.replace(/^Bearer\s+/i, "")
                              .trim();
                        const headers: HeadersInit = {
                              Accept: "application/json",
                              ...(token ? { Authorization: `Bearer ${token}` } : {}),
                        };
                        const eventsResponse = await fetch(`${API_BASE_URL}/api/Events/my-events/${encodeURIComponent(userId)}?page=1&pageSize=100`, {
                              headers,
                        });
                        const eventsBody: EventsListResponse = await eventsResponse.json();
                        if (!eventsResponse.ok || !eventsBody.success) {
                              throw new Error(eventsBody.message || `Failed to load events (${eventsResponse.status})`);
                        }

                        const eventTickets = await Promise.all(
                              (eventsBody.data?.items ?? []).map(async (event) => {
                                    const eventId = String(event.id ?? event.Id ?? "");
                                    if (!eventId) return [];

                                    const detailsResponse = await fetch(`${API_BASE_URL}/api/Events/${encodeURIComponent(eventId)}`, { headers });
                                    const detailsBody: EventDetailsResponse = await detailsResponse.json();
                                    if (!detailsResponse.ok || !detailsBody.success) {
                                          throw new Error(detailsBody.message || `Failed to load tickets for ${event.title ?? event.Title ?? "event"}`);
                                    }

                                    let analyticsTickets: AnalyticsTicketType[] = [];
                                    try {
                                          const analyticsResponse = await fetch(`${API_BASE_URL}/api/Analytics/events/${encodeURIComponent(eventId)}`, {
                                                headers,
                                          });
                                          if (analyticsResponse.ok) {
                                                const analyticsBody: EventAnalyticsResponse = await analyticsResponse.json();
                                                if (analyticsBody.success) analyticsTickets = analyticsBody.data?.byTicketType ?? [];
                                          }
                                    } catch {
                                          // Ticket details remain available even if analytics are temporarily unavailable.
                                    }

                                    const ticketTypes = detailsBody.data?.ticketTypes ?? detailsBody.data?.TicketTypes ?? [];
                                    return ticketTypes.map((ticket): TicketTier => {
                                          const id = String(ticket.id ?? ticket.Id ?? "");
                                          const name = String(ticket.name ?? ticket.Name ?? "Ticket");
                                          const analytics =
                                                analyticsTickets.find((item) => item.ticketTypeId === id) ??
                                                analyticsTickets.find((item) => item.name.toLowerCase() === name.toLowerCase());
                                          const total = Number(analytics?.totalQuantity ?? ticket.totalQuantity ?? ticket.TotalQuantity ?? 0);
                                          const available = Number(analytics?.remaining ?? ticket.availableQuantity ?? ticket.remainingQuantity ?? total);
                                          const sold = Number(
                                                analytics?.soldCount ??
                                                      ticket.soldCount ??
                                                      ticket.SoldCount ??
                                                      ticket.soldQuantity ??
                                                      Math.max(0, total - available),
                                          );
                                          const price = Number(ticket.price ?? ticket.Price ?? 0);

                                          return {
                                                id,
                                                ticketTier: name,
                                                tierSubtitle: String(ticket.description ?? ticket.Description ?? ""),
                                                event: String(event.title ?? event.Title ?? "Untitled Event"),
                                                price,
                                                isFree: price === 0,
                                                total,
                                                sold,
                                                status: computeStatus(available, total),
                                                description: String(ticket.description ?? ticket.Description ?? ""),
                                          };
                                    });
                              }),
                        );

                        if (!cancelled) setTickets(eventTickets.flat());
                  } catch (error) {
                        if (!cancelled) setLoadError(error instanceof Error ? error.message : "Failed to load tickets");
                  } finally {
                        if (!cancelled) setIsLoading(false);
                  }
            };

            void loadTickets();
            return () => {
                  cancelled = true;
            };
      }, []);
      const types = useMemo(() => Array.from(new Set(tickets.map((t) => t.ticketTier))), [tickets]);
      const statuses: TicketStatus[] = ["Confirmed", "Sold Out", "Low Stock"];

      const filteredTickets = tickets.filter((ticket) => {
            const matchesSearch =
                  !search || ticket.ticketTier.toLowerCase().includes(search.toLowerCase()) || ticket.event.toLowerCase().includes(search.toLowerCase());

            const matchesEvent = eventFilter === "all" || ticket.event === eventFilter;
            const matchesType = typeFilter === "all" || ticket.ticketTier === typeFilter;
            const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;

            return matchesSearch && matchesEvent && matchesType && matchesStatus;
      });

      const totalTicketsCreated = tickets.reduce((sum, t) => sum + t.total, 0);
      const totalSold = tickets.reduce((sum, t) => sum + t.sold, 0);
      const totalRevenue = tickets.reduce((sum, t) => sum + t.price * t.sold, 0);

      const handleEditClick = (ticket: TicketTier) => {
            setEditingTicket(ticket);

            setDialogOpen(true);
      };

      const handleSave = async (updated: TicketTier) => {
            try {
                  const dto: TicketTypeDto = await updateTicketType(updated.id, {
                        name: updated.ticketTier,
                        description: updated.description,
                        price: updated.price,
                        totalQuantity: updated.total,
                  });

                  setTickets((prev) =>
                        prev.map((t) =>
                              t.id === updated.id
                                    ? {
                                            ...t,
                                            ticketTier: dto.name,
                                            description: dto.description,
                                            price: dto.price,
                                            total: dto.totalQuantity,
                                            sold: dto.soldCount,
                                            status: computeStatus(dto.availableQuantity, dto.totalQuantity),
                                      }
                                    : t,
                        ),
                  );
                  setDialogOpen(false);
            } catch (err) {
                  if (err instanceof TicketTypesApiError) {
                        console.error("API error:", err.message, err.errors);
                        setLoadError(`Failed to update ticket: ${err.message}. ${err.errors.join(", ")}`);
                  }
            } finally {
            }
      };

      return (
            <div className="min-w-0 bg-neutral-950 text-white">
                  <div className="min-w-0">
                        <div className="space-y-4 p-4 md:p-6">
                              <h2 className="text-base font-medium text-neutral-200">Ticket Management</h2>

                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <StatCard
                                          icon={TicketIcon}
                                          iconColor="text-orange-400"
                                          iconBg="bg-orange-500/15"
                                          label="Total Tickets Created"
                                          value={totalTicketsCreated.toLocaleString()}
                                    />
                                    <StatCard
                                          icon={TicketIcon}
                                          iconColor="text-orange-400"
                                          iconBg="bg-orange-500/15"
                                          label="Total Sold"
                                          value={totalSold.toLocaleString()}
                                    />
                                    <StatCard
                                          icon={WalletIcon}
                                          iconColor="text-purple-400"
                                          iconBg="bg-purple-500/15"
                                          label="Total Revenue"
                                          value={formatNaira(totalRevenue)}
                                    />
                              </div>

                              <section className="rounded-lg border border-white/5 bg-[#111213] p-3 md:p-4">
                                    <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_160px_140px_140px]">
                                          <div className="relative min-w-0">
                                                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                                                <Input
                                                      value={search}
                                                      onChange={(e) => setSearch(e.target.value)}
                                                      placeholder="Search ticket name or event"
                                                      className="h-9 border-white/5 bg-[#1b1c1e] pl-9 text-xs text-white placeholder:text-neutral-500"
                                                />
                                          </div>

                                          <Select value={eventFilter} onValueChange={(v) => setEventFilter(v ?? "all")}>
                                                <SelectTrigger className="h-9 w-full border-white/5 bg-[#1b1c1e] text-xs text-neutral-300">
                                                      <SelectValue>{eventFilter === "all" ? "All Events" : eventFilter}</SelectValue>
                                                </SelectTrigger>
                                                <SelectContent className="border-neutral-800 bg-neutral-900 text-white">
                                                      <SelectItem value="all">All Events</SelectItem>
                                                      {events.map((event) => (
                                                            <SelectItem key={event} value={event}>
                                                                  {event}
                                                            </SelectItem>
                                                      ))}
                                                </SelectContent>
                                          </Select>

                                          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v ?? "all")}>
                                                <SelectTrigger className="h-9 w-full border-white/5 bg-[#1b1c1e] text-xs text-neutral-300">
                                                      <SelectValue>{typeFilter === "all" ? "All Types" : typeFilter}</SelectValue>
                                                </SelectTrigger>
                                                <SelectContent className="border-neutral-800 bg-neutral-900 text-white">
                                                      <SelectItem value="all">All Types</SelectItem>
                                                      {types.map((type) => (
                                                            <SelectItem key={type} value={type}>
                                                                  {type}
                                                            </SelectItem>
                                                      ))}
                                                </SelectContent>
                                          </Select>

                                          <Select value={statusFilter} onValueChange={(value) => setStatusFilter((value as TicketStatus | null) ?? "all")}>
                                                <SelectTrigger className="h-9 w-full border-white/5 bg-[#1b1c1e] text-xs text-neutral-300">
                                                      <SelectValue>{statusFilter === "all" ? "All Status" : statusFilter}</SelectValue>
                                                </SelectTrigger>
                                                <SelectContent className="border-neutral-800 bg-neutral-900 text-white">
                                                      <SelectItem value="all">All Status</SelectItem>
                                                      {statuses.map((status) => (
                                                            <SelectItem key={status} value={status}>
                                                                  {status}
                                                            </SelectItem>
                                                      ))}
                                                </SelectContent>
                                          </Select>
                                    </div>

                                    {loadError && <p className="mb-4 text-sm text-red-400">{loadError}</p>}
                                    {isLoading && <p className="mb-4 text-sm text-neutral-400">Loading ticket tiers...</p>}

                                    <div>
                                          <Pagination items={filteredTickets}>
                                                {(paginatedTickets) => <TicketsTable tickets={paginatedTickets} onEdit={handleEditClick} />}
                                          </Pagination>
                                    </div>
                              </section>

                              <EditTicketDialog
                                    ticket={editingTicket}
                                    open={dialogOpen}
                                    onOpenChange={(open) => {
                                          setDialogOpen(open);
                                    }}
                                    onSave={handleSave}
                              />
                        </div>
                  </div>
            </div>
      );
}
