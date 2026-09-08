import { useMemo, useState } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import { ExportIcon, SearchIcon, MailIcon, EyeIcon } from "@/assets/icons";
import AttendeeHeader from "./AttendeeHeader";
import { ATTENDEES, TIER_SUBTITLE, type Attendee, type Status } from "./Data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/paginition";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
 
const STATUS_STYLES: Record<Status, string> = {
  Confirmed: "bg-violet-600/20 text-violet-400",
  "Checked-in": "bg-emerald-500/20 text-emerald-400",
  Pending: "bg-amber-500/20 text-amber-400",
  Cancelled: "bg-rose-500/20 text-rose-400",
};
 
function formatAmount(amount: number | "Free") {
  if (amount === "Free") return "Free";
  return `₦${amount.toLocaleString()}`;
}
 
function Avatar({ name, color }: { name: string; color: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${color} text-xs font-semibold text-white`}
    >
      {initials}
    </div>
  );
}
 
function TierCell({ attendee }: { attendee: Attendee }) {
  return (
    <div>
      <div className="font-medium text-white">{attendee.ticketTier}</div>
      <div className="text-xs text-neutral-500">
        {TIER_SUBTITLE[attendee.ticketTier]}
      </div>
    </div>
  );
}
 
function AttendeeDetailsModal({
  attendee,
  onClose,
}: {
  attendee: Attendee;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-950 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between">
          <h2 className="text-lg font-semibold text-white">Attendee Details</h2>
          <div className="flex items-center gap-2">
            <div
              className="h-8 w-8 text-white"
              onClick={onClose}
              aria-label="Close"
            ></div>
          </div>
        </div>
 
        <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
          <Field label="Attendee" value={attendee.name} />
          <Field label="Email Address" value={attendee.email} />
          <Field label="Event" value={attendee.event} />
          <div>
            <dt className="mb-1 text-xs text-neutral-500">Ticket Tier</dt>
            <dd>
              <TierCell attendee={attendee} />
            </dd>
          </div>
          <Field label="Tickets" value={String(attendee.tickets)} />
          <Field label="Ticket No" value={attendee.ticketNo} />
          <Field
            label="Amount Paid"
            value={formatAmount(attendee.amountPaid)}
            valueClass={
              attendee.amountPaid === "Free" ? "text-emerald-400" : undefined
            }
          />
          <Field label="Purchase Date" value={attendee.purchaseDate} />
          <Field label="Guest Code" value={attendee.guestCode} />
          <div>
            <dt className="mb-1 text-xs text-neutral-500">Status</dt>
            <dd>
              <span
                className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${STATUS_STYLES[attendee.status]}`}
              >
                {attendee.status}
              </span>
            </dd>
          </div>
          <div className="col-span-2">
            <Field label="Phone Number" value={attendee.phone} />
          </div>
        </dl>
 
        <div className="mt-6 flex gap-3">
          <Button variant="primary" className="flex-1">
            <MailIcon />
            Send Reminder
          </Button>
          <Button variant="yellow">Mark Checked-in</Button>
        </div>
      </div>
    </div>
  );
}
 
function Field({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div>
      <dt className="mb-1 text-xs text-neutral-500">{label}</dt>
      <dd className={`truncate text-sm text-neutral-200 ${valueClass ?? ""}`}>
        {value}
      </dd>
    </div>
  );
}
 
export default function AttendeesPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Attendee | null>(null);
 
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ATTENDEES;
    return ATTENDEES.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.ticketNo.toLowerCase().includes(q),
    );
  }, [search]);
 
  return (
    <div className="flex min-h-screen bg-neutral-950">
      <Sidebar />
 
      <div className="flex flex-1 flex-col">
        <AttendeeHeader onMenuClick={() => {}} />
 
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-white">Attendees</h1>
              <p className="mt-1 text-sm text-neutral-500">
                A list of all event attendees
              </p>
            </div>
            <Button
              variant="primary"
              className="flex items-center gap-2 text-white"
            >
              <ExportIcon />
              Export
            </Button>
          </div>
 
          <div className="mb-4 flex flex-wrap gap-3">
            <div className="relative min-w-55 flex-1">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email or ticket number"
                className="border-white/10 pl-9 text-neutral-200 placeholder:text-neutral-500 focus-visible:border-violet-500"
              />
            </div>
            <Select defaultValue="all-events">
              <SelectTrigger className="border-white/10 bg-neutral-900 text-neutral-300">
                <SelectValue placeholder="All Events" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-events">All Events</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-status">
              <SelectTrigger className="border-white/10 bg-neutral-900 text-neutral-300">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
 
          <div className="overflow-hidden rounded-xl border border-white/10 bg-neutral-1000">
            <Pagination items={filtered} initialPageSize={10}>
              {(paginated) => (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-225 text-left text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-neutral-500">
                          <th className="px-4 py-3 font-medium">Attendee</th>
                          <th className="px-4 py-3 font-medium">Event</th>
                          <th className="px-4 py-3 font-medium">Ticket Tier</th>
                          <th className="px-4 py-3 font-medium">Tickets</th>
                          <th className="px-4 py-3 font-medium">Amount Paid</th>
                          <th className="px-4 py-3 font-medium">Purchase Date</th>
                          <th className="px-4 py-3 font-medium">Status</th>
                          <th className="px-4 py-3 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginated.map((a) => (
                          <tr
                            key={a.id}
                            className="border-b border-white/5 last:border-0 hover:bg-white/"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <Avatar name={a.name} color={a.avatarColor} />
                                <div className="min-w-0">
                                  <div className="truncate font-medium text-white">
                                    {a.name}
                                  </div>
                                  <div className="truncate text-xs text-neutral-500">
                                    {a.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-neutral-200">{a.event}</td>
                            <td className="px-4 py-3">
                              <TierCell attendee={a} />
                            </td>
                            <td className="px-4 py-3 text-neutral-300">
                              {a.tickets}
                            </td>
                            <td
                              className={`px-4 py-3 ${a.amountPaid === "Free" ? "text-emerald-400" : "text-neutral-300"}`}
                            >
                              {formatAmount(a.amountPaid)}
                            </td>
                            <td className="px-4 py-3 text-neutral-400">
                              {a.purchaseDate}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[a.status]}`}
                              >
                                {a.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div
                                onClick={() => setSelected(a)}
                                className="flex items-center gap-2 cursor-pointer text-sm font-medium"
                              >
                                <EyeIcon />{" "}
                                <p className="text-purple-500 cursor-pointer">
                                  View details
                                </p>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                  </div>
                </>
              )}
            </Pagination>
            
          </div>
        </main>
      </div>
 
      {selected && (
        <AttendeeDetailsModal attendee={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
 