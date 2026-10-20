import { cn } from "@/lib/utils";

type EventsPaginationProps = {
      className?: string;
};

export default function EventsPagination({ className }: EventsPaginationProps) {
      return (
            <div
                  className={cn(
                        "mt-auto flex flex-col items-center gap-4 pt-6 text-xs text-neutral-300 md:flex-row md:items-center md:justify-between",
                        className,
                  )}
            >
                  <span>Page 1 of 1</span>
                  <div className="flex items-center gap-2">
                        <button
                              type="button"
                              disabled
                              className="h-7 rounded-md border border-neutral-800 bg-neutral-900 px-3 text-neutral-600 disabled:cursor-not-allowed"
                        >
                              Prev
                        </button>
                        <button
                              type="button"
                              aria-current="page"
                              className="h-7 min-w-7 rounded-md border border-purple-500 bg-purple-500/20 px-2 text-purple-300"
                        >
                              1
                        </button>
                        <button
                              type="button"
                              disabled
                              className="h-7 rounded-md border border-neutral-800 bg-neutral-900 px-3 text-neutral-600 disabled:cursor-not-allowed"
                        >
                              Next
                        </button>
                  </div>
                  <label className="flex items-center gap-2 text-neutral-400">
                        <span>Page Size:</span>
                        <select
                              aria-label="Page size"
                              defaultValue="10"
                              className="h-7 rounded-md border border-neutral-800 bg-neutral-925 px-2 text-neutral-200 outline-none focus:border-purple-500"
                        >
                              <option value="10">10</option>
                        </select>
                  </label>
            </div>
      );
}
