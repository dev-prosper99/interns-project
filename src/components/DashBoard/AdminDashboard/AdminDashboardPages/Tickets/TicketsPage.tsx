import { useEffect, useMemo, useState } from "react";
import { WalletIcon, TicketIcon, SearchIcon } from "@/assets/icons";
import { Input } from "@/components/ui/input";

import TicketHeader from "./TicketHeader";
import Sidebar from "@/components/layouts/Sidebar";
import { Pagination } from "@/components/ui/paginition";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

async function ticketTypesRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
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
    throw new TicketTypesApiError(
      body.message || "Request failed",
      res.status,
      body.errors ?? [],
    );
  }

  return body.data;
}

/** PUT /api/TicketTypes/{ticketTypeId} */
function updateTicketType(
  ticketTypeId: string,
  payload: UpdateTicketTypePayload,
): Promise<TicketTypeDto> {
  return ticketTypesRequest<TicketTypeDto>(`/api/TicketTypes/${ticketTypeId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}



function formatNaira(value: number) {
  return `₦${value.toLocaleString("en-NG")}`;
}

function computeStatus(
  availableQuantity: number,
  totalQuantity: number,
): TicketStatus {
  if (availableQuantity <= 0) return "Sold Out";
  if (totalQuantity > 0 && availableQuantity / totalQuantity <= 0.1)
    return "Low Stock";
  return "Confirmed";
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<TicketTier[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState<string | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | undefined>(
    undefined,
  );

  const [editingTicket, setEditingTicket] = useState<TicketTier | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const events = useMemo(
    () => Array.from(new Set(tickets.map((t) => t.event))),
    [tickets],
  );
  useEffect(() => {
    const loadTickets = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
      } catch (error) {
        console.error(error);
        setLoadError("Failed to load tickets");
      } finally {
        setIsLoading(false);
      }
    };

    loadTickets();
  }, []);
  const types = useMemo(
    () => Array.from(new Set(tickets.map((t) => t.ticketTier))),
    [tickets],
  );
  const statuses: TicketStatus[] = ["Confirmed", "Sold Out", "Low Stock"];

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      !search ||
      ticket.ticketTier.toLowerCase().includes(search.toLowerCase()) ||
      ticket.event.toLowerCase().includes(search.toLowerCase());

    const matchesEvent = !eventFilter || ticket.event === eventFilter;
    const matchesType = !typeFilter || ticket.ticketTier === typeFilter;
    const matchesStatus = !statusFilter || ticket.status === statusFilter;

    return matchesSearch && matchesEvent && matchesType && matchesStatus;
  });

  const totalTicketsCreated = tickets.reduce((sum, t) => sum + t.total, 0);
  const totalSold = tickets.reduce((sum, t) => sum + t.sold, 0);
  const totalRevenue = tickets.reduce((sum, t) => sum + t.price * t.sold, 0);

  const handleEditClick = (ticket: TicketTier) => {
    setEditingTicket(ticket);
    setSaveError(null);
    setDialogOpen(true);
  };

  const handleSave = async (updated: TicketTier) => {
    setIsSaving(true);
    setSaveError(null);

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
      setSaveError(
        err instanceof TicketTypesApiError
          ? err.message
          : "Failed to update ticket type. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex bg-neutral-950 min-h-screen text-white">
      <Sidebar />

      <div className="flex-1">
        <TicketHeader />

        <div className="p-6">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
            <h2 className="text-lg font-medium mb-5">Ticket Management</h2>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search ticket name or event"
                  className="pl-9 bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500"
                />
              </div>

              <Select
                value={eventFilter}
                onValueChange={(v) => setEventFilter(v ?? undefined)}
              >
                <SelectTrigger className="w-full lg:w-48 bg-neutral-900 border-neutral-700 text-neutral-300">
                  <SelectValue placeholder="All Events" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-neutral-700 text-white">
                  {events.map((event) => (
                    <SelectItem key={event} value={event}>
                      {event}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={typeFilter}
                onValueChange={(v) => setTypeFilter(v ?? undefined)}
              >
                <SelectTrigger className="w-full lg:w-40 bg-neutral-900 border-neutral-700 text-neutral-300">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-neutral-700 text-white">
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as TicketStatus)
                }
              >
                <SelectTrigger className="w-full lg:w-40 bg-neutral-900 border-neutral-700 text-neutral-300">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-neutral-700 text-white">
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loadError && (
            <p className="mb-4 text-sm text-red-400">{loadError}</p>
          )}

          <div className="mt-6">
            <Pagination items={filteredTickets}>
              {(paginatedTickets) => (
                <TicketsTable
                  tickets={paginatedTickets}
                  onEdit={handleEditClick}
                  
                />
              )}
            </Pagination>
          </div>
        </div>

        <EditTicketDialog
          ticket={editingTicket}
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setSaveError(null);
          }}
          onSave={handleSave}
        
          
        />
      </div>
    </div>
  );
}
