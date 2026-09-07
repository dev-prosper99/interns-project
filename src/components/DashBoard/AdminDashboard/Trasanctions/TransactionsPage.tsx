import { useMemo, useState } from "react";
import {
  type Transaction,
  type TransactionStatus,
  SAMPLE_TRANSACTIONS,
  formatNaira,
} from "./transactions.data";
import { TransactionsTable } from "./TransactionsTable";
import {Pagination} from "@/components/ui/paginition";
import {
  TransactionDetailsModal,
  RefundConfirmModal,
} from "./TransactionsModals";
import Sidebar from "@/components/layouts/Sidebar";
import TransactionHeader from "./TransctionHeader";
 
const STATUS_OPTIONS: Array<TransactionStatus | "All"> = [
  "All",
  "Completed",
  "Pending",
  "Refunded",
  "Failed",
];
 
export interface TransactionsPageProps {
  transactions?: Transaction[];
  onRefund?: (transaction: Transaction) => void | Promise<void>;
  onExport?: () => void;
  pageSize?: number;
}
 
export default function TransactionsPage({
  transactions = SAMPLE_TRANSACTIONS,
  onRefund,
  onExport,
  pageSize = 8,
}: TransactionsPageProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "All">(
    "All",
  );
  const [detailsTxn, setDetailsTxn] = useState<Transaction | null>(null);
  const [refundTxn, setRefundTxn] = useState<Transaction | null>(null);
  const [isRefunding, setIsRefunding] = useState(false);
  const [localTransactions, setLocalTransactions] = useState(transactions);
 
  const filtered = useMemo(() => {
    return localTransactions.filter((t) => {
      const matchesQuery =
        query.trim().length === 0 ||
        t.id.toLowerCase().includes(query.toLowerCase()) ||
        t.buyer.toLowerCase().includes(query.toLowerCase()) ||
        t.event.toLowerCase().includes(query.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || t.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [localTransactions, query, statusFilter]);
 
  const revenueTotal = localTransactions
    .filter((t) => t.status === "Completed")
    .reduce((sum, t) => sum + t.amount, 0);
  const refundedTotal = localTransactions
    .filter((t) => t.status === "Refunded")
    .reduce((sum, t) => sum + t.amount, 0);
 
  function requestRefund(t: Transaction) {
    setDetailsTxn(null);
    setRefundTxn(t);
  }
 
  async function confirmRefund() {
    if (!refundTxn) return;
    setIsRefunding(true);
    try {
      await onRefund?.(refundTxn);
      setLocalTransactions((prev) =>
        prev.map((t) =>
          t.id === refundTxn.id ? { ...t, status: "Refunded" } : t,
        ),
      );
      setRefundTxn(null);
    } finally {
      setIsRefunding(false);
    }
  }
 
  return (
    <div className="flex min-h-screen bg-neutral-950">
      <Sidebar />
 
      <main className="min-w-0 flex-1">
        <TransactionHeader />
 
        <div className="px-6 py-6 text-neutral-50">
          <div className="mb-5 flex items-center justify-between">
            <h1 className="text-lg font-semibold">
              Overview of your transactions
            </h1>
            <button
              type="button"
              onClick={onExport}
              className="rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600"
            >
              Export
            </button>
          </div>
 
          <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-neutral-400">
                <span className="h-2 w-2 rounded-full bg-violet-500" />
                Revenue
              </div>
              <div className="text-xl font-semibold text-neutral-50">
                {formatNaira(revenueTotal)}
              </div>
            </div>
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-neutral-400">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                Refunded
              </div>
              <div className="text-xl font-semibold text-rose-400">
                {formatNaira(refundedTotal)}
              </div>
            </div>
          </div>
 
          <div className="mb-4 flex flex-wrap gap-3">
            <div className="flex min-w-55 flex-1 items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-400">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="7"
                  cy="7"
                  r="5.25"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <path
                  d="M11 11L14 14"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by buyer or transaction id..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-neutral-50 placeholder:text-neutral-500 focus:outline-none"
              />
            </div>
            <select
              className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-50 focus:outline-none"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as TransactionStatus | "All")
              }
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s === "All" ? "All Status" : s}
                </option>
              ))}
            </select>
          </div>
 
          <Pagination items={filtered} initialPageSize={pageSize}>
            {(paginated) => (
              <TransactionsTable
                transactions={paginated}
                onViewDetails={setDetailsTxn}
              />
            )}
          </Pagination>
 
          {detailsTxn && (
            <TransactionDetailsModal
              transaction={detailsTxn}
              onClose={() => setDetailsTxn(null)}
              onRefund={requestRefund}
            />
          )}
 
          {refundTxn && (
            <RefundConfirmModal
              isSubmitting={isRefunding}
              onCancel={() => setRefundTxn(null)}
              onConfirm={confirmRefund}
            />
          )}
        </div>
      </main>
    </div>
  );
}
 