import { useState } from "react";
import { X, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { notificationsApi, ApiError } from "@/lib/notificationsApi";

interface ResendTicketModalProps {
      isOpen: boolean;
      onClose: () => void;
      orderId: string;
      eventTitle?: string;
      recipientEmail?: string;
}

export default function ResendTicketModal({ isOpen, onClose, orderId: initialOrderId, eventTitle, recipientEmail }: ResendTicketModalProps) {
      const [orderId, setOrderId] = useState(initialOrderId);
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

      if (!isOpen) return null;

      const handleResend = async () => {
            const trimmedId = orderId.trim();
            if (!trimmedId) {
                  setStatus({ type: "error", message: "Please enter a valid Order ID." });
                  return;
            }

            setIsSubmitting(true);
            setStatus(null);
            try {
                  const response = await notificationsApi.resendOrderConfirmation(trimmedId);
                  setStatus({
                        type: "success",
                        message: response.message || "Your ticket confirmation email and QR codes have been resent!",
                  });
            } catch (err: unknown) {
                  const is404 = (err instanceof ApiError && err.status === 404) || (err instanceof Error && err.message.includes("404"));

                  setStatus({
                        type: "error",
                        message: is404
                              ? `Order "${trimmedId}" was not found in the database. Enter a valid Order ID created via checkout.`
                              : err instanceof Error
                                ? err.message
                                : "Failed to resend confirmation email.",
                  });
            } finally {
                  setIsSubmitting(false);
            }
      };

      return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 font-poppins" onClick={onClose}>
                  <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-1000 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/15 text-purple-400">
                                          <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                          <h3 className="text-base font-semibold text-white font-jakarta">Resend Tickets</h3>
                                          <p className="text-xs text-neutral-400">Email ticket & QR pass</p>
                                    </div>
                              </div>
                              <button type="button" onClick={onClose} className="p-1 rounded-lg text-neutral-400 hover:text-white">
                                    <X className="w-5 h-5" />
                              </button>
                        </div>

                        <p className="text-xs text-neutral-300 mb-4 leading-relaxed">
                              Lost your confirmation email? Enter your order reference to resend ticket codes and QR access passes to{" "}
                              <span className="text-white font-medium">{recipientEmail || "your registered email"}</span>.
                        </p>

                        {eventTitle && (
                              <div className="mb-4 rounded-xl bg-neutral-900 border border-neutral-800 p-3 text-xs text-neutral-300">
                                    Event: <span className="text-white font-medium">{eventTitle}</span>
                              </div>
                        )}

                        <div className="mb-4">
                              <Input
                                    label="Order ID / Reference"
                                    placeholder="e.g. ORD-1234 or GUID"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                              />
                        </div>

                        {status && (
                              <div
                                    className={`mb-4 flex items-start gap-2.5 rounded-xl p-3 text-xs ${
                                          status.type === "success"
                                                ? "bg-green-950/30 border border-green-800/40 text-green-400"
                                                : "bg-red-950/30 border border-red-800/40 text-red-400"
                                    }`}
                              >
                                    {status.type === "success" ? (
                                          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                                    ) : (
                                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    )}
                                    <p className="leading-relaxed">{status.message}</p>
                              </div>
                        )}

                        <div className="mt-6 flex items-center justify-end gap-3">
                              <Button variant="neutral" size="sm" onClick={onClose} disabled={isSubmitting}>
                                    Cancel
                              </Button>
                              <Button variant="yellow" size="sm" onClick={handleResend} disabled={isSubmitting || !orderId.trim()}>
                                    {isSubmitting ? "Sending..." : "Resend Email"}
                              </Button>
                        </div>
                  </div>
            </div>
      );
}
