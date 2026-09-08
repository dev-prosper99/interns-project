// Types, formatters and sample/preview data for the Transactions feature.

export type TransactionStatus = "Completed" | "Pending" | "Refunded" | "Failed";

export interface Transaction {
  id: string;
  buyer: string;
  event: string;
  tickets: number;
  amount: number;
  date: string; // ISO date string
  status: TransactionStatus;
}

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .split("/")
    .join("-");
}

export const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: "txn-001",
    buyer: "Amaka Eze",
    event: "Lagos Comedy Jam",
    tickets: 2,
    amount: 27000,
    date: "2026-05-14",
    status: "Completed",
  },
  {
    id: "txn-002",
    buyer: "Emeka Nwosu",
    event: "Detty December Fest",
    tickets: 1,
    amount: 420000,
    date: "2026-04-27",
    status: "Completed",
  },
  {
    id: "txn-003",
    buyer: "Chioma Adeyemi",
    event: "Lagos Fashion Week",
    tickets: 3,
    amount: 420000,
    date: "2026-06-03",
    status: "Completed",
  },
  {
    id: "txn-004",
    buyer: "Ifeoma Balogun",
    event: "Southern Sound Fest",
    tickets: 1,
    amount: 420000,
    date: "2026-06-02",
    status: "Refunded",
  },
  {
    id: "txn-005",
    buyer: "Tunde Bello",
    event: "Aburi Comedy Night",
    tickets: 4,
    amount: 420000,
    date: "2026-06-14",
    status: "Completed",
  },
  {
    id: "txn-006",
    buyer: "Ngozi Obi",
    event: "Afro Nation Warmup",
    tickets: 2,
    amount: 420000,
    date: "2026-06-14",
    status: "Pending",
  },
  {
    id: "txn-007",
    buyer: "Emmanuel Daniel",
    event: "Owambe Weekender",
    tickets: 1,
    amount: 420000,
    date: "2026-06-14",
    status: "Completed",
  },
  {
    id: "txn-008",
    buyer: "Bisola Ajayi",
    event: "West Coast Weekly",
    tickets: 1,
    amount: 420000,
    date: "2026-06-14",
    status: "Completed",
  },
  {
    id: "txn-009",
    buyer: "Seun Adekunle",
    event: "Art Exhibition Lagos",
    tickets: 2,
    amount: 420000,
    date: "2026-06-14",
    status: "Completed",
  },
  {
    id: "txn-010",
    buyer: "Chinedu Okafor",
    event: "Fitness Journey",
    tickets: 1,
    amount: 420000,
    date: "2026-06-14",
    status: "Completed",
  },
];
