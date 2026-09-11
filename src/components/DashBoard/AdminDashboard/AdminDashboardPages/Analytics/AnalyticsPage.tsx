"use client";

import { useEffect, useState } from "react";
import ResponsiveAdminSidebar from "@/components/layouts/ResponsiveAdminSidebar";
import StatsCard from "@/components/DashBoard/AdminDashboard/overview/DashboardStatCard";
import RevenueChart from "@/components/DashBoard/AdminDashboard/Sections/RevenueChart";
import { Button } from "@/components/ui/button";
import CategoryChart from "@/components/DashBoard/AdminDashboard/Sections/CategoryChart";
import { AttendeeIcon, EventIcon, RevenueIcon, TicketIcon, ExportIcon, CalenderIcon } from "@/assets/icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AnalyticsHeader from "@/components/DashBoard/AdminDashboard/AdminDashboardPages/Analytics/AnalyticsHeader";
import TopEvent from "@/components/DashBoard/AdminDashboard/AdminDashboardPages/Analytics/TopEvent";
import Loader from "@/components/layouts/loader";

const RANGE_LABELS: Record<string, string> = {
      "7": "Last 7 days",
      "30": "Last 30 days",
      "90": "Last 90 days",
};

const Api_Base = "https://peacemaker001-001-site1.ltempurl.com";
function getToken() {
      return typeof window !== "undefined" ? (localStorage.getItem("token") ?? "") : "";
}

type EventSummary = { id: string; title: string };

type EventAnalytics = {
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
};

type ApiEnvelope<T> = {
      status: number;
      success: boolean;
      message: string;
      errors: string[];
      data: T;
};

function rangeToDates(rangeDays: string) {
      const dateTo = new Date();
      const dateFrom = new Date();
      dateFrom.setDate(dateFrom.getDate() - Number(rangeDays));
      return { dateFrom: dateFrom.toISOString(), dateTo: dateTo.toISOString() };
}

