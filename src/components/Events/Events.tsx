import { useState } from "react";
import { Events } from "@/constants/events";
import { Input } from "@/components/ui/input";
import {
  ViewIcon,
  Edit02Icon,
  ToggleOnIcon,
  Delete02Icon,
  PlusIcon,
  SearchRightIcon,
  BellIcon,
} from "@/assets/icons";
 
import events1 from "@/assets/event-1.png";
import events2 from "@/assets/event-2.png";
import events3 from "@/assets/event-3.png";
import events4 from "@/assets/event-4.png";
 
const eventImages = [events1, events2, events3, events4];
 
const hardcodedRevenue = "₦27,300,000";
const hardcodedStatus = ["Published", "Published", "Published", "Draft"];
 
const categoryColors: Record<string, string> = {
  Music: "#EA580C",
  Tech: "#7C3AED",
  Comedy: "#E4A63D",
  Art: "#7C3AED",
};
 
const statusColors: Record<string, string> = {
  Published: "#0F973D",
  Draft: "#E4A63D",
};
 
// Small helper to render a pill with solid text over a 24%-opacity tint of the same color
function Pill({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full text-xs font-medium"
      style={{
        color,
        backgroundColor: `${color}3D`, // ~24% opacity hex suffix
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 8,
        paddingRight: 8,
      }}
    >
      {label}
    </span>
  );
}
 
// Dashboard Header — fixed 1584x104, horizontal, space-between, padding 32/40, 1px bottom border, bg #111213
function DashboardHeader() {
  return (
    <div
      className="flex items-center justify-between border-b border-neutral-800"
      style={{
        backgroundColor: "#111213",
        paddingTop: 32,
        paddingBottom: 32,
        paddingLeft: 40,
        paddingRight: 40,
      }}
    >
      <h1 className="text-white text-xl font-semibold">Events</h1>
      <button aria-label="Notifications" className="relative">
        <BellIcon className="w-5 h-5 text-neutral-300" />
        <span
          className="absolute rounded-full bg-red-500"
          style={{ width: 6, height: 6, top: -1, right: -1 }}
        />
      </button>
    </div>
  );
}
 
export default function EventsTable() {
  const [search, setSearch] = useState("");
 
  const visibleEvents = Events.slice(0, 4);
 
  return (
    <>
      <DashboardHeader />
 
      {/* Page background — neutral-950, wraps everything below the header */}
      <div className="bg-neutral-950 p-8">
        {/* "Here's the list..." + Create Event — sits on the page bg, NOT inside the card */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-white text-lg font-medium">Here's the list of all your events.</p>
          <button
            className="flex items-center rounded-[10px]"
            style={{
              backgroundColor: "#EA580C",
              paddingTop: 10,
              paddingBottom: 10,
              paddingLeft: 16,
              paddingRight: 16,
              gap: 10,
            }}
          >
            <PlusIcon className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">Create Event</span>
          </button>
        </div>
 
        {/* Card — neutral-1000 / #111213 background, wraps search+filters+table+footer only */}
        <div className="rounded-2xl p-8" style={{ backgroundColor: "#111213" }}>
        {/* Search + filter row — ratios from Figma: search 797 / each dropdown 313.5, gap 16px */}
        <div className="flex items-center gap-4 mb-6">
          <Input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leadingIcon={<SearchRightIcon className="w-5 h-5 text-neutral-400" />}
            style={{ flexGrow: 797, flexShrink: 1, flexBasis: 0 }}
          />
          <select
            className="bg-neutral-925 text-sm text-white rounded-[10px] border border-neutral-925 px-3 py-2 appearance-none"
            style={{ flexGrow: 313.5, flexShrink: 1, flexBasis: 0 }}
          >
            <option>All Categories</option>
          </select>
          <select
            className="bg-neutral-925 text-sm text-white rounded-[10px] border border-neutral-925 px-3 py-2 appearance-none"
            style={{ flexGrow: 313.5, flexShrink: 1, flexBasis: 0 }}
          >
            <option>All Status</option>
          </select>
        </div>
        {/* Note: native <select> can't take a trailingIcon like Input does — if you need the
            DropDownIcon chevron visible (not just the OS default arrow), these two need to become
            a custom listbox/popover styled like Input, not a plain <select>. Flag this if that's required. */}
 
        {/* Table */}
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-neutral-500 border-b border-neutral-800">
              <th className="py-3 font-medium">Event</th>
              <th className="py-3 font-medium">Date</th>
              <th className="py-3 font-medium">Category</th>
              <th className="py-3 font-medium">Revenue</th>
              <th className="py-3 font-medium">Status</th>
              <th className="py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleEvents.map((event, index) => {
              const status = hardcodedStatus[index];
              const isPublished = status === "Published";
 
              return (
                <tr
                  key={index}
                  className="border-b border-neutral-900 hover:bg-neutral-900/50 transition-colors"
                >
                  <td className="py-4 flex items-center gap-3">
                    <img
                      src={eventImages[index]}
                      alt={event.eventTitle}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-white font-medium">{event.eventTitle}</p>
                      <p className="text-neutral-500 text-xs">{event.venue}</p>
                    </div>
                  </td>
                  <td className="py-4 text-neutral-300">
                    {event.startDate} {event.startTime}
                  </td>
                  <td className="py-4">
                    <Pill
                      label={event.eventCategory}
                      color={categoryColors[event.eventCategory] ?? "#6B7280"}
                    />
                  </td>
                  <td className="py-4 text-neutral-300">{hardcodedRevenue}</td>
                  <td className="py-4">
                    <Pill label={status} color={statusColors[status]} />
                  </td>
                  <td className="py-4">
                    {/* Actions row — fixed 164x60, horizontal, gap 10 */}
                    <div
                      className="flex items-center"
                      style={{ width: 164, height: 60, gap: 10 }}
                    >
                      <button aria-label="View event">
                        <ViewIcon className="w-4 h-4 text-neutral-400 hover:text-white" />
                      </button>
                      <button aria-label="Edit event">
                        <Edit02Icon className="w-4 h-4 text-neutral-400 hover:text-white" />
                      </button>
                      <button aria-label="Publish/unpublish event">
                        <ToggleOnIcon
                          className="w-4 h-4"
                          style={{ color: isPublished ? "#0F973D" : "#6B7280" }}
                        />
                      </button>
                      <button aria-label="Delete event">
                        <Delete02Icon className="w-4 h-4" style={{ color: "#EA580C" }} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
 
        {/* Footer / pagination */}
        <div className="flex items-center justify-between mt-4 text-xs text-neutral-500">
          <span>Page 1 of 1</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-md bg-neutral-900 border border-neutral-800">
              Prev
            </button>
            <button className="px-3 py-1 rounded-md bg-purple-500/24 border-purple-500 text-purple-500">
              1
            </button>
            <button className="px-3 py-1 rounded-md bg-neutral-900 border border-neutral-800">
              Next
            </button>
          </div>
          <span>Page Size: 10</span>
        </div>
        </div>
      </div>
    </>
  );
}
 