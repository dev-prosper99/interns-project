import { useMemo, useState } from "react";
import { WalletIcon , TicketIcon  , SearchIcon} from "@/assets/icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TicketHeader from "./TicketHeader";
import Sidebar from "@/components/layouts/Sidebar";

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
import { TicketTiers as initialTickets } from "@/constants/tickets";
import type { TicketTier, TicketStatus } from "@/types/tickets";

const PAGE_SIZE = 10;

function formatNaira(value: number) {
  return `₦${value.toLocaleString("en-NG")}`;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<TicketTier[]>(initialTickets);
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState<string | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | undefined>(
    undefined
  );
  const [page, setPage] = useState(1);
  const [editingTicket, setEditingTicket] = useState<TicketTier | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const events = useMemo(
    () => Array.from(new Set(tickets.map((t) => t.event))),
    [tickets]
  );
  const types = useMemo(
    () => Array.from(new Set(tickets.map((t) => t.ticketTier))),
    [tickets]
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

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / PAGE_SIZE));
  const paginatedTickets = filteredTickets.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const totalTicketsCreated = tickets.reduce((sum, t) => sum + t.total, 0);
  const totalSold = tickets.reduce((sum, t) => sum + t.sold, 0);
  const totalRevenue = tickets.reduce((sum, t) => sum + t.price * t.sold, 0);

  const handleEditClick = (ticket: TicketTier) => {
    setEditingTicket(ticket);
    setDialogOpen(true);
  };

  const handleSave = (updated: TicketTier) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
  };

  const goToPrevPage = () => setPage((p) => Math.max(1, p - 1));
  const goToNextPage = () => setPage((p) => Math.min(totalPages, p + 1));

  return (

    <div className="flex bg-neutral-950 min-h-screen text-white">
      
        <Sidebar />
      
      <div className="flex-1">
        <TicketHeader />
    
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
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search ticket name or event"
              className="pl-9 bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500"
            />
          </div>

          <Select
            value={eventFilter}
            onValueChange={(v) => {
              setEventFilter(v ?? undefined);
              setPage(1);
            }}
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
            onValueChange={(v) => {
              setTypeFilter(v ?? undefined);
              setPage(1);
            }}
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
            onValueChange={(v) => {
              setStatusFilter((v as TicketStatus) ?? undefined);
              setPage(1);
            }}
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

        {/* Table */}
        <TicketsTable tickets={paginatedTickets} onEdit={handleEditClick} />

        {/* Pagination */}
        <div className="flex items-center justify-between mt-5">
          <span className="text-sm text-neutral-500">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevPage}
              disabled={page === 1}
              className="bg-neutral-900 border-neutral-700 text-white hover:bg-neutral-800 disabled:opacity-40"
            >
              Prev
            </Button>
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-500 text-sm text-white">
              {page}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={page === totalPages}
              className="bg-neutral-900 border-neutral-700 text-white hover:bg-neutral-800 disabled:opacity-40"
            >
              Next
            </Button>
          </div>
          <span className="text-sm text-neutral-500">
            Page Size {PAGE_SIZE}
          </span>
        </div>
      </div>

      <EditTicketDialog
        ticket={editingTicket}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
      />
    </div>
  );
}
