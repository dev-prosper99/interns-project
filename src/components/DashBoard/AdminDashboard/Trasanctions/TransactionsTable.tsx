import {
  type Transaction,
  type TransactionStatus,
  formatDate,
  formatNaira,
} from "./transactions.data";

const BADGE_STYLES: Record<TransactionStatus, string> = {
  Completed: "bg-emerald-500/15 text-emerald-400",
  Pending: "bg-yellow-500/15 text-yellow-400",
  Refunded: "bg-rose-500/15 text-rose-400",
  Failed: "bg-rose-500/15 text-rose-400",
};

export function StatusBadge({ status }: { status: TransactionStatus }) {
  return (
    <span
      className={`inline-block rounded-md px-2.5 py-1 text-xs font-medium ${BADGE_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

interface TransactionsTableProps {
  transactions: Transaction[];
  onViewDetails: (transaction: Transaction) => void;
}

export function TransactionsTable({
  transactions,
  onViewDetails,
}: TransactionsTableProps) {
  return (
    <div className="w-full min-w-0 overflow-x-auto rounded-xl border border-neutral-1000">
      <table className="w-full min-w-180 border-collapse text-sm">
        <thead>
          <tr>
            {[
              "Transaction ID",
              "Buyer",
              "Event",
              "Tickets",
              "Amount",
              "Date",
              "Status",
              "Action",
            ].map((h) => (
              <th
                key={h}
                className="whitespace-nowrap border-b border-neutral-800 px-4 py-3 text-left font-medium text-neutral-400"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 && (
            <tr>
              <td
                colSpan={8}
                className="px-4 py-8 text-center text-neutral-500"
              >
                No transactions match your search.
              </td>
            </tr>
          )}
          {transactions.map((t) => (
            <tr key={t.id} className="last:[&>td]:border-b-0 hover:bg-white/2">
              <td className="whitespace-nowrap border-b border-neutral-800 px-4 py-3 text-neutral-50">
                {t.id}
              </td>
              <td className="whitespace-nowrap border-b border-neutral-800 px-4 py-3 text-neutral-50">
                {t.buyer}
              </td>
              <td className="whitespace-nowrap border-b border-neutral-800 px-4 py-3 text-neutral-50">
                {t.event || "—"}
              </td>
              <td className="whitespace-nowrap border-b border-neutral-800 px-4 py-3 text-neutral-50">
                {t.tickets}
              </td>
              <td className="whitespace-nowrap border-b border-neutral-800 px-4 py-3 text-neutral-50">
                {formatNaira(t.amount)}
              </td>
              <td className="whitespace-nowrap border-b border-neutral-800 px-4 py-3 text-neutral-50">
                {formatDate(t.date)}
              </td>
              <td className="whitespace-nowrap border-b border-neutral-800 px-4 py-3">
                <StatusBadge status={t.status} />
              </td>
              <td className="whitespace-nowrap border-b border-neutral-800 px-4 py-3">
                <button
                  type="button"
                  onClick={() => onViewDetails(t)}
                  className="text-violet-400 hover:text-violet-300 hover:underline"
                >
                  View details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  onPrev: () => void;
  onNext: () => void;
  onRowsPerPageChange: (value: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  rowsPerPage,
  onPrev,
  onNext,
  onRowsPerPageChange,
}: PaginationProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="text-sm text-neutral-400">
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={onPrev}
          className="rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm text-neutral-50 hover:bg-neutral-800 disabled:opacity-40"
        >
          Prev
        </button>
        <button
          type="button"
          className="rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium text-white"
        >
          {currentPage}
        </button>
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={onNext}
          className="rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm text-neutral-50 hover:bg-neutral-800 disabled:opacity-40"
        >
          Next
        </button>
        <select
          className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-50 focus:outline-none"
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
        >
          {[5, 8, 10, 20].map((n) => (
            <option key={n} value={n}>
              {n} / page
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
