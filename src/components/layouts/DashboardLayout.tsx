import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { HeartIcon } from "lucide-react";
import { DashboardIcon, EventIcon, SettingsIcon, TicketIcon, AnalyticsIcon, TransactionIcon, AttendeeIcon } from "@/assets/icons";
import Sidebar, { type SidebarItem } from "./Sidebar";
import DashboardHeader from "@/components/DashBoard/AttendeeDashboard/DashboardHeader";

const attendeeItems: SidebarItem[] = [
      { label: "Dashboard", path: "/dashboard/attendee", icon: DashboardIcon },
      { label: "Discover Events", path: "/dashboard/attendee/events", icon: EventIcon },
      { label: "My Tickets", path: "/dashboard/attendee/tickets", icon: TicketIcon },
      { label: "Saved Events", path: "/dashboard/attendee/saved-events", icon: HeartIcon },
      { label: "Settings", path: "/dashboard/attendee/settings", icon: SettingsIcon },
];

const organizerItems: SidebarItem[] = [
      { label: "Dashboard", path: "/dashboard/organizer", icon: DashboardIcon },
      { label: "Events", path: "/dashboard/organizer/events", icon: EventIcon },
      { label: "Tickets", path: "/dashboard/organizer/tickets", icon: TicketIcon },
      { label: "Analytics", path: "/dashboard/organizer/analytics", icon: AnalyticsIcon },
      { label: "Transactions", path: "/dashboard/organizer/transactions", icon: TransactionIcon },
      { label: "Attendees", path: "/dashboard/organizer/attendees", icon: AttendeeIcon },
      { label: "Settings", path: "/dashboard/organizer/settings", icon: SettingsIcon },
];

const pageTitles: Record<string, string> = {
      "/dashboard/attendee": "Dashboard",
      "/dashboard/attendee/events": "Discover Events",
      "/dashboard/attendee/tickets": "My Tickets",
      "/dashboard/attendee/saved-events": "Saved Events",
      "/dashboard/attendee/settings": "Settings",
      "/dashboard/organizer": "Dashboard",
      "/dashboard/organizer/events": "Events",
      "/dashboard/organizer/tickets": "Tickets",
      "/dashboard/organizer/analytics": "Analytics",
      "/dashboard/organizer/transactions": "Transactions",
      "/dashboard/organizer/attendees": "Attendees",
      "/dashboard/organizer/settings": "Settings",
};

export default function DashboardLayout() {
      const location = useLocation();
      const [isSidebarOpen, setIsSidebarOpen] = useState(false);
      const isOrganizer = location.pathname.startsWith("/dashboard/organizer");
      const items = isOrganizer ? organizerItems : attendeeItems;
      const title =
            Object.entries(pageTitles)
                  .filter(([path]) => location.pathname === path || location.pathname.startsWith(`${path}/`))
                  .sort(([firstPath], [secondPath]) => secondPath.length - firstPath.length)[0]?.[1] || "Dashboard";

      return (
            <div className="flex min-h-screen min-w-0 bg-neutral-950">
                  <div className="hidden lg:block">
                        <Sidebar items={items} />
                  </div>

                  {isSidebarOpen && (
                        <>
                              <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
                              <div className="fixed inset-y-0 left-0 z-50 w-[min(21rem,88vw)] lg:hidden">
                                    <Sidebar items={items} onClose={() => setIsSidebarOpen(false)} />
                              </div>
                        </>
                  )}

                  <main className="min-w-0 flex-1">
                        <DashboardHeader title={title} onMenuClick={() => setIsSidebarOpen(true)} />
                        <Outlet />
                  </main>
            </div>
      );
}
