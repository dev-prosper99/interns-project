import React from "react";
import  {  type Transaction, formatDate, formatNaira } from "./transactions.data";
import  { StatusBadge } from "./TransactionsTable";

interface TransactionDetailsModalProps {
  transaction: Transaction;
  onClose: () => void;
  onRefund: (transaction: Transaction) => void;
}

export function TransactionDetailsModal({ transaction, onClose, onRefund }: TransactionDetailsModalProps) {
  const fields: Array<[string, React.ReactNode]> = [
    ["Transaction ID", transaction.id],
    ["Buyer", transaction.buyer],
    ["Event", transaction.event || "—"],
    ["Tickets", transaction.tickets],
    ["Amount", formatNaira(transaction.amount)],
    ["Date", formatDate(transaction.date)],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl border border-neutral-900 bg-neutral-900 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-neutral-50">Transaction Details</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-xl leading-none text-neutral-400 hover:text-neutral-50"
          >
            ×
          </button>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-4">
          {fields.map(([label, value]) => (
            <div key={label}>
              <div className="mb-1 text-xs text-neutral-400">{label}</div>
              <div className="text-sm font-medium text-neutral-50">{value}</div>
            </div>
          ))}
          <div>
            <div className="mb-1 text-xs text-neutral-400">Status</div>
            <StatusBadge status={transaction.status} />
          </div>
        </div>

        {transaction.status === "Completed" && (
          <button
            type="button"
            onClick={() => onRefund(transaction)}
            className="w-full rounded-lg bg-rose-500 py-2.5 text-sm font-medium text-white hover:bg-rose-600"
          >
            Refund
          </button>
        )}
      </div>
    </div>
  );
}

interface RefundConfirmModalProps {
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function RefundConfirmModal({ isSubmitting, onCancel, onConfirm }: RefundConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={() => !isSubmitting && onCancel()}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-rose-500/15 text-lg font-bold text-rose-400">
          !
        </div>
        <h2 className="mb-2 text-base font-semibold text-neutral-50">Refund Attendee?</h2>
        <p className="mb-5 text-sm text-neutral-400">Are you sure you want to do this action?</p>
        <div className="flex gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onCancel}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-800 py-2.5 text-sm font-medium text-neutral-50 hover:bg-neutral-700 disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className="w-full rounded-lg bg-rose-500 py-2.5 text-sm font-medium text-white hover:bg-rose-600 disabled:opacity-40"
          >
            {isSubmitting ? "Refunding…" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
