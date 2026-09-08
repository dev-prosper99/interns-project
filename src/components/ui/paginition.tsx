import { useMemo, useState, type ReactNode } from "react";

interface PaginationProps<T> {
  items: T[];
  initialPageSize?: number;
  rowsPerPageOptions?: number[];
  children: (paginated: T[]) => ReactNode;
}

export function Pagination<T>({
  items,
  initialPageSize = 10,
  rowsPerPageOptions = [10, 25, 50, 100],
  children,
}: PaginationProps<T>) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialPageSize);

  const totalPages = Math.max(1, Math.ceil(items.length / rowsPerPage));
  const currentPage = Math.min(page, totalPages);

  const paginated = useMemo(
    () =>
      items.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage),
    [items, currentPage, rowsPerPage],
  );

  return (
    <>
      {children(paginated)}

      <div className="mt-4 flex items-center justify-between text-sm text-neutral-400">
        <span>
          Page {currentPage} of {totalPages}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-lg bg-neutral-800 px-3 py-1.5 text-neutral-300 hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Prev
          </button>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500 text-sm font-medium text-white">
            {currentPage}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-lg bg-neutral-800 px-3 py-1.5 text-neutral-300 hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>

        <div className="flex items-center gap-2">
          Page Size:
          <select
            className="rounded-lg bg-transparent px-2 py-1 text-neutral-50 focus:outline-none"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(1);
            }}
          >
            {rowsPerPageOptions.map((n) => (
              <option key={n} value={n} className="bg-neutral-900">
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}
