import { cn } from "@/lib/utils";

type EventsPaginationProps = {
      className?: string;
      currentPage?: number;
      totalPages?: number;
      onPageChange?: (page: number) => void;
};

export default function EventsPagination({ className, currentPage = 1, totalPages = 1, onPageChange = () => {} }: EventsPaginationProps) {
      return (
            <div
                  className={cn(
                        "mt-auto flex flex-col items-center gap-4 pt-6 text-xs text-neutral-300 md:flex-row md:items-center md:justify-between",
                        className,
                  )}
            >
                  <span>
                        Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex items-center gap-2">
                        <button
                              type="button"
                              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                              disabled={currentPage <= 1}
                              className="h-7 rounded-md border border-neutral-800 bg-neutral-900 px-3 text-neutral-300 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:text-neutral-600"
                        >
                              Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                              <button
                                    key={page}
                                    type="button"
                                    aria-current={page === currentPage ? "page" : undefined}
                                    onClick={() => onPageChange(page)}
                                    className={`h-7 min-w-7 rounded-md border px-2 ${
                                          page === currentPage
                                                ? "border-purple-500 bg-purple-500/20 text-purple-300"
                                                : "border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
                                    }`}
                              >
                                    {page}
                              </button>
                        ))}
                        <button
                              type="button"
                              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                              disabled={currentPage >= totalPages}
                              className="h-7 rounded-md border border-neutral-800 bg-neutral-900 px-3 text-neutral-300 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:text-neutral-600"
                        >
                              Next
                        </button>
                  </div>
                  <label className="flex items-center gap-2 text-neutral-400">
                        <span>Page Size:</span>
                        <select
                              aria-label="Page size"
                              value="10"
                              className="h-7 rounded-md border border-neutral-800 bg-neutral-925 px-2 text-neutral-200 outline-none focus:border-purple-500"
                        >
                              <option value="10">10</option>
                        </select>
                  </label>
            </div>
      );
}
