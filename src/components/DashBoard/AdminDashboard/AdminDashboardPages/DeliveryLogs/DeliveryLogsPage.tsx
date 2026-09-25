import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Send, RefreshCw, Search, CheckCircle2, AlertTriangle, XCircle, Clock, Ticket, ShieldAlert, ArrowLeft } from "lucide-react";
import { notificationsApi, type DeliveryLog, ApiError } from "@/lib/notificationsApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/paginition";

export default function DeliveryLogsPage() {
      const navigate = useNavigate();
      const [logs, setLogs] = useState<DeliveryLog[]>([]);
      const [isLoading, setIsLoading] = useState(true);
      const [isForbidden, setIsForbidden] = useState(false);
      const [errorMessage, setErrorMessage] = useState<string | null>(null);

      const [search, setSearch] = useState("");
      const [channelFilter, setChannelFilter] = useState<string>("All");
      const [statusFilter, setStatusFilter] = useState<string>("All");

      const [testEmailModal, setTestEmailModal] = useState(false);
      const [testEmail, setTestEmail] = useState("");
      const [testSubject, setTestSubject] = useState("TixO System Test Email");
      const [isSendingTest, setIsSendingTest] = useState(false);
      const [testFeedback, setTestFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

      const [resendModal, setResendModal] = useState(false);
      const [resendOrderId, setResendOrderId] = useState("");
      const [isResending, setIsResending] = useState(false);
      const [resendFeedback, setResendFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

      const fetchLogs = useCallback(async (showLoading = true) => {
            if (showLoading) {
                  setIsLoading(true);
            }
            setErrorMessage(null);
            try {
                  const data = await notificationsApi.getDeliveryLogs();
                  setLogs(Array.isArray(data) ? data : []);
                  setIsForbidden(false);
            } catch (err: unknown) {
                  if (err instanceof ApiError && err.status === 403) {
                        setIsForbidden(true);
                  } else {
                        setErrorMessage(err instanceof Error ? err.message : "Failed to load delivery logs.");
                  }
                  setLogs([]);
            } finally {
                  setIsLoading(false);
            }
      }, []);

      useEffect(() => {
            let isMounted = true;

            const timer = window.setTimeout(() => {
                  if (!isMounted) return;
                  void fetchLogs(false);
            }, 0);

            return () => {
                  isMounted = false;
                  window.clearTimeout(timer);
            };
      }, [fetchLogs]);

      const handleSendTestEmail = async (e: React.FormEvent) => {
            e.preventDefault();
            if (!testEmail) return;
            setIsSendingTest(true);
            setTestFeedback(null);
            try {
                  const res = await notificationsApi.sendTestEmail({
                        email: testEmail.trim(),
                        subject: testSubject.trim(),
                  });
                  setTestFeedback({
                        type: "success",
                        message: res.message || `Test email dispatched to ${testEmail}`,
                  });
                  window.setTimeout(() => {
                        setTestEmailModal(false);
                        setTestFeedback(null);
                        void fetchLogs(true);
                  }, 2000);
            } catch (err: unknown) {
                  setTestFeedback({
                        type: "error",
                        message: err instanceof Error ? err.message : "Failed to send test email.",
                  });
            } finally {
                  setIsSendingTest(false);
            }
      };

      const handleResendOrderTicket = async (e: React.FormEvent) => {
            e.preventDefault();
            if (!resendOrderId) return;
            setIsResending(true);
            setResendFeedback(null);
            try {
                  const res = await notificationsApi.resendOrderConfirmation(resendOrderId.trim());
                  setResendFeedback({
                        type: "success",
                        message: res.message || `Order tickets resent for #${resendOrderId}`,
                  });
                  window.setTimeout(() => {
                        setResendModal(false);
                        setResendFeedback(null);
                        void fetchLogs(true);
                  }, 2000);
            } catch (err: unknown) {
                  setResendFeedback({
                        type: "error",
                        message: err instanceof Error ? err.message : "Failed to resend order tickets.",
                  });
            } finally {
                  setIsResending(false);
            }
      };

      const filteredLogs = useMemo(() => {
            return logs.filter((log) => {
                  const query = search.toLowerCase();
                  const matchesSearch =
                        !query ||
                        log.recipient?.toLowerCase().includes(query) ||
                        log.subject?.toLowerCase().includes(query) ||
                        log.id?.toLowerCase().includes(query);
                  const matchesChannel = channelFilter === "All" || log.channel?.toLowerCase() === channelFilter.toLowerCase();
                  const matchesStatus = statusFilter === "All" || log.status?.toLowerCase() === statusFilter.toLowerCase();
                  return matchesSearch && matchesChannel && matchesStatus;
            });
      }, [logs, search, channelFilter, statusFilter]);

      const stats = useMemo(() => {
            const total = logs.length;
            const delivered = logs.filter((l) => ["delivered", "sent"].includes((l.status || "").toLowerCase())).length;
            const failed = logs.filter((l) => (l.status || "").toLowerCase() === "failed").length;
            return { total, delivered, failed };
      }, [logs]);

      const renderStatusBadge = (status: string) => {
            const s = (status || "").toLowerCase();
            if (["delivered", "sent"].includes(s)) {
                  return (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
                        </span>
                  );
            }
            if (s === "failed") {
                  return (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-400 border border-rose-500/20">
                              <XCircle className="w-3.5 h-3.5" /> Failed
                        </span>
                  );
            }
            return (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs font-medium text-yellow-400 border border-yellow-500/20">
                        <Clock className="w-3.5 h-3.5" /> Pending
                  </span>
            );
      };

      return (
            <div className="min-w-0 bg-neutral-950 min-h-screen text-white font-poppins">
                  <main className="mx-auto w-full px-4 py-8 md:px-8">
                        {isForbidden ? (
                              <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-1000 p-8 text-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-400 mb-4">
                                          <ShieldAlert className="h-8 w-8" />
                                    </div>
                                    <h2 className="text-xl font-bold font-jakarta text-white mb-2">Admin Privilege Required</h2>
                                    <p className="text-sm text-neutral-400 max-w-md mb-6 leading-relaxed">
                                          The delivery ledger and email diagnostic tools are restricted to system administrator accounts. Your current profile
                                          does not have permission to view this resource.
                                    </p>
                                    <div className="flex items-center gap-3">
                                          <Button variant="neutral" size="lg" onClick={() => navigate("/dashboard/organizer")} className="gap-2">
                                                <ArrowLeft className="w-4 h-4" /> Return to Dashboard
                                          </Button>
                                    </div>
                              </div>
                        ) : (
                              <>
                                    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                          <div>
                                                <h2 className="text-xl font-bold font-jakarta text-white">System Delivery Ledger</h2>
                                                <p className="text-xs text-neutral-400 mt-1">
                                                      Browse outgoing email and SMS delivery records, run gateway diagnostic tests, or manually reissue tickets.
                                                </p>
                                          </div>

                                          <div className="flex sm:flex-nowrap flex-wrap  items-center gap-2.5">
                                                <Button
                                                      variant="outline"
                                                      size="sm"
                                                      onClick={() => setResendModal(true)}
                                                      className="gap-2 border-neutral-700 bg-neutral-900 text-neutral-200 hover:text-white"
                                                >
                                                      <Ticket className="w-4 h-4 text-orange-500" /> Resend Ticket
                                                </Button>
                                                <Button variant="secondary" size="sm" onClick={() => setTestEmailModal(true)} className="gap-2">
                                                      <Send className="w-4 h-4" /> Test Mail Gateway
                                                </Button>
                                                <button
                                                      type="button"
                                                      onClick={() => void fetchLogs(true)}
                                                      title="Refresh ledger"
                                                      className="p-2.5 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
                                                >
                                                      <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-purple-400" : ""}`} />
                                                </button>
                                          </div>
                                    </div>

                                    {errorMessage && (
                                          <div className="mb-6 flex items-center gap-3 rounded-xl p-4 text-sm bg-red-950/30 border border-red-800/40 text-red-400">
                                                <AlertTriangle className="w-5 h-5 shrink-0" />
                                                <p>{errorMessage}</p>
                                          </div>
                                    )}

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                          <div className="rounded-2xl border border-neutral-800 bg-neutral-1000 p-5">
                                                <p className="text-xs text-neutral-400 mb-1">Total Logs Dispatched</p>
                                                <p className="text-2xl font-bold text-white font-jakarta">{stats.total}</p>
                                          </div>
                                          <div className="rounded-2xl border border-neutral-800 bg-neutral-1000 p-5">
                                                <p className="text-xs text-neutral-400 mb-1">Successfully Delivered</p>
                                                <p className="text-2xl font-bold text-emerald-400 font-jakarta">{stats.delivered}</p>
                                          </div>
                                          <div className="rounded-2xl border border-neutral-800 bg-neutral-1000 p-5">
                                                <p className="text-xs text-neutral-400 mb-1">Failed Deliveries</p>
                                                <p className="text-2xl font-bold text-rose-400 font-jakarta">{stats.failed}</p>
                                          </div>
                                    </div>

                                    <div className="rounded-2xl border border-neutral-800 bg-neutral-1000 p-4 md:p-6 space-y-6">
                                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                                <div className="md:col-span-2">
                                                      <Input
                                                            type="text"
                                                            placeholder="Search by recipient or subject..."
                                                            value={search}
                                                            onChange={(e) => setSearch(e.target.value)}
                                                            leadingIcon={<Search className="w-4 h-4 text-neutral-400" />}
                                                      />
                                                </div>
                                                <select
                                                      value={channelFilter}
                                                      onChange={(e) => setChannelFilter(e.target.value)}
                                                      className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-300 outline-none focus:border-purple-500"
                                                >
                                                      <option value="All">All Channels</option>
                                                      <option value="Email">Email</option>
                                                      <option value="SMS">SMS</option>
                                                </select>
                                                <select
                                                      value={statusFilter}
                                                      onChange={(e) => setStatusFilter(e.target.value)}
                                                      className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-300 outline-none focus:border-purple-500"
                                                >
                                                      <option value="All">All Statuses</option>
                                                      <option value="Delivered">Delivered</option>
                                                      <option value="Sent">Sent</option>
                                                      <option value="Failed">Failed</option>
                                                      <option value="Pending">Pending</option>
                                                </select>
                                          </div>

                                          <Pagination items={filteredLogs} initialPageSize={10}>
                                                {(paginated) => (
                                                      <div className="w-full overflow-x-auto">
                                                            <table className="w-full min-w-175 text-left text-sm">
                                                                  <thead>
                                                                        <tr className="border-b border-neutral-800 text-xs text-neutral-400 uppercase tracking-wider font-semibold">
                                                                              <th className="py-3 px-4">Recipient</th>
                                                                              <th className="py-3 px-4">Subject</th>
                                                                              <th className="py-3 px-4">Channel</th>
                                                                              <th className="py-3 px-4">Status</th>
                                                                              <th className="py-3 px-4">Dispatched Date</th>
                                                                        </tr>
                                                                  </thead>
                                                                  <tbody className="divide-y divide-neutral-900">
                                                                        {paginated.length === 0 ? (
                                                                              <tr>
                                                                                    <td colSpan={5} className="py-12 text-center text-sm text-neutral-500">
                                                                                          {isLoading
                                                                                                ? "Loading logs..."
                                                                                                : "No delivery records found matching filters."}
                                                                                    </td>
                                                                              </tr>
                                                                        ) : (
                                                                              paginated.map((item) => (
                                                                                    <tr key={item.id} className="hover:bg-neutral-900/40 transition-colors">
                                                                                          <td className="py-3.5 px-4 font-medium text-white">
                                                                                                {item.recipient}
                                                                                          </td>
                                                                                          <td className="py-3.5 px-4 text-neutral-300 max-w-xs truncate">
                                                                                                {item.subject || "Order Confirmation / Notification"}
                                                                                          </td>
                                                                                          <td className="py-3.5 px-4">
                                                                                                <span className="rounded-lg bg-neutral-900 border border-neutral-800 px-2.5 py-1 text-xs text-neutral-300">
                                                                                                      {item.channel}
                                                                                                </span>
                                                                                          </td>
                                                                                          <td className="py-3.5 px-4">{renderStatusBadge(item.status)}</td>
                                                                                          <td className="py-3.5 px-4 text-xs text-neutral-400">
                                                                                                {new Date(item.sentAt).toLocaleString("en-GB", {
                                                                                                      day: "2-digit",
                                                                                                      month: "short",
                                                                                                      year: "numeric",
                                                                                                      hour: "2-digit",
                                                                                                      minute: "2-digit",
                                                                                                })}
                                                                                          </td>
                                                                                    </tr>
                                                                              ))
                                                                        )}
                                                                  </tbody>
                                                            </table>
                                                      </div>
                                                )}
                                          </Pagination>
                                    </div>
                              </>
                        )}
                  </main>

                  {testEmailModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setTestEmailModal(false)}>
                              <div
                                    className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-1000 p-6 shadow-2xl"
                                    onClick={(e) => e.stopPropagation()}
                              >
                                    <h3 className="text-lg font-semibold text-white font-jakarta mb-1">Send Test Email</h3>
                                    <p className="text-xs text-neutral-400 mb-5">Verify your connected SMTP or transactional email delivery server.</p>

                                    <form onSubmit={handleSendTestEmail} className="space-y-4">
                                          <Input
                                                label="Destination Email"
                                                type="email"
                                                required
                                                placeholder="developer@example.com"
                                                value={testEmail}
                                                onChange={(e) => setTestEmail(e.target.value)}
                                          />
                                          <Input
                                                label="Email Subject"
                                                type="text"
                                                placeholder="TixO Diagnostic Email"
                                                value={testSubject}
                                                onChange={(e) => setTestSubject(e.target.value)}
                                          />

                                          {testFeedback && (
                                                <div
                                                      className={`flex items-center gap-2 rounded-xl p-3 text-xs ${
                                                            testFeedback.type === "success"
                                                                  ? "bg-green-950/30 border border-green-800/40 text-green-400"
                                                                  : "bg-red-950/30 border border-red-800/40 text-red-400"
                                                      }`}
                                                >
                                                      {testFeedback.type === "success" ? (
                                                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                                                      ) : (
                                                            <AlertTriangle className="w-4 h-4 shrink-0" />
                                                      )}
                                                      <span>{testFeedback.message}</span>
                                                </div>
                                          )}

                                          <div className="flex justify-end gap-3 pt-3">
                                                <Button
                                                      type="button"
                                                      variant="neutral"
                                                      size="sm"
                                                      onClick={() => setTestEmailModal(false)}
                                                      disabled={isSendingTest}
                                                >
                                                      Cancel
                                                </Button>
                                                <Button type="submit" variant="yellow" size="sm" disabled={isSendingTest}>
                                                      {isSendingTest ? "Dispatched..." : "Send Test"}
                                                </Button>
                                          </div>
                                    </form>
                              </div>
                        </div>
                  )}

                  {resendModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setResendModal(false)}>
                              <div
                                    className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-1000 p-6 shadow-2xl"
                                    onClick={(e) => e.stopPropagation()}
                              >
                                    <h3 className="text-lg font-semibold text-white font-jakarta mb-1">Reissue Attendee Ticket</h3>
                                    <p className="text-xs text-neutral-400 mb-5">
                                          Enter the target order identification number to resend the confirmation email and QR ticket.
                                    </p>

                                    <form onSubmit={handleResendOrderTicket} className="space-y-4">
                                          <Input
                                                label="Order ID / Reference"
                                                type="text"
                                                required
                                                placeholder="e.g. ORD-9824-912"
                                                value={resendOrderId}
                                                onChange={(e) => setResendOrderId(e.target.value)}
                                          />

                                          {resendFeedback && (
                                                <div
                                                      className={`flex items-center gap-2 rounded-xl p-3 text-xs ${
                                                            resendFeedback.type === "success"
                                                                  ? "bg-green-950/30 border border-green-800/40 text-green-400"
                                                                  : "bg-red-950/30 border border-red-800/40 text-red-400"
                                                      }`}
                                                >
                                                      {resendFeedback.type === "success" ? (
                                                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                                                      ) : (
                                                            <AlertTriangle className="w-4 h-4 shrink-0" />
                                                      )}
                                                      <span>{resendFeedback.message}</span>
                                                </div>
                                          )}

                                          <div className="flex justify-end gap-3 pt-3">
                                                <Button type="button" variant="neutral" size="sm" onClick={() => setResendModal(false)} disabled={isResending}>
                                                      Cancel
                                                </Button>
                                                <Button type="submit" variant="yellow" size="sm" disabled={isResending}>
                                                      {isResending ? "Resending..." : "Resend Now"}
                                                </Button>
                                          </div>
                                    </form>
                              </div>
                        </div>
                  )}
            </div>
      );
}
