"use client";

import { useEffect, useState } from "react";
import RevenueChart from "@/components/DashBoard/AdminDashboard/Sections/RevenueChart";
import { Button } from "@/components/ui/button";
import CategoryChart from "@/components/DashBoard/AdminDashboard/Sections/CategoryChart";
import { AttendeeIcon, RevenueIcon, TicketIcon, ExportIcon, CalenderIcon } from "@/assets/icons";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import TopEvent from "@/components/DashBoard/AdminDashboard/AdminDashboardPages/Analytics/TopEvent";
import Loader from "@/components/layouts/Loader";

const RANGE_LABELS: Record<string, string> = {
      "7": "Last 7 Days",
      "30": "Last 30 Days",
      "90": "Last 90 Days",
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
      totalAttendees?: number;
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
      const [previousPerEvent, setPreviousPerEvent] = useState<EventAnalytics[]>([]);

      useEffect(() => {
            let cancelled = false;

            async function load() {
                  setLoading(true);
                  setError(null);
                  try {
                        const { dateFrom, dateTo } = rangeToDates(range);
                        const previousDateFrom = new Date(dateFrom);
                        const previousDateTo = new Date(dateTo);
                        previousDateFrom.setFullYear(previousDateFrom.getFullYear() - 1);
                        previousDateTo.setFullYear(previousDateTo.getFullYear() - 1);
                        const currentParams = new URLSearchParams({ dateFrom, dateTo });
                        const previousParams = new URLSearchParams({ dateFrom: previousDateFrom.toISOString(), dateTo: previousDateTo.toISOString() });
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
                              events.map(async (event) => {
                                    const headers = { Authorization: `Bearer ${getToken()}` };
                                    const [currentResponse, previousResponse] = await Promise.all([
                                          fetch(`${Api_Base}/api/Analytics/events/${encodeURIComponent(event.id)}?${currentParams}`, { headers }),
                                          fetch(`${Api_Base}/api/Analytics/events/${encodeURIComponent(event.id)}?${previousParams}`, { headers }),
                                    ]);

                                    if (!currentResponse.ok || !previousResponse.ok) {
                                          throw new Error(`Analytics fetch failed for ${event.title}`);
                                    }

                                    const [currentJson, previousJson]: [ApiEnvelope<EventAnalytics>, ApiEnvelope<EventAnalytics>] = await Promise.all([
                                          currentResponse.json(),
                                          previousResponse.json(),
                                    ]);
                                    if (!currentJson.success || !previousJson.success) {
                                          throw new Error(`Analytics data unavailable for ${event.title}`);
                                    }

                                    return {
                                          current: {
                                                ...currentJson.data,
                                                totalAttendees: currentJson.data.totalAttendees ?? currentJson.data.totalTicketsSold,
                                          },
                                          previous: {
                                                ...previousJson.data,
                                                totalAttendees: previousJson.data.totalAttendees ?? previousJson.data.totalTicketsSold,
                                          },
                                    };
                              }),
                        );

                        if (!cancelled) {
                              setPerEvent(results.map((result) => result.current));
                              setPreviousPerEvent(results.map((result) => result.previous));
                        }
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
                  attendees: acc.attendees + (e.totalAttendees ?? e.totalTicketsSold),
            }),
            { sold: 0, revenue: 0, remaining: 0, attendees: 0 },
      );
      const previousTotals = previousPerEvent.reduce(
            (acc, event) => ({
                  sold: acc.sold + event.totalTicketsSold,
                  revenue: acc.revenue + event.totalRevenue,
                  attendees: acc.attendees + (event.totalAttendees ?? event.totalTicketsSold),
            }),
            { sold: 0, revenue: 0, attendees: 0 },
      );

      const percentageChange = (current: number, previous: number): number | null =>
            previous > 0 ? Math.round(((current - previous) / previous) * 100) : current > 0 ? null : 0;

      const liveStats = [
            {
                  title: "Total Revenue",
                  value: `₦${totals.revenue.toLocaleString("en-NG")}`,
                  change: percentageChange(totals.revenue, previousTotals.revenue),
                  icon: RevenueIcon,
                  iconBg: "bg-purple-500/24",
                  iconColor: "text-purple-400",
            },
            {
                  title: "Tickets Sold",
                  value: totals.sold.toLocaleString("en-NG"),
                  change: percentageChange(totals.sold, previousTotals.sold),
                  icon: TicketIcon,
                  iconBg: "bg-orange-500/24",
                  iconColor: "text-orange-500",
            },
            {
                  title: "Average Ticket Price",
                  value: `₦${Math.round(totals.sold > 0 ? totals.revenue / totals.sold : 0).toLocaleString("en-NG")}`,
                  change: percentageChange(
                        totals.sold > 0 ? totals.revenue / totals.sold : 0,
                        previousTotals.sold > 0 ? previousTotals.revenue / previousTotals.sold : 0,
                  ),
                  icon: TicketIcon,
                  iconBg: "bg-orange-500/24",
                  iconColor: "text-orange-500",
            },
            {
                  title: "Total Attendees",
                  value: totals.attendees.toLocaleString("en-NG"),
                  change: percentageChange(totals.attendees, previousTotals.attendees),
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
            <div className="min-w-0 bg-neutral-950">
                  <main className="min-w-0">
                        <div className="flex flex-col items-start gap-3 px-4 py-6 md:flex-row md:items-center md:justify-between md:px-5">
                              <p className="text-base font-medium text-white">Insights across all your events</p>

                              <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
                                    <Select value={range} onValueChange={(value) => setRange(value as string)}>
                                          <SelectTrigger
                                                className="h-8! w-32 shrink-0 gap-1 rounded-lg border border-neutral-800 bg-neutral-900 px-2
                text-xs text-neutral-300
                hover:border-neutral-600 focus:ring-1 focus:ring-purple-500
                focus:ring-offset-0 data-[state=open]:border-purple-500"
                                          >
                                                <CalenderIcon className="h-3 w-3 text-neutral-400" />
                                                <span className="min-w-0 flex-1 truncate text-left">{RANGE_LABELS[range]}</span>
                                          </SelectTrigger>

                                          <SelectContent className="bg-neutral-800 border border-neutral-700 text-neutral-200">
                                                <SelectItem value="7" className="focus:bg-neutral-700 focus:text-white">
                                                      Last 7 Days
                                                </SelectItem>
                                                <SelectItem value="30" className="focus:bg-neutral-700 focus:text-white">
                                                      Last 30 Days
                                                </SelectItem>
                                                <SelectItem value="90" className="focus:bg-neutral-700 focus:text-white">
                                                      Last 90 Days
                                                </SelectItem>
                                          </SelectContent>
                                    </Select>

                                    <Button
                                          variant="primary"
                                          onClick={handleExport}
                                          disabled={!!error}
                                          className="h-8 w-28 shrink-0 flex items-center gap-2 text-xs text-white"
                                    >
                                          <ExportIcon className="h-4 w-4" />
                                          Export
                                    </Button>
                              </div>
                        </div>

                        {error && <div className="mx-4 mb-4 rounded-lg border border-red-800 bg-red-950/50 p-3 text-sm text-red-300 md:mx-6">{error}</div>}

                        <div className="grid grid-cols-1 gap-4 px-4 pb-4 md:grid-cols-2 md:px-5 xl:grid-cols-4">
                              {liveStats.map(({ title, value, change, icon: Icon, iconBg, iconColor }) => (
                                    <article key={title} className="min-h-36 rounded-lg bg-neutral-1000 p-4">
                                          <div className="flex items-center gap-2">
                                                <span className={`flex h-5 w-5 items-center justify-center rounded ${iconBg}`}>
                                                      <Icon className={`h-3 w-3 ${iconColor}`} />
                                                </span>
                                                <h2 className="text-xs font-medium text-neutral-200">{title}</h2>
                                          </div>
                                          <p className="mt-5 text-[28px] font-medium leading-8 text-white">{value}</p>
                                          <div className="mt-1 flex items-center gap-1 text-[11px]">
                                                {change === null ? (
                                                      <span className="font-medium text-green-500">New</span>
                                                ) : change > 0 ? (
                                                      <>
                                                            <span className="font-medium text-green-500">{change}%</span>
                                                            <ArrowUp aria-hidden="true" className="h-3 w-3 text-green-500" />
                                                      </>
                                                ) : change < 0 ? (
                                                      <>
                                                            <span className="font-medium text-red-500">{Math.abs(change)}%</span>
                                                            <ArrowDown aria-hidden="true" className="h-3 w-3 text-red-500" />
                                                      </>
                                                ) : (
                                                      <span className="font-medium text-neutral-400">0%</span>
                                                )}
                                                <span className="text-neutral-500">from last year</span>
                                          </div>
                                    </article>
                              ))}
                        </div>

                        <div className="p-4">
                              <RevenueChart />
                        </div>

                        <div className="p-4">
                              <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[minmax(0,55fr)_minmax(0,45fr)]">
                                    <TopEvent />
                                    <CategoryChart />
                              </div>
                        </div>
                  </main>
            </div>
      );
}
