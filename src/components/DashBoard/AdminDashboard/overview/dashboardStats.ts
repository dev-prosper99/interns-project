"use client";
 
import { useEffect, useState } from "react";
import {
  AttendeeIcon,
  EventIcon,
  RevenueIcon,
  TicketIcon,
} from "@/assets/icons";
import type { DashboardStat } from "./DashboardStatCard";
 
const API_BASE_URL =

  "https://peacemaker001-001-site1.ltempurl.com";
 
interface EventListItem {
  id: string;
  title: string;
  eventDate: string;
  status: string;
}
 
interface EventsApiResponse {
  success: boolean;
  data: {
    items: EventListItem[];
    totalCount: number;
  };
}
 
interface EventAnalytics {
  eventId: string;
  title: string;
  totalTicketsSold: number;
  totalRevenue: number;
  totalRemaining: number;
  byTicketType: {
    ticketTypeId: string;
    name: string;
    soldCount: number;
    totalQuantity: number;
    remaining: number;
    revenue: number;
  }[];
}
 
interface AnalyticsApiResponse {
  success: boolean;
  data: EventAnalytics;
}
 
interface AggregatedStats {
  activeEvents: number;
  totalRevenue: number;
  totalTicketsSold: number;
  totalAttendees: number;
}
 
// Adjust if your backend's "active" status uses a different string
const ACTIVE_STATUS = "Published";
 
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token"); // adjust key if different
  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
 
async function fetchMyEvents(userId: string): Promise<EventListItem[]> {
  const params = new URLSearchParams({ page: "1", pageSize: "100" });
 
  const res = await fetch(
    `${API_BASE_URL}/api/Events/my-events/${userId}?${params.toString()}`,
    { headers: getAuthHeaders() }
  );
 
  if (!res.ok) {
    console.error("fetchMyEvents failed:", res.status, await res.text());
    return [];
  }
 
  const json: EventsApiResponse = await res.json();
  if (!json.success) {
    console.error("fetchMyEvents success:false", json);
    return [];
  }
 
  return json.data.items;
}
 
async function fetchEventAnalytics(
  eventId: string
): Promise<EventAnalytics | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/Analytics/events/${eventId}`, {
      headers: getAuthHeaders(),
    });
 
    if (!res.ok) {
      console.error(
        `fetchEventAnalytics(${eventId}) failed:`,
        res.status,
        await res.text()
      );
      return null;
    }
 
    const json: AnalyticsApiResponse = await res.json();
    if (!json.success) return null;
 
    return json.data;
  } catch (err) {
    console.error(`fetchEventAnalytics(${eventId}) threw`, err);
    return null;
  }
}
 
async function getAggregatedStats(): Promise<AggregatedStats | null> {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    console.warn("getAggregatedStats: no userId in localStorage");
    return null;
  }
 
  const events = await fetchMyEvents(userId);
  if (events.length === 0) {
    return {
      activeEvents: 0,
      totalRevenue: 0,
      totalTicketsSold: 0,
      totalAttendees: 0,
    };
  }
 
  const now = new Date();
  const activeEvents = events.filter(
    (e) => e.status === ACTIVE_STATUS && new Date(e.eventDate) >= now
  ).length;
 
  // Fetch analytics for every event in parallel and sum results
  const analyticsResults = await Promise.all(
    events.map((e) => fetchEventAnalytics(e.id))
  );
 
  let totalRevenue = 0;
  let totalTicketsSold = 0;
 
  for (const a of analyticsResults) {
    if (!a) continue;
    totalRevenue += a.totalRevenue;
    totalTicketsSold += a.totalTicketsSold;
  }
 
  return {
    activeEvents,
    totalRevenue,
    totalTicketsSold,
    totalAttendees: totalTicketsSold, // 1 sold ticket ≈ 1 attendee — adjust if wrong
  };
}
 
function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}
 
export function useDashboardStats(): DashboardStat[] {
  const [stats, setStats] = useState<AggregatedStats | null>(null);
 
  useEffect(() => {
    getAggregatedStats().then(setStats);
  }, []);
 
  const loadingValue = "...";
 
  return [
    {
      title: "Total Revenue",
      value: stats ? formatNaira(stats.totalRevenue) : loadingValue,
      change: "30% ↑",
      trend: "up",
      icon: RevenueIcon,
      iconBg: "bg-purple-500/24",
      iconColor: "text-purple-400",
    },
    {
      title: "Tickets Sold",
      value: stats ? String(stats.totalTicketsSold) : loadingValue,
      change: "5% ↓",
      trend: "down",
      icon: TicketIcon,
      iconBg: "bg-orange-500/24",
      iconColor: "text-orange-500",
    },
    {
      title: "Active Events",
      value: stats ? String(stats.activeEvents) : loadingValue,
      change: "3% ↑",
      trend: "up",
      icon: EventIcon,
      iconBg: "bg-green-500/24",
      iconColor: "text-green-400",
    },
    {
      title: "Total Attendees",
      value: stats ? stats.totalAttendees.toLocaleString() : loadingValue,
      change: "10% ↑",
      trend: "up",
      icon: AttendeeIcon,
      iconBg: "bg-yellow-500/24",
      iconColor: "text-yellow-400",
    },
  ];
}

 