export default function Analytics() {
      const [range, setRange] = useState<string>("30");
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);
      const [perEvent, setPerEvent] = useState<EventAnalytics[]>([]);
      const [isSidebarOpen, setIsSidebarOpen] = useState(false);

      useEffect(() => {
            let cancelled = false;

            async function load() {
                  setLoading(true);
                  setError(null);
                  try {
                        const { dateFrom, dateTo } = rangeToDates(range);
                        const userId = localStorage.getItem("userId");

                        const eventsRes = await fetch(`${Api_Base}/api/Events/my-events/${userId}`, {
                              headers: { Authorization: `Bearer ${getToken()}` },
                        });
                        if (!eventsRes.ok) throw new Error(`Failed to load events: ${eventsRes.status}`);
                        const eventsJson: ApiEnvelope<{
                              items: EventSummary[];
                        }> = await eventsRes.json();

                        const events = eventsJson.data.items;

                        const results = await Promise.all(
                              events.map(async (e) => {
                                    const params = new URLSearchParams({ dateFrom, dateTo });
                                    const res = await fetch(`${Api_Base}/api/Analytics/events/${e.id}?${params}`, {
                                          headers: { Authorization: `Bearer ${getToken()}` },
                                    });
                                    if (!res.ok) {
                                          const errorBody = await res.text();
                                          console.error("Analytics Error Response:", errorBody);

                                          throw new Error(`Analytics fetch failed for ${e.id}: ${res.status}`);
                                    }
                                    const json: ApiEnvelope<EventAnalytics> = await res.json();
                                    return json.data;
                              }),
                        );

                        if (!cancelled) setPerEvent(results);
                  } catch (err) {
                        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load analytics");
                  } finally {
                        if (!cancelled) setLoading(false);
                  }
            }

            load();
            return () => {
                  cancelled = true;
            };
      }, [range]);

      const totals = perEvent.reduce(
            (acc, e) => ({
                  sold: acc.sold + e.totalTicketsSold,
                  revenue: acc.revenue + e.totalRevenue,
                  remaining: acc.remaining + e.totalRemaining,
            }),
            { sold: 0, revenue: 0, remaining: 0 },
      );

      const liveStats = [
            {
                  title: "Tickets Sold",
                  value: totals.sold.toString(),
                  change: "0%",
                  trend: "up" as const,
                  icon: TicketIcon,
                  iconBg: "bg-orange-500/24",
                  iconColor: "text-orange-500",
            },
            {
                  title: "Total Revenue",
                  value: `₦${totals.revenue.toLocaleString()}`,
                  change: "0%",
                  trend: "up" as const,
                  icon: RevenueIcon,
                  iconBg: "bg-purple-500/24",
                  iconColor: "text-purple-400",
            },
            {
                  title: "Active Events",
                  value: perEvent.length.toString(),
                  change: "0%",
                  trend: "up" as const,
                  icon: EventIcon,
                  iconBg: "bg-green-500/24",
                  iconColor: "text-green-400",
            },
            {
                  title: "Total Attendees",
                  value: totals.sold.toString(),
                  change: "0%",
                  trend: "up" as const,
                  icon: AttendeeIcon,
                  iconBg: "bg-yellow-500/24",
                  iconColor: "text-yellow-400",
            },
      ];

      if (loading) return <Loader />;

      function handleExport() {
            const rows = [["Metric", "Value", "Range"], ...liveStats.map((stat) => [stat.title, String(stat.value ?? ""), RANGE_LABELS[range]])];
            const csvContent = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `analytics-${range}days-${new Date().toISOString().slice(0, 10)}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
      }

      return (
            <div className="flex min-h-screen bg-neutral-950">
                  <ResponsiveAdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                  <main className="min-w-0 flex-1">
                        <AnalyticsHeader onMenuClick={() => setIsSidebarOpen(true)} />

                        <div className="flex flex-col items-start gap-4 p-4 md:flex-row md:items-center md:justify-between md:p-6">
                              <p className="text-xl font-medium text-white md:text-2xl">Insights across all your events</p>

                              <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
                                    <Select value={range} onValueChange={(value) => setRange(value as string)}>
                                          <SelectTrigger
                                                className="w-44 h-10 rounded-lg bg-neutral-800 border border-neutral-700
                text-neutral-200 text-sm px-3 gap-2
                hover:border-neutral-600 focus:ring-1 focus:ring-purple-500
                focus:ring-offset-0 data-[state=open]:border-purple-500"
                                          >
                                                <CalenderIcon className="h-4 w-4 text-neutral-400" />
                                                <SelectValue />
                                          </SelectTrigger>

                                          <SelectContent className="bg-neutral-800 border border-neutral-700 text-neutral-200">
                                                <SelectItem value="7" className="focus:bg-neutral-700 focus:text-white">
                                                      Last 7 days
                                                </SelectItem>
                                                <SelectItem value="30" className="focus:bg-neutral-700 focus:text-white">
                                                      Last 30 days
                                                </SelectItem>
                                                <SelectItem value="90" className="focus:bg-neutral-700 focus:text-white">
                                                      Last 90 days
                                                </SelectItem>
                                          </SelectContent>
                                    </Select>

                                    <Button variant="primary" onClick={handleExport} disabled={!!error} className="flex items-center gap-2 text-white h-10">
                                          <ExportIcon className="h-4 w-4" />
                                          Export
                                    </Button>
                              </div>
                        </div>

                        {error && <div className="mx-4 mb-4 rounded-lg border border-red-800 bg-red-950/50 p-3 text-sm text-red-300 md:mx-6">{error}</div>}

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-6">
                              {liveStats.map((stat) => (
                                    <StatsCard key={stat.title} stat={stat} />
                              ))}
                        </div>

                        <div className="p-4">
                              <RevenueChart />
                        </div>

                        <div className="p-4">
                              <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
                                    <TopEvent />
                                    <CategoryChart />
                              </div>
                        </div>
                  </main>
            </div>
      );
}
