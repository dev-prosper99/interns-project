import {
  AttendeeIcon,
  EventIcon,
  RevenueIcon,
  TicketIcon,
} from "@/assets/icons";

import type { DashboardStat } from "./DashboardStatCard";

export const dashboardStats: DashboardStat[] = [
  {
    title: "Total Revenue",
    value: "₦4,820,000",
    change: "30% ↑",
    trend: "up",
    icon: RevenueIcon,
    iconBg: "bg-purple-500/24",
    iconColor: "text-purple-400",
  },
  {
    title: "Tickets Sold",
    value: "10",
    change: "5% ↓",
    trend: "down",
    icon: TicketIcon,
    iconBg: "bg-orange-500/24",
    iconColor: "text-orange-500",
  },
  {
    title: "Active Events",
    value: "2",
    change: "3% ↑",
    trend: "up",
    icon: EventIcon,
    iconBg: "bg-green-500/24",
    iconColor: "text-green-400",
  },
  {
    title: "Total Attendees",
    value: "1,000",
    change: "10% ↑",
    trend: "up",
    icon: AttendeeIcon,
    iconBg: "bg-yellow-500/24",
    iconColor: "text-yellow-400",
  },
